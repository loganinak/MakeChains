// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract MakeChains is ERC721, ERC721Enumerable {

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    struct Game { // Struct
        address[2] players;
        uint8[3][3] board;
        uint8 currentPlayer;
    }

    mapping(address => address) gameIds;
    mapping(address => Game) games;

    constructor() ERC721("Make Chains", "Chains") {}

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        return "";
    }

    function safeMint(address to, uint256 tokenId) private {
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

        // Set the first player
        getGame(_player1).currentPlayer = 0;
    }

    function closeGame(Game storage game) private {
        // TODO Write closing game
    }

    function takeTurn(uint8 x, uint8 y) public {
        // Make sure they are playing inside the board
        require(x < 3 && y < 3, "Don't play outside the board!");

        // Make sure it's the players turn
        require(msg.sender == getGame(msg.sender).players[getCurrentPlayer(msg.sender)], "Not your turn!");

        // Mak sure the spot is not occupied
        require(getGame(msg.sender).board[x][y] == 0, "Spot already taken");

        Game storage game = getGame(msg.sender);

        // Mark down the move
        game.board[x][y] = game.currentPlayer + 1;

        // Check for a win
        if (checkChains(game.board, game.currentPlayer + 1)) {
            closeGame(game);

            // create an Id for the NFT. TODO check the limits of this encoding. it should only a
            uint winnerNftId = uint(keccak256(abi.encodePacked(game.players[game.currentPlayer], "winnerNFT")));
            uint loserNftId = uint(keccak256(abi.encodePacked(game.players[(game.currentPlayer + 1) % 2], "loserNFT")));
            address winner = game.players[game.currentPlayer];
            address loser = game.players[(game.currentPlayer + 1) % 2];

            safeMint(winner, winnerNftId);
            safeMint(loser, loserNftId);
        } else {
            // Set turn to next player
            game.currentPlayer = (game.currentPlayer + 1) % 2;
        }
    }

    // Determines if game is over
    function checkChains(uint8[3][3] memory board, uint8 playerNumber) public pure returns (bool) {

        // TODO create logic to check if game is over

        return false;
    }


    function getPlayer1(address player) public view returns (address) {
        return getGame(player).players[0];
    }

    function getPlayer2(address player) public view returns (address) {
        return getGame(player).players[1];
    }

    function getCurrentPlayer(address player) public view returns (uint) {
        return getGame(player).currentPlayer;
    }

    function getBoard(address player) public view returns (uint8[3][3] memory) {
        return getGame(player).board;
    }

    function hashboard(address player) public view returns (bytes32) {
        return keccak256(abi.encodePacked(getGame(player).board));
    }

    function getGame(address player) private view returns (Game storage) {
        return games[gameIds[player]];
    }

    /**
   * Override isApprovedForAll to auto-approve OS's proxy contract
   */
    function isApprovedForAll(
        address _owner,
        address _operator
    ) public override view returns (bool isOperator) {
      // if OpenSea's ERC721 Proxy Address is detected, auto-return true
        if (_operator == address(0x58807baD0B376efc12F5AD86aAc70E78ed67deaE)) {
            return true;
        }

        // otherwise, use the default ERC721.isApprovedForAll()
        return ERC721.isApprovedForAll(_owner, _operator);
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
