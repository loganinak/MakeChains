import React, { useContext, useEffect, useState } from "react";
import { MakeChainsContext, CurrentAddressContext } from "../hardhat/SymfoniContext";
import './style.css';


interface Props { }

export const MakeChains: React.FC<Props> = () => {
    const makeChains = useContext(MakeChainsContext);
    const [currentAddress, ] = useContext(CurrentAddressContext);
    const [inputAddress, setInputAddress] = useState("");

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
            console.log("connected address: ", currentAddress);


        };
        doAsync();
    }, [makeChains, currentAddress]);

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
            }, 1000);
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
            const tx = await makeChains.instance.startGame(currentAddress, inputAddress, "first ui");
            console.log("Starting game", tx);
            await tx.wait();

            console.log(
                "Game started, player1: ", await makeChains.instance.getPlayer1(inputAddress),
                "player2: ", await makeChains.instance.getPlayer2(inputAddress),
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
            <input onChange={(e) => setInputAddress(e.target.value)}></input>
            <button onClick={(e) => handleStartGame(e)}>Start Game</button>
            <div>
                <button onClick={(e) => handleForfeitGame(e)}>Forfiet Game</button>
            </div>
        </div>
    )
}

