// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.4.0
pragma solidity ^0.8.20;

import "openzeppelin-contracts/contracts/utils/cryptography/ECDSA.sol";
import "openzeppelin-contracts/contracts/access/Ownable.sol";
import "openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";
import "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {SongNFT} from "../NFT_Contract/SongNFT.sol";
import {RoyaltySplitEscrow} from "./RoyaltySplitEscrow.sol";
import {BaseEscrow} from "./BaseEscrow.sol";

contract ConditionalEscrow is BaseEscrow, Ownable, ReentrancyGuard {
    using ECDSA for bytes32;

    struct Condition {
        uint256 songId; //songId for which condition is set
        uint256 minStreams; //min streams required for release
        uint256 minRevenue; //min revenue set, to be released
        uint256 unlockTime; //time to be taken for funds to be released
        address oracle; // relaying oracle
        bool requiresApproval; //approval for release from artist
    }

    struct StreamReport {
        uint256 songId;
        uint256 periodstart;
        uint256 periodEnd;
        uint256 plays;
        uint256 revenue;
        address reporter; // the oracle reporting.
        bytes32 reportHash;
        bool processed;
    }

    //Conditions chosen by artist mapped to its songId
    mapping(uint256 => Condition) public conditions;

    //report hash of the streamReport
    mapping(bytes32 => StreamReport) public reportHash;

    // Allowed oracle signers
    mapping(address => bool) public allowedOracles;

    //Escrow balances based on the tokenaddr to the songId to the amount held
    mapping(address => mapping(uint256 => uint256)) public balanceOf;

    //Artist assigned to each songId
    mapping(uint256 => address) public artist;

    //Mapping to track existing songIds
    mapping(uint256 => bool) public songExists;

    // Reference to the SongNFT contract
    SongNFT public songNFTContract;

    event ConditionSet(uint256 indexed songId, Condition condition);
    event OracleUpdated(address indexed oracle, bool allowed);
    event ReportSubmitted(bytes32 indexed reportHash, uint256 songId, uint256 plays, uint256 revenue, address reporter);
    event ReportProcessed(address indexed payer, address token, uint256 indexed songId, bool conditionMet);
    event FundsDeposited(address indexed payer, address token, uint256 indexed songId, uint256 amount);
    event FundsReleased(uint256 indexed songId, address recipient, uint256 amount);
    event Deposited(address indexed account, address indexed payer, uint256 amount, uint256 songId, uint256 chainId);

    constructor(address _owner, address _songNFTAddress, address _platformFeeReceiver)
        BaseEscrow(_platformFeeReceiver)
        Ownable(_owner)
    {
        songNFTContract = SongNFT(_songNFTAddress);
    }

    function setCondition(uint256 songId, uint256 minStreams, uint256 unlockTime, address oracle, bool requiresApproval)
        external
    {
        require(msg.sender == artist[songId], "Only artist can set condition");
        require(!songExists[songId], "Condition already exists for this song");
        songExists[songId] = true;

        conditions[songId] = Condition({
            songId: songId,
            minStreams: minStreams,
            minRevenue: 0,
            unlockTime: unlockTime,
            oracle: oracle,
            requiresApproval: requiresApproval
        });

        emit ConditionSet(songId, conditions[songId]);
    }

    function setOracle(address oracle, bool allowed) external onlyOwner {
        allowedOracles[oracle] = allowed;
        emit OracleUpdated(oracle, allowed);
    }

    function depositETH(address account, address payer, uint256 songId, uint256 amount, uint256 chainId)
        external
        payable
        nonReentrant
    {
        require(msg.sender == payer, "The sender is not authorised");
        require(msg.value >= amount, "ETH amount is less than required amount");
        require(balanceOf[account][songId] > 0, "Account does not hold the nft");
        require(songExists[songId], "SongId does not exist");

        balanceOf[address(0)][songId] += amount;

        emit Deposited(account, msg.sender, songId, msg.value, chainId);
    }

    function depositERC20(
        address account,
        address payer,
        address token,
        uint256 amount,
        uint256 songId,
        uint256 chainId
    ) external payable nonReentrant {
        require(msg.sender == payer, "The sender is not authorised");
        require(msg.value >= amount, "ETH amount is less than required amount");
        require(balanceOf[account][songId] > 0, "Account does not hold the nft");
        require(songExists[songId], "SongId does not exist");

        IERC20(token).transferFrom(msg.sender, address(this), amount);
        balanceOf[token][songId] += amount;

        emit Deposited(account, msg.sender, amount, songId, chainId);
    }

    function submitSignedReport(
        uint256 songid,
        uint256 periodStart,
        uint256 periodEnd,
        uint256 plays,
        uint256 revenue,
        bytes memory signature
    ) external {
        Condition memory condition = conditions[songid];
        require(condition.songId != 0, "No condition set for songId");
        require(allowedOracles[condition.oracle], "Oracle not allowed");

        bytes32 newReportHash = keccak256(abi.encodePacked(songid, periodStart, periodEnd, plays, revenue, msg.sender));
        address signer = _verifyReportSigner(newReportHash, signature);
        require(signer == condition.oracle, "Invalid report signature");

        StreamReport storage report = reportHash[newReportHash];
        require(!report.processed, "Report already processed");

        report.songId = songid;
        report.periodstart = periodStart;
        report.periodEnd = periodEnd;
        report.plays = plays;
        report.revenue = revenue;
        report.reporter = msg.sender;
        report.reportHash = newReportHash;
        report.processed = false;

        emit ReportSubmitted(newReportHash, songid, plays, revenue, msg.sender);
    }

    function _processReport(bytes32 newReportHash) internal {
        StreamReport storage report = reportHash[newReportHash];
        require(!report.processed, "Report already processed");

        Condition memory condition = conditions[report.songId];
        bool met = conditionMet(report.songId, report.plays, report.revenue);

        report.processed = true;

        emit ReportProcessed(report.reporter, address(0), report.songId, met);
    }

    function _releaseFunds(address token, uint256 songId) internal nonReentrant {
        uint256 amount = balanceOf[token][songId];
        require(amount > 0, "No funds to release");

        address recipient = artist[songId];
        balanceOf[token][songId] = 0;

        if (token == address(0)) {
            payable(recipient).transfer(amount);
        } else {
            IERC20(token).transfer(recipient, amount);
        }

        emit FundsReleased(songId, recipient, amount);
    }

    function approveRelease(address token, uint256 songId) external nonReentrant {
        Condition memory condition = conditions[songId];
        require(condition.requiresApproval, "Approval not required for this condition");
        require(msg.sender == artist[songId], "Only artist can approve release");

        _releaseFunds(token, songId);
    }

    function _verifyReportSigner(bytes32 newReportHash, bytes memory signature) internal pure returns (address) {
        // Hash needs to be prefixed according to EIP-191
        bytes32 messageHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", newReportHash));
        return ECDSA.recover(messageHash, signature);
    }

    function conditionMet(uint256 songId, uint256 plays, uint256 revenue) public view returns (bool) {
        Condition memory condition = conditions[songId];
        if (plays >= condition.minStreams && revenue >= condition.minRevenue) {
            return true;
        }
        return false;
    }
}
