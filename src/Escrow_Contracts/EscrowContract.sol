// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.4.0
pragma solidity ^0.8.20;

import "openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";
import "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-contracts/contracts/access/Ownable.sol";
import {SongNFT} from "../NFT_Contract/SongNFT.sol";
import {RoyaltySplitEscrow} from "./RoyaltySplitEscrow.sol";
import {BaseEscrow} from "./BaseEscrow.sol";

contract EscrowContract is BaseEscrow, ReentrancyGuard {
    // Mapping that checks the amount held by an ID minted by an account
    mapping(address => mapping(uint256 => uint256)) public balances;

    // Mapping that stores the artist payout address per songId
    mapping(uint256 => address) public artistOfSong;

    // mapping that checks whether a token is accepted as payment
    mapping(address => bool) private _allowedTokens;

    //Mapping to track existing songIds
    mapping(uint256 => bool) public songExists;

    address public owner;
    SongNFT public songNFTContract;

    constructor(address _owner, address _platformFeeReceiver, address _songNFTAddress) BaseEscrow(_platformFeeReceiver) {
        owner = _owner;
        songNFTContract = SongNFT(_songNFTAddress);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    modifier onlyAllowedToken(address token) {
        require(_allowedTokens[token], "Token not supported");
        _;
    }

    event TokenAllowed(address token);
    event TokenRemoved(address token);

    event Deposited(address indexed account, address indexed payer, uint256 amount, uint256 songId);
    event Withdrawn(address indexed account, uint256 amount, uint256 songId, uint256 chainId);
    event Balance(address indexed account, uint256 amount, uint256 songId);

    function allowToken(address token) external onlyOwner {
        _allowedTokens[token] = true;

        emit TokenAllowed(token);
    }

    function removeToken(address token) external onlyOwner {
        _allowedTokens[token] = false;

        emit TokenRemoved(token);
    }

    function isTokenAllowed(address token) external view returns (bool) {
        return _allowedTokens[token];
    }

    function depositETH(address account, address payer, uint256 songId, uint256 amount) external payable nonReentrant {
        require(msg.sender == payer, "The sender is not authorised");
        require(msg.value >= amount, "ETH amount is less than required amount");
        // Check NFT ownership via the SongNFT contract
        require(songNFTContract.balanceOf(account, songId) > 0, "Account does not hold the nft");

        balances[address(0)][songId] += amount;

        emit Deposited(account, msg.sender, amount, songId);
    }

    function depositERC20(address account, address payer, address token, uint256 amount, uint256 songId)
        external
        nonReentrant
        onlyAllowedToken(token)
    {
        require(msg.sender == payer, "The sender is not authorised");
        // Check NFT ownership via the SongNFT contract
        require(songNFTContract.balanceOf(account, songId) > 0, "Account does not hold the nft");

        IERC20(token).transferFrom(msg.sender, address(this), amount);
        balances[token][songId] += amount;

        emit Deposited(account, msg.sender, amount, songId);
    }

    // Single artist withdraw function (payee calls)
    function withdrawETH(uint256 requestedAmount, uint256 songId) external nonReentrant {
        address account = msg.sender;
        uint256 availableAmount = balances[address(0)][songId];
        require(availableAmount >= requestedAmount, "Insufficient ETH balance");

        // Calculate platform fee
        uint256 fee = _calculatePlatformFee(requestedAmount);
        uint256 amountToWithdraw = requestedAmount - fee;

        // Decrease stored balance
        balances[address(0)][songId] = availableAmount - requestedAmount;

        // Transfer the platform fee to the fee receiver
        if (fee > 0) payable(platformFeeReceiver).transfer(fee);

        require(account != address(0), "Invalid payee");

        (bool success,) = payable(account).call{value: amountToWithdraw}("");
        require(success, "ETH transfer failed");

        emit Withdrawn(account, amountToWithdraw, songId, block.chainid);
    }
    // multiple artists withdraw function based on royalty splits

    function withdrawERC20(address token, uint256 requestedAmount, uint256 songId) external nonReentrant onlyAllowedToken(token) {
        address account = msg.sender;
        uint256 availableAmount = balances[token][songId];
        require(availableAmount >= requestedAmount, "Insufficient token balance");

        // Calculate platform fee
        uint256 fee = _calculatePlatformFee(requestedAmount);
        uint256 amountToWithdraw = requestedAmount - fee;

        // Decrease stored balance
        balances[token][songId] = availableAmount - requestedAmount;

        require(account != address(0), "Invalid payee");

        // Transfer the platform fee to the fee receiver
        if (fee > 0) IERC20(token).transfer(platformFeeReceiver, fee);

        // Transfer remaining tokens to account
        IERC20(token).transfer(account, amountToWithdraw);

        emit Withdrawn(account, amountToWithdraw, songId, block.chainid);
    }

    function balanceOfAccount(address account, uint256 songId) external view onlyOwner returns (uint256) {
        return balances[account][songId];
    }
}
