import React, { useContext, useEffect, useState } from "react";
import { MakeChainsContext } from "../hardhat/SymfoniContext";

interface Props {}

export const MakeChains: React.FC<Props> = () => {
    const makeChains = useContext(MakeChainsContext)
    const [message, setMessage] = useState("");

    useEffect(() => {
        const doAsync = async () => {
            if (!makeChains.instance) return
            console.log("MakeChains is deployed at ", makeChains.instance.address)
        };
        doAsync();
    }, [makeChains]);

    const handleTakeTurn = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();
        if(!makeChains.instance) throw Error("Makechains instance not ready");
        if (makeChains.instance) {
            const tx = await makeChains.instance.startGame("0xB3F3cfb38EEF50dbEaC878730e69A83d9909e91B", "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc", "first ui");
            console.log("attempting to take turn", tx);
            await tx.wait();

            const getBoard = await makeChains.instance.getPlayer1("0xB3F3cfb38EEF50dbEaC878730e69A83d9909e91B");
            console.log(
                "Turn taken, result: ",
                getBoard
            )
        }
    };
    return (
        <div>
            <p>MakeChains component loaded!!</p>
            <p>{message}</p>
            <button onClick={(e) => handleTakeTurn(e)}>Start Game</button>
        </div>
    )
}