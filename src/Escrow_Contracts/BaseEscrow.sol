// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

abstract contract BaseEscrow {
    uint256 public platformFee; // Platform fee in basis points (e.g., 100 = 1%)
    address public platformFeeReceiver; // Address to receive platform fees

    event PlatformFeeUpdated(uint256 newFee);
    event PlatformFeeReceiverUpdated(address newReceiver);

    constructor(address _platformFeeReceiver) {
        require(_platformFeeReceiver != address(0), "Invalid fee receiver");

        platformFee = 100; // Set the standard platform fee to 100 basis points (1%)
        platformFeeReceiver = _platformFeeReceiver;
    }

    // Function to update the platform fee
    function setPlatformFee(uint256 _platformFee) external {
        require(msg.sender == platformFeeReceiver, "Only fee receiver can update");
        require(_platformFee <= 10000, "Fee exceeds 100%");
        platformFee = _platformFee;
        emit PlatformFeeUpdated(_platformFee);
    }

    // Function to update the platform fee receiver
    function setPlatformFeeReceiver(address _platformFeeReceiver) external {
        require(msg.sender == platformFeeReceiver, "Only fee receiver can update");
        require(_platformFeeReceiver != address(0), "Invalid fee receiver");
        platformFeeReceiver = _platformFeeReceiver;
        emit PlatformFeeReceiverUpdated(_platformFeeReceiver);
    }

    // Internal function to calculate platform fees
    function _calculatePlatformFee(uint256 amount) internal view returns (uint256) {
        return (amount * platformFee) / 10000;
    }
}
