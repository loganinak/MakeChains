// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract MakeChains is ERC721, ERC721Enumerable, AccessControl {
    
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    
    struct Game { // Struct
        address[2] players;
        string[3][3] gameState;
    }
    
    mapping(address => address) gameIds;
    mapping(address => Game) games;
    
    constructor() ERC721("Make Chains", "Chains") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
    }
    
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        return "";
    }
    
    function safeMint(address to, uint256 tokenId) public onlyRole(MINTER_ROLE) {
        _safeMint(to, tokenId);
    }
    
    function startGame(address _player1, address _player2) public {
        // require that neither player is already playing a game
        require(gameIds[_player1] == address(0) && gameIds[_player2] == address(0), "Only one game at once for now!");
        
        // Set the game
        gameIds[_player1] = _player1;
        gameIds[_player2] = _player1;
        
        // Set first and second player
        getGame(_player1).players[0] = _player1;
        getGame(_player1).players[1] = _player2;
    }
    
    function takeTurn() public {
        
    }
    
    function getPlayer1(address player) public view returns (address) {
        return getGame(player).players[0];
    }
    
    function getPlayer2(address player) public view returns (address) {
        return getGame(player).players[1];
    }
    
    function getGameState(address player) public view returns (string[3][3] memory) {
        return getGame(player).gameState;
    }
    
    function getGame(address player) private view returns (Game storage) {
        return games[gameIds[player]];
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