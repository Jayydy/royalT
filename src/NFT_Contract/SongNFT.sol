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

        // set token royalty so marketplaces can read it
        _setTokenRoyalty(songId, royaltyReceiver, feeNumerator);

        emit SongNFTMinted(account, amount, songId);
    }

    /**
     * Owner-only: register a song for public sale (no tokens minted to users yet).
     * Set metadata, totalSupply (available supply) and royalty info.
     */
    function createSong(
        uint256 songId,
        uint256 price,
        uint256 totalSupply,
        string memory songURI,
        address royaltyReceiver,
        uint96 feeNumerator,
        address royaltySplit
    ) external onlyOwner {
        require(!_exists[songId], "Song id already exists");
        require(bytes(songURI).length > 0, "URI required");
        require(totalSupply > 0, "totalSupply > 0");

        _songData[songId] = SongMetadata({
            URI: songURI,
            price: price,
            totalSupply: totalSupply,
            royaltyReceiver: royaltyReceiver,
            royaltyFee: feeNumerator,
            royaltySplit: royaltySplit
        });

        _songURIs[songId] = songURI;
        _exists[songId] = true;
        _currentSupply[songId] = totalSupply;
        _songNFTCreator[songId] = msg.sender;

        // register royalty data on-chain for marketplaces
        _setTokenRoyalty(songId, royaltyReceiver, feeNumerator);
    }

    /**
     * Public payable function: buy/mint amount of songId tokens to caller.
     * Buyer must send price * amount in msg.value. Funds are forwarded to the contract owner.
     */
    function buySongNFT(uint256 songId, uint256 amount) external payable {
        require(_exists[songId], "Song not available for sale");
        require(amount > 0, "Invalid amount");
        SongMetadata storage meta = _songData[songId];
        require(meta.totalSupply > 0, "Song not configured");
        require(_currentSupply[songId] >= amount, "Not enough supply");

        uint256 totalPrice = meta.price * amount;
        require(msg.value == totalPrice, "Incorrect payment");

        // Effects: decrement available supply before external calls
        _currentSupply[songId] -= amount;

        // Interaction: mint to buyer
        _mint(msg.sender, songId, amount, "");
        emit SongNFTMinted(msg.sender, amount, songId);

        // Forward payment to contract owner (use call and ignore returned data, bubble revert on failure)
        (bool sent, ) = payable(owner()).call{value: msg.value}("");
        require(sent, "Failed to forward funds to owner");
    }

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
