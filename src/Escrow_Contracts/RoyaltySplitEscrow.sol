// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-contracts/contracts/access/Ownable.sol";
import "openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";
import {BaseEscrow} from "./BaseEscrow.sol";
import {ConditionalEscrow} from "./ConditionalEscrow.sol";
import {SongNFT} from "../NFT_Contract/SongNFT.sol";

contract RoyaltySplitEscrow is BaseEscrow, Ownable, ReentrancyGuard {
    struct Recipient {
        address recipient;
        uint96 share;
        bool verified;
    }

    struct RoyaltyInfo {
        uint256 totalShares;
        uint256 totalReleased;
        address paymentToken;
        bool isLocked;
    }

    //mapping the song id to the recipient or recipients array
    mapping(uint256 => Recipient[]) public recipients;

   
    // mapping to authorize escrow
    mapping(address => bool) public approvedEscrow;

    // mapping the songId to the royaltyInfo of that Id
    mapping(uint256 => RoyaltyInfo) public royaltyInfo;

    // mapping the songId to the recipient and the amount released
    mapping(uint256 => mapping(address => uint256)) public balances;

    // //mapp
    // mapping(address => uint256) public balance;

    // mapping the songId to its balance held in a particular token's address
    mapping(address => mapping(uint256 => uint256)) public tokenBalances;

    // mapping the songId to the artist/creator
    mapping(uint256 => address) public mainArtist;

    event RecipientsAdded(uint256 indexed songId, Recipient[] recipients);
    event RecipientVerified(uint256 indexed song, address recipient);
    event DistributionLocked(uint256 indexed songId);
    event FundsDeposited(address indexed payer, address token, uint256 totalAmount);
    event FundsReleased(uint256 indexed songId, address token, uint256 totalAmount);
    event RoyaltyPaid(uint256 indexed songId, address indexed recipient, uint256 amount, address token);
    event PaymentTokenUpdated(uint256 indexed songId, address token);

    SongNFT public songNFTContract;

    constructor(address _owner, address _songNFTAddress) BaseEscrow(_owner) Ownable(_owner) {
        songNFTContract = SongNFT(_songNFTAddress);
    }

    //ADMIN FUNCTIONS

    function setRecipients(uint256 songId, address[] calldata wallets, uint96[] calldata shares) external onlyOwner {
        require(!royaltyInfo[songId].isLocked, "Distribution is locked");
        require(wallets.length == shares.length, "Wallets and shares length mismatch");
        require(wallets.length > 0, "No recipients provided");

        delete recipients[songId];

        uint256 totalShares = 0;

        for (uint256 i = 0; i < wallets.length; i++) {
            require(wallets[i] != address(0), "Invalid wallet address");
            require(shares[i] > 0, "Share must be greater than zero");

            recipients[songId].push(Recipient({recipient: wallets[i], share: shares[i], verified: false}));

            totalShares += shares[i];
        }

        royaltyInfo[songId].totalShares = totalShares;

        emit RecipientsAdded(songId, recipients[songId]);
    }

    function lockDistribution(uint256 songId) external onlyOwner {
        require(!royaltyInfo[songId].isLocked, "Distribution already locked");
        require(recipients[songId].length > 0, "No recipients are set");

        for (uint256 i = 0; i < recipients[songId].length; i++) {
            require(recipients[songId][i].verified, "All recipients are not verified");
        }

        royaltyInfo[songId].isLocked = true;
        emit DistributionLocked(songId);
    }

    function verifyRecipient(uint256 songId, address recipient) external onlyOwner {
        require(!royaltyInfo[songId].isLocked, "Distribution is locked");
        require(recipient != address(0), "Invalid recipient address");

        bool found = false;
        for (uint256 i = 0; i < recipients[songId].length; i++) {
            if (recipients[songId][i].recipient == recipient) {
                recipients[songId][i].verified = true;
                found = true;
                break;
            }
        }

        require(found, "Recipient not found");
        emit RecipientVerified(songId, recipient);
    }

    function setPaymentToken(uint256 songId, address token) external onlyOwner {
        require(!royaltyInfo[songId].isLocked, "Distribution is locked");
        require(token != address(0), "Invalid token address");

        royaltyInfo[songId].paymentToken = token;
        emit PaymentTokenUpdated(songId, token);
    }

    // INTERNAL DISTRIBUTION LOGIC FOR ROYALTY SPLITS

    function authorizeEscrow(address escrow, bool status) external onlyOwner {
        require(escrow != address(0), "Invalid escrow address");
        approvedEscrow[escrow] = status;
    }

    function _autoDistribute(uint256 songId, address token, uint256 totalAmount) internal {
        require(recipients[songId].length > 0, "No recipients are set");
        require(royaltyInfo[songId].totalShares > 0, "No shares have been set");

        // Calculate the platform fee
        uint256 platformFeeAmount = _calculatePlatformFee(totalAmount);

        // Transfer the platform fee to the platformFeeReceiver
        if (platformFeeAmount > 0) {
            if (token == address(0)) {
                // Transfer ETH platform fee
                (bool success,) = platformFeeReceiver.call{value: platformFeeAmount}("");
                require(success, "ETH platform fee transfer failed");
            } else {
                // Transfer ERC20 platform fee
                IERC20(token).transfer(platformFeeReceiver, platformFeeAmount);
            }
        }

        // Remaining amount after deducting the platform fee
        uint256 remainingAmount = totalAmount - platformFeeAmount;

        // Distribute the remaining amount to recipients
        for (uint256 i = 0; i < recipients[songId].length; i++) {
            address recipient = recipients[songId][i].recipient;
            uint256 share = recipients[songId][i].share;

            uint256 payment = _calculateShare(remainingAmount, share, royaltyInfo[songId].totalShares);
            if (payment > 0) {
                if (token == address(0)) {
                    // Transfer ETH to recipient
                    (bool success,) = recipient.call{value: payment}("");
                    require(success, "ETH Transfer failed");
                } else {
                    // Transfer ERC20 to recipient
                    IERC20(token).transfer(recipient, payment);
                }
                balances[songId][recipient] += payment;
                royaltyInfo[songId].totalReleased += payment;
                emit RoyaltyPaid(songId, recipient, payment, token);
            }
        }

        emit FundsReleased(songId, token, totalAmount);
    }

    function onFundsReleased(uint256 songId, address token, uint256 totalAmount) external nonReentrant {
        require(approvedEscrow[msg.sender], "Unauthorized Escrow");
        require(totalAmount > 0, "Insufficient release amount");

        tokenBalances[token][songId] += totalAmount;

        _autoDistribute(songId, token, totalAmount);

        emit FundsReleased(songId, token, totalAmount);
    }

    //DEPOSIT FUNCTIONS

    function depositETH(uint256 songId) external payable nonReentrant {
        require(msg.value > 0, "No ETH sent");
        require(royaltyInfo[songId].isLocked, "Distribution not locked");

        tokenBalances[address(0)][songId] += msg.value;

        emit FundsDeposited(msg.sender, address(0), msg.value);
    }

    function depositERC20(uint256 songId, uint256 amount) external nonReentrant {
        require(amount > 0, "No tokens set");
        require(royaltyInfo[songId].isLocked, "Distribution not locked");
        address token = royaltyInfo[songId].paymentToken;
        require(token != address(0), "Payment token not set");
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        tokenBalances[token][songId] += amount;
        emit FundsDeposited(msg.sender, token, amount);
    }

    //ROYALTY RELEASE FUNCTIONS

    function releaseAll(uint256 songId, address token) external nonReentrant {
        require(tokenBalances[token][songId] > 0, "No funds to release");
        require(recipients[songId].length > 0, "No funds to release");
        require(royaltyInfo[songId].totalShares > 0, "No shares have been set");
        uint256 totalReleased = 0;
        for (uint256 i = 0; i < recipients[songId].length; i++) {
            address recipient = recipients[songId][i].recipient;
            uint256 share = recipients[songId][i].share;

            uint256 payment = (tokenBalances[token][songId] * share) / royaltyInfo[songId].totalShares;
            if (payment > 0) {
                tokenBalances[token][songId] -= payment;
                balances[songId][recipient] += payment;
                totalReleased += payment;
                emit RoyaltyPaid(songId, recipient, payment, token);
            }
        }
    }

    function claimShare(uint256 songId, address token) external nonReentrant {
        require(balances[songId][msg.sender] > 0, "No funds to claim");
        
        uint256 share = 0;
        for (uint256 i = 0; i < recipients[songId].length; i++) {
            if (recipients[songId][i].recipient == msg.sender) {
                share = recipients[songId][i].share;
                break;
            }
        }
        require(share > 0, "Recipient not found");
        
        uint256 payment = (balances[songId][msg.sender] * share) / royaltyInfo[songId].totalShares;
        balances[songId][msg.sender] = 0;

        if (token == address(0)) {
            (bool success,) = msg.sender.call{value: payment}("");
            require(success, "ETH Transfer failed");
        } else {
            IERC20(token).transfer(msg.sender, payment);
        }

        emit RoyaltyPaid(songId, msg.sender, payment, token);
    }

    // INTERNAL HELPERS

    function _buildRecipientArray(address[] calldata wallets, uint96[] calldata shares)
        internal
        pure
        returns (Recipient[] memory)
    {
        require(wallets.length == shares.length, "Wallets and shares length mismatch");
        Recipient[] memory recipientArray = new Recipient[](wallets.length);
        for (uint256 i = 0; i < wallets.length; i++) {
            recipientArray[i] = Recipient({recipient: wallets[i], share: shares[i], verified: false});
        }
        return recipientArray;
    }

    function _calculateShare(uint256 amount, uint256 share, uint256 totalShares) internal pure returns (uint256) {
        return (amount * share) / totalShares;
    }

    //VIEW FUNCTIONS
    function getRecipients(uint256 songId) external view returns (Recipient[] memory) {
        return recipients[songId];
    }

    function pendingShare(uint256 songId, address recipient, address token) external view returns (uint256) {
        uint256 totalBalance = token == address(0) ? tokenBalances[address(0)][songId] : tokenBalances[token][songId];
        uint256 released = balances[songId][recipient];
        uint256 share = 0;
        for (uint256 i = 0; i < recipients[songId].length; i++) {
            if (recipients[songId][i].recipient == recipient) {
                share = recipients[songId][i].share;
                break;
            }
        }
        require(share > 0, "Recipient not found");
        uint256 totalShares = royaltyInfo[songId].totalShares;
        uint256 payment = (totalBalance * share) / totalShares;
        return payment - released;
    }
}
