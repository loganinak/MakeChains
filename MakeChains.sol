// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
library Library {
    struct game { // Struct
        address player1;
        address player2;
        string[][] gameState;
    }
}


contract MakeChains is ERC721, ERC721Enumerable, AccessControl {
    
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    
    using Library for Library.game;
    mapping(address => Library.game) games;
    
    constructor() ERC721("MyToken", "MTK") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
    }
    
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        return "";
    }
    
    function safeMint(address to, uint256 tokenId) public onlyRole(MINTER_ROLE) {
        _safeMint(to, tokenId);
    }
    
    function startGame(address player2) public {
        
    }
    
    function takeTurn() public {
        
    }
    
    // Determines if game is over
    function checkChains() public view returns (bool) {
        return false;
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
    

}