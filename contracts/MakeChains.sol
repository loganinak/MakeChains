// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MakeChains is ERC721 {
    struct Game {
        // Struct
        address[2] players;
        uint8[3][3] board;
        uint8 turnNumber;
        string description;
    }

    mapping(address => bytes32) gameIds;
    mapping(bytes32 => Game) games;

    constructor() ERC721("Make Chains", "Chains") {}

    event GameStarted (
        address indexed player1,
        address indexed player2
    );

    event TurnTaken (
        address indexed player1,
        address indexed player2,
        uint8 x,
        uint8 y
    );

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        return "";
    }

    function safeMint(address to, uint256 tokenId) private {
        _safeMint(to, tokenId);
    }

    function startGame(
        address _player1,
        address _player2,
        string calldata _description
    ) public {
        // require that neither player is already playing a game
        require(
            gameIds[_player1] == bytes32(0) && gameIds[_player2] == bytes32(0),
            "You can't play two games at once for now"
        );
        // require unique gameId which means unique comnbination of players and description
        require(
            games[keccak256(abi.encodePacked(_player1, _player2, _description))].players[0] == address(0)
        );

        // Set the game
        gameIds[_player1] = keccak256(
            abi.encodePacked(_player1, _player2, _description)
        );
        gameIds[_player2] = keccak256(
            abi.encodePacked(_player1, _player2, _description)
        );

        // Set the game description
        getGame(_player1).description = _description;

        // Set first and second player
        getGame(_player1).players[0] = _player1;
        getGame(_player1).players[1] = _player2;

        // Set the first player
        getGame(_player1).turnNumber = 0;

        emit GameStarted(_player1, _player2);
    }

    function closeGame(Game storage game) private {
        Game memory newGame;

        gameIds[game.players[0]] = bytes32(0);
        gameIds[game.players[1]] = bytes32(0);

        game.board = newGame.board;
        game.turnNumber = newGame.turnNumber;
        game.players = newGame.players;
        game.description = newGame.description;
    }

    function takeTurn(uint8 i, uint8 j) public returns (uint) {
        // Make sure they are playing inside the board
        require(i < 3 && j < 3, "Don't play outside the board!");

        // Make sure it's the players turn
        require(msg.sender == getCurrentPlayer(msg.sender), "Not your turn!");

        // Mak sure the spot is not occupied
        require(getGame(msg.sender).board[i][j] == 0, "Spot already taken");

        Game storage game = getGame(msg.sender);

        // Mark down the move
        game.board[i][j] = getCurrentPlayerPiece(msg.sender);

        // Announce Move
        emit TurnTaken(getGame(msg.sender).players[0], getGame(msg.sender).players[0], i, j);

        // Check for a win
        uint result = checkChains(
            game.board,
            getCurrentPlayerPiece(msg.sender)
        );

        if (result == 11 || result == 1 || result == 2) {
            closeGame(game);
            mintNFT(result, game);
        } else {
            // Increment the turn
            game.turnNumber += 1;
        }

        return result;
    }

    // Determines if game is over
    function checkChains(uint8[3][3] memory board, uint8 playerPiece)
        public
        pure
        returns (uint8)
    {
        // Check rows and columns
        for (uint8 i = 0; i < board.length; i++) {
            uint8 countAcross = 0;
            uint8 countDown = 0;

            for (uint8 j = 0; j < board.length; j++) {
                if (board[i][j] == playerPiece) {
                    countAcross += 1;
                }

                if (board[j][i] == playerPiece) {
                    countDown += 1;
                }
            }

            if (countAcross == 3 || countDown == 3) {
                return playerPiece;
            }
        }

        // check diagonols
        if (board[1][1] == playerPiece) {
            // check up diagonal
            if (board[0][2] == playerPiece && board[2][0] == playerPiece) {
                return playerPiece;
            } else if (
                board[0][0] == playerPiece && board[2][2] == playerPiece
            ) {
                return playerPiece;
            }
        }

        return 0;
    }

    function mintNFT(uint256 result, Game storage game) private {
        require(
            result < 3,
            "Shits fucked up. Result > 0 in mint NFT, please contact your local priest to pray for your sins."
        );

        if (result == 11) {
            // Mint tie NFT
        } else if (result == 1) {
            // Mint player 1 wins
        } else if (result == 2) {
            // Mint player 2 wins
        }
    }

    function forfeitGame() public {
        closeGame(getGame(msg.sender));
    }

    function getPlayer1(address player) public view returns (address) {
        return getGame(player).players[0];
    }

    function getPlayer2(address player) public view returns (address) {
        return getGame(player).players[1];
    }

    function getCurrentPlayer(address player) public view returns (address) {
        return getGame(player).players[getGame(player).turnNumber % 2];
    }

    function getCurrentPlayerPiece(address player) public view returns (uint8) {
        return (getGame(player).turnNumber % 2) + 1;
    }

    function getBoard(address player) public view returns (uint8[3][3] memory) {
        return getGame(player).board;
    }

    function getSpot(uint8 x, uint8 y) public view returns (uint8) {
        return getGame(msg.sender).board[x][y];
    }

    function getGame(address player) private view returns (Game storage) {
        return games[gameIds[player]];
    }

    function isGameStarted(address player) public view returns (bool) {
        if (getGame(player).players[0] == address(0)) {
            return false;
        } else {
            return true;
        }
    }

    function getGameDescription(address player)
        public
        view
        returns (string memory)
    {
        return getGame(player).description;
    }

    function hashboard(address player) public view returns (bytes32) {
        return keccak256(abi.encodePacked(getGame(player).board));
    }

    /**
     * Override isApprovedForAll to auto-approve OS's proxy contract
     */
    function isApprovedForAll(address _owner, address _operator)
        public
        view
        override
        returns (bool isOperator)
    {
        // if OpenSea's ERC721 Proxy Address is detected, auto-return true
        if (_operator == address(0x58807baD0B376efc12F5AD86aAc70E78ed67deaE)) {
            return true;
        }

        // otherwise, use the default ERC721.isApprovedForAll()
        return ERC721.isApprovedForAll(_owner, _operator);
    }
}
