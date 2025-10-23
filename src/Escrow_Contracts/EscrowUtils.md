//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {songNFT} from "royalT/src/NFT Contract/songNFT.sol";         


contract EscrowUtils is ReentrancyGuard {
    using Address for address payable;

    struct EscrowRecord {
        address token;       // Address of the token (address(0) for ETH)
        uint256 amount;      // Amount held in escrow
        uint256 songId;      // Associated song ID
        address payer;       // Address of the payer
        address payee;       // Address of the payee (artist)
    }


    mapping(address => mapping(address => uint256)) internal balances; // token => (account => balance)
    mapping(uint256 => EscrowRecord) internal escrowRecords; // recordId => EscrowRecord
    mapping(address => uint256) internal totalDeposited; // account => total deposited amount
    mapping(address => uint256) internal totalWithdrawn; // account => total withdrawn amount
    mapping(uint256 => address) internal artistOfSong; // songId => artist address
    mapping(uint256 => mapping(address => uint256)) internal escrowRelease; // songId => (token => amount)
    mapping(uint256 => bool) internal _exists; // songId => exists  

    event Deposit(
        address indexed payer,
        address indexed payee,
        address indexed token,
        uint256 amount,
        uint256 songId
    );
    event Withdrawal(
        address indexed payee,
        address indexed token,
        uint256 amount,
        uint256 songId
    );

    event BalanceUpdated(
        address indexed account,
        address indexed token,
        uint256 newBalance
    );

    

    modifier nonZeroAddress(address addr) {
        require(addr != address(0), "Address cannot be zero");
        _;
    }

    modifier validAmount(uint256 amount) {
        require(amount > 0, "Amount must be greater than zero");
        _;
    }

    function _deposit(
        address payer,
        address payee,
        address token,
        uint256 amount,
        uint256 songId
    ) internal nonZeroAddress(payer) nonZeroAddress(payee) validAmount(amount) {
        if(token == address(0)) {
            // Handle ETH deposit
            require(msg.value >= amount, "Insufficient ETH sent");
        } else {
            // Handle ERC20 deposit
            IERC20(token).transferFrom(payer, address(this), amount);
        }
        // Update balances
        balances[token][payee] += amount;
        totalDeposited[payee] += amount;

        // Create and store the escrow record
        uint256 recordId = uint256(keccak256(abi.encodePacked(block.timestamp, payer, payee, token, amount, songId)));
        escrowRecords[recordId] = EscrowRecord({
            token: token,
            amount: amount,
            songId: songId,
            payer: payer,
            payee: payee
        });

        emit Deposit(payer, payee, token, amount, songId);
        emit BalanceUpdated(payee, token, balances[token][payee]);
    }

    function _handleWithdraw(
        address payee,
        address token,
        uint256 amount,
        uint256 songId
    ) internal nonZeroAddress(payee) validAmount(amount) nonReentrant {
        require(balances[token][payee] >= amount, "Insufficient balance");
        require(!escrow.released, "EscrowUtils: Funds already released");
        require(escrow.amount > 0, "EscrowUtils: No funds to release");

        uint256 amount = escrow.amount;
        escrow.released = true;
        balances[token][payee] -= amount;
        totalWithdrawn[payee] += amount;

        // Update balances
        balances[token][payee] -= amount;
        totalWithdrawn[payee] += amount;

        // Transfer funds
        if(token == address(0)) {
            // Handle ETH withdrawal
            payable(payee).sendValue(amount);
        } else {
            // Handle ERC20 withdrawal
            IERC20(token).transfer(payee, amount);
        }

        emit Withdrawal(payee, token, amount, songId);
        emit BalanceUpdated(payee, token, balances[token][payee]);
    }

    function _getBalance( address token, 
    address user)
    internal view returns (uint256){
        return balances[token][user];
    }

    function _getEscrowRecord(uint256 songId)
    internal view returns (EscrowRecord memory) {
        return escrowRecords[songId];
    }

    function _isEscrowReleased(uint256 songId)
    internal view returns (bool) {
    return escrowRecords[songId].released;
    }

    function _resetEscrow(uint256 songId)
    internal{
        delete escrowRecords[songId];
    }
}