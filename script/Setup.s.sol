// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/NFT_Contract/SongNFT.sol";
import "../src/Escrow_Contracts/RoyaltySplitEscrow.sol";
import "../src/Escrow_Contracts/ConditionalEscrow.sol";

contract SetupScript is Script {
    // Contract addresses from deployment
    address constant SONG_NFT = 0xCeEf4AF4615D1B17471Bb1dCe1e96ea04Ab238ac;
    address constant ROYALTY_SPLIT_ESCROW = 0xc7686cd02dF92234af7eB425Dad9044C7eDAdD6E;
    address constant CONDITIONAL_ESCROW = 0x28BF3342dc25eA963b8Be2B8EcD09689aC285463;

    // Test oracle address for conditional escrow
    address constant TEST_ORACLE = 0x3715B8e78eF1B3AA8bE120ed977deDB5Ca8B99Bc;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        vm.startBroadcast(deployerPrivateKey);

        // Setup SongNFT
        SongNFT songNFT = SongNFT(SONG_NFT);
        
        // Setup RoyaltySplitEscrow
        RoyaltySplitEscrow royaltySplitEscrow = RoyaltySplitEscrow(ROYALTY_SPLIT_ESCROW);
        
        // Setup ConditionalEscrow
        ConditionalEscrow conditionalEscrow = ConditionalEscrow(CONDITIONAL_ESCROW);
        
        // 1. Set oracle in ConditionalEscrow
        conditionalEscrow.setOracle(TEST_ORACLE, true);
        console.log("Set oracle", TEST_ORACLE, "in ConditionalEscrow");

        // 2. Test initial configuration
        console.log("SongNFT owner:", songNFT.owner());
        console.log("RoyaltySplitEscrow owner:", royaltySplitEscrow.owner());
        console.log("ConditionalEscrow owner:", conditionalEscrow.owner());

        vm.stopBroadcast();
        console.log("Initial configuration completed");
    }
}