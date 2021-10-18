import React, { useContext, useEffect, useState } from "react";
import { MakeChainsContext, CurrentAddressContext } from "../hardhat/SymfoniContext";
import './style.css';


interface Props { }

export const MakeChains: React.FC<Props> = () => {
    const makeChains = useContext(MakeChainsContext);
    const [connectedAddress,] = useContext(CurrentAddressContext);
    const [inputAddress, setInputAddress] = useState("");
    const [gameStarted, setGameStarted] = useState(Boolean);

    const [spot00, setSpot00] = useState(0);
    const [spot10, setSpot10] = useState(0);
    const [spot20, setSpot20] = useState(0);

    const [spot01, setSpot01] = useState(0);
    const [spot11, setSpot11] = useState(0);
    const [spot21, setSpot21] = useState(0);

    const [spot02, setSpot02] = useState(0);
    const [spot12, setSpot12] = useState(0);
    const [spot22, setSpot22] = useState(0);

    useEffect(() => {
        const doAsync = async () => {
            if (!makeChains.instance) return
            console.log("MakeChains is deployed at ", makeChains.instance.address);
            console.log("connected address: ", connectedAddress);

            setGameStarted(await makeChains.instance.isGameStarted(connectedAddress));
            const gameStartedAsPlayer1 = makeChains.instance.filters.GameStarted(connectedAddress, null);
            makeChains.instance.on(
                gameStartedAsPlayer1,
                async (player1, player2, event) => {
                    console.log("event GameStartedAsPlayer1 fired");
                    // console.log("player1", player1);
                    // console.log("player2", player2);
                    // console.log(event);
                    setGameStarted(true);
                });
            const gameStartedAsPlayer2 = makeChains.instance.filters.GameStarted(null, connectedAddress);
            makeChains.instance.on(
                gameStartedAsPlayer2,
                async (player1, player2, event) => {
                    console.log("event GameStartedAsPlayer2 fired");
                    // console.log("player1", player1);
                    // console.log("player2", player2);
                    // console.log(event);
                    setGameStarted(true);
                });

            const gameForfeitedAsPlayer1 = makeChains.instance.filters.GameForfeited(connectedAddress, null);
            makeChains.instance.on(
                gameForfeitedAsPlayer1,
                async (player1, player2, event) => {
                    console.log("event GameForfeited fired");
                    // console.log("player1", player1);
                    // console.log("player2", player2);
                    // console.log(event);
                    setGameStarted(false);
                });
            const gameForfeitedAsPlayer2 = makeChains.instance.filters.GameForfeited(null, connectedAddress);
            makeChains.instance.on(
                gameForfeitedAsPlayer2,
                async (player1, player2, event) => {
                    console.log("event GameForfeited fired");
                    // console.log("player1", player1);
                    // console.log("player2", player2);
                    // console.log(event);
                    setGameStarted(false);
                });

            const turnTakenPlayer1 = makeChains.instance.filters.TurnTaken(connectedAddress, null, null, null);
            makeChains.instance.on(turnTakenPlayer1,
                async (player1, player2, x, y, event) => {
                    console.log("event TurnTaken for player1 fired");
                    if (!makeChains.instance) return
                    const piece = await makeChains.instance.getSpot(x, y);
                    setSpot(x, y, piece);
                });
            const turnTakenPlayer2 = makeChains.instance.filters.TurnTaken(null, connectedAddress, null, null);
            makeChains.instance.on(turnTakenPlayer2,
                async (player1, player2, x, y, event) => {
                    console.log("event TurnTaken for player2 fired");
                    if (!makeChains.instance) return
                    const piece = await makeChains.instance.getSpot(x, y);
                    setSpot(x, y, piece);
                });
        };
        doAsync();
    }, [makeChains, connectedAddress]);

    function setSpot(x: number, y: number, piece: number) {
        if (x === 0) {
            if (y === 0) {
                setSpot00(piece);
            } else if (y === 1) {
                setSpot01(piece);
            } else if (y === 2) {
                setSpot02(piece);
            }
        } else if (x === 1) {
            if (y === 0) {
                setSpot10(piece);
            } else if (y === 1) {
                setSpot11(piece);
            } else if (y === 2) {
                setSpot12(piece);
            }
        } else if (x === 2) {
            if (y === 0) {
                setSpot20(piece);
            } else if (y === 1) {
                setSpot21(piece);
            } else if (y === 2) {
                setSpot22(piece);
            }
        }
    }

    /*     function useGetSpot(x: number, y: number) {
            const [spot, setSpot] = useState(0);
    
            useEffect(() => {
                const interval = setInterval(() => {
                    const doAsync = async () => {
                        if (!makeChains.instance) return
                        const piece = await makeChains.instance.getSpot(x, y);
                        setSpot(piece);
                    };
                    doAsync();
                }, 10000);
                return () => clearInterval(interval);
            });
    
            return spot;
        } */

    const handleStartGame = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();
        if (!makeChains.instance) throw Error("Makechains instance not ready");
        if (makeChains.instance) {
            const tx = await makeChains.instance.startGame(connectedAddress, inputAddress, "first ui");
            console.log("Starting game", tx);
            await tx.wait();
            setGameStarted(true);

            console.log(
                "Game started.\nplayer1: ",
                await makeChains.instance.getPlayer1(inputAddress),
                "\nplayer2: ",
                await makeChains.instance.getPlayer2(inputAddress)
            )
        }
    };

    const handleTakeTurn = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        x: number,
        y: number
    ) => {
        e.preventDefault();
        if (!makeChains.instance) throw Error("Makechains instance not ready");
        if (makeChains.instance) {
            console.log("Taking turn at: ", x, ", ", y);
            const tx = await makeChains.instance.takeTurn(x, y);
            await tx.wait();
            console.log(tx)
        }
    };

    const handleForfeitGame = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        if (!makeChains.instance) throw Error("Makechains instance not ready");
        if (makeChains.instance) {
            const tx = await makeChains.instance.forfeitGame();
            console.log("Forfeiting Game");
            await tx.wait();
        }
    };

    function render() {
        if (gameStarted) {
            return (
                <div>
                    <div>
                        <button className="ticTacButton" onClick={(e) => handleTakeTurn(e, 0, 0)}>{spot00}</button>
                        <button className="ticTacButton" onClick={(e) => handleTakeTurn(e, 1, 0)}>{spot10}</button>
                        <button className="ticTacButton" onClick={(e) => handleTakeTurn(e, 2, 0)}>{spot20}</button>
                    </div>
                    <div>
                        <button className="ticTacButton" onClick={(e) => handleTakeTurn(e, 0, 1)}>{spot01}</button>
                        <button className="ticTacButton" onClick={(e) => handleTakeTurn(e, 1, 1)}>{spot11}</button>
                        <button className="ticTacButton" onClick={(e) => handleTakeTurn(e, 2, 1)}>{spot21}</button>
                    </div>
                    <div>
                        <button className="ticTacButton" onClick={(e) => handleTakeTurn(e, 0, 2)}>{spot02}</button>
                        <button className="ticTacButton" onClick={(e) => handleTakeTurn(e, 1, 2)}>{spot12}</button>
                        <button className="ticTacButton" onClick={(e) => handleTakeTurn(e, 2, 2)}>{spot22}</button>
                    </div>
                    <div>
                        <button onClick={(e) => handleForfeitGame(e)}>Forfiet Game</button>
                    </div>
                </div>
            )
        } else {
            return (
                <div>
                    <input onChange={(e) => setInputAddress(e.target.value)}></input>
                    <button onClick={(e) => handleStartGame(e)}>Start Game</button>
                </div>
            )
        }
    };

    return render();

}

