// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/NFT_Contract/SongNFT.sol";

contract DeploySongNFT is Script {
    function run() public returns (SongNFT) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address owner = vm.envAddress("OWNER_ADDRESS");

        vm.startBroadcast(deployerPrivateKey);
        
        SongNFT songNFT = new SongNFT(owner);
        
        vm.stopBroadcast();
        return songNFT;
    }
}
