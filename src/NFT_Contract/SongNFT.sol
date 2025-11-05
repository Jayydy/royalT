// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.4.0
pragma solidity ^0.8.20;

import {ERC1155} from "openzeppelin-contracts/contracts/token/ERC1155/ERC1155.sol";
import {ERC1155Burnable} from "openzeppelin-contracts/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import {ERC1155Supply} from "openzeppelin-contracts/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import {ERC2981} from "openzeppelin-contracts/contracts/token/common/ERC2981.sol";
import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";

contract SongNFT is ERC1155, ERC2981, ERC1155Burnable, Ownable, ERC1155Supply {
    constructor(address initialOwner) ERC1155("") Ownable(initialOwner) {}

    //Metadata for each song NFT

    struct SongMetadata {
        string URI;
        uint256 price;
        uint256 totalSupply;
        address royaltyReceiver;
        uint96 royaltyFee;
        address royaltySplit;
    }

    event SongNFTMinted(address indexed account, uint256 amount, uint256 songId);
    event SongNFTBatchMinted(address indexed to, uint256[] amounts, uint256[] songIds, bytes data);
    // event TransferSingle(address indexed from, address indexed to, uint256 amount, bytes data);
    // event TransferBatch(address indexed from, address[] indexed to, uint256[] amounts, bytes data);
    event SetURI(string uri, uint256 songId);

    //Maps each songId for the ERC1155 tokenId to its metadata
    mapping(uint256 => SongMetadata) private _songData;

    //Maps each songId to its URI
    mapping(uint256 => string) private _songURIs;

    // Track supply balances
    mapping(uint256 => uint256) private _currentSupply;

    //To ensure the artist is the NFT owner
    mapping(uint256 => address) private _songNFTCreator;

    //To check if a songId has already been assigned
    mapping(uint256 => bool) private _exists;

    function mintSongNFT(
        address account,
        uint256 price,
        uint256 songId,
        uint256 amount,
        string memory songURI,
        address royaltyReceiver,
        uint96 feeNumerator,
        address royaltySplit
    ) public onlyOwner {
        require(!_exists[songId], "NFT Id already exists"); // Check if NFT Id already exists
        require(bytes(songURI).length > 0, "NFT URI not assigned"); // Check if the provided songURI is valid
        require(amount > 0, "Invalid value for NFT amount");

        _mint(account, songId, amount, "");

        _songData[songId] = SongMetadata({
            URI: songURI,
            price: price,
            totalSupply: amount,
            royaltyReceiver: royaltyReceiver,
            royaltyFee: feeNumerator,
            royaltySplit: royaltySplit
        });

        _exists[songId] = true;
        _currentSupply[songId] = amount;
        _songNFTCreator[songId] = msg.sender;

        emit SongNFTMinted(account, amount, songId);
    }

    // function mintBatchNFT(
    //     address account,
    //     uint256[] calldata prices,
    //     uint256[] calldata songIds,
    //     uint256[] calldata amounts,
    //     string[] memory songURIs,
    //     address[] calldata royaltyReceivers,
    //     uint256[] calldata feeNumerators,
    //     address[] calldata royaltySplits
    // ) public onlyOwner {
    //     require(songIds.length == amounts.length, "NFT data is incomplete");
    //     for (uint256 i = 0; i < amounts.length; i++) {
    //         require(amounts[i] > 0, "Invalid values for NFT amounts");
    //     }
    //     for (uint256 i = 0; i < songIds.length; i++) {
    //         require(bytes(_songData[songIds[i]].URI).length > 0, "NFT id is not assigned");
    //     }
    //     for (uint256 i = 0; i < songURIs.length; i++) {
    //         require(bytes(songURIs[i]).length > 0, "NFT uri is not assigned");
    //     }

    //     // Checking input consistency in all arrays
    //     uint256 length = songIds.length;

    //     require(
    //         length == amounts.length && length == prices.length && length == songURIs.length
    //             && length == royaltyReceivers.length && length == feeNumerators.length && length == royaltySplits.length,
    //         "Arrays length mismatch"
    //     );

    //     mintBatchNFT(account, prices, songIds, amounts, songURIs, royaltyReceivers, feeNumerators, royaltySplits);

    //     //Storing metadata for each song
    //     for (uint256 i = 0; i < length; i++) {
    //         uint256 songId = songIds[i];
    //         require(!_exists[songId], "NFT Ids are already assigned");

    //         _songData[songId] = SongMetadata({
    //             URI: songURIs[i],
    //             price: prices[i],
    //             totalSupply: amounts[i],
    //             royaltyReceiver: royaltyReceivers[i],
    //             royaltyFee: uint96(feeNumerators[i]),
    //             royaltySplit: royaltySplits[i]
    //         });

    //         _exists[songId] == true;
    //         _currentSupply[songId] = amounts[i];
    //         _songNFTCreator[songId] = msg.sender;
    //     }
    // }

    function setSongURI(uint256 songId, string memory newURI) external onlyOwner {
        _songURIs[songId] = newURI;
        emit SetURI(newURI, songId);
    }

    function uri(uint256 songId) public view override returns (string memory) {
        return _songURIs[songId];
    }

    function setRoyalty(uint256 songId, address receiver, uint96 feeNumerator) external onlyOwner {
        _setTokenRoyalty(songId, receiver, feeNumerator);
    }

    // The following functions are overrides required by Solidity.

    function _update(address from, address to, uint256[] memory ids, uint256[] memory values)
        internal
        override(ERC1155, ERC1155Supply)
    {
        super._update(from, to, ids, values);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC1155, ERC2981) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
