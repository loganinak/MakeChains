// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MakeChains is ERC721, ERC721Enumerable, Ownable {
    constructor(address _player1, address _player2) ERC721("MakeChains", "Chains") {
        player1 = _player1;
        player2 = _player2;
    }
    
    address player1;
    address player2;
    
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        return "";
    }
    
    function safeMint(address to, uint256 tokenId) public onlyOwner {
        _safeMint(to, tokenId);
    }
    
    function startGame() public {
        
    }
    
    function takeTurn() public {
        
    }
    
    function checkChains() public returns (bool) {
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
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
    

}