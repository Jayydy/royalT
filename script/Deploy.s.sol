// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/NFT_Contract/SongNFT.sol";
import "../src/Escrow_Contracts/BaseEscrow.sol";
import "../src/Escrow_Contracts/RoyaltySplitEscrow.sol";
import "../src/Escrow_Contracts/ConditionalEscrow.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        // Set gas settings
        vm.txGasPrice(1_000_000_000); // 1 gwei
        vm.startBroadcast(deployerPrivateKey);

        // Deploy SongNFT first
        SongNFT songNFT = new SongNFT(deployer);

        // Set platform fee receiver address (replace with actual address)
        address platformFeeReceiver = msg.sender; // Change this to your desired fee receiver

        // Deploy RoyaltySplitEscrow
        RoyaltySplitEscrow royaltySplitEscrow = new RoyaltySplitEscrow(
            deployer, // owner
            platformFeeReceiver
        );
        console.log("RoyaltySplitEscrow deployed to:", address(royaltySplitEscrow));

        // Deploy ConditionalEscrow
        ConditionalEscrow conditionalEscrow = new ConditionalEscrow(
            deployer, // owner
            address(songNFT),
            platformFeeReceiver
        );

        console.log("Deployer address:", deployer);
        console.log("SongNFT deployed to:", address(songNFT));
        console.log("ConditionalEscrow deployed to:", address(conditionalEscrow));

        vm.stopBroadcast();
    }
}
