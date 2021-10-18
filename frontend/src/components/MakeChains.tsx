import React, { useContext, useEffect, useState } from "react";
import { MakeChainsContext, CurrentAddressContext } from "../hardhat/SymfoniContext";
import './style.css';


interface Props { }

export const MakeChains: React.FC<Props> = () => {
    const makeChains = useContext(MakeChainsContext);
    const [connectedAddress,] = useContext(CurrentAddressContext);
    const [inputAddress, setInputAddress] = useState("");
    const [gameStarted, setGameStarted] = useState(Boolean);

    const spot00 = useGetSpot(0, 0);
    const spot10 = useGetSpot(1, 0);
    const spot20 = useGetSpot(2, 0);

    const spot01 = useGetSpot(0, 1);
    const spot11 = useGetSpot(1, 1);
    const spot21 = useGetSpot(2, 1);

    const spot02 = useGetSpot(0, 2);
    const spot12 = useGetSpot(1, 2);
    const spot22 = useGetSpot(2, 2);

    useEffect(() => {
        const doAsync = async () => {
            if (!makeChains.instance) return
            console.log("MakeChains is deployed at ", makeChains.instance.address);
            console.log("connected address: ", connectedAddress);

            // setGameStarted(await makeChains.instance.isGameStarted(connectedAddress));

        };
        doAsync();
    }, [makeChains, connectedAddress]);

    function useGetSpot(x: number, y: number) {
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
    }

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
        if (makeChains.instance) {
            const gameStartedAsPlayer2 = makeChains.instance.filters.GameStarted(null, connectedAddress);
            makeChains.instance.on(
                gameStartedAsPlayer2,
                async (player1, player2, event) => {
                    console.log("event GameStarted fired");
                    // console.log("player1", player1);
                    // console.log("player2", player2);
                    // console.log(event);
                    setGameStarted(true);
                });

            const turnTakenPlayer1 = makeChains.instance.filters.TurnTaken(connectedAddress, null, null, null);
            makeChains.instance.on(turnTakenPlayer1,
                async (player1, player2, event) => {
                    console.log("event TurnTaken for player1 fired");
                });
        }
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

