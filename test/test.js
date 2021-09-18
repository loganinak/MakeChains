const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MakeChains", function () {
  it("Both players should reference the same game", async function () {
    const MakeChains = await ethers.getContractFactory("MakeChains");
    const makeChains = await MakeChains.deploy();
    await makeChains.deployed();

    const startGameTx = await makeChains.startGame("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", "0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
    await startGameTx.wait();

    expect(await makeChains.getPlayer1("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")).to.equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
    expect(await makeChains.getPlayer1("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")).to.equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
  });
  it("Both players should be in the game", async function () {
    const MakeChains = await ethers.getContractFactory("MakeChains");
    const makeChains = await MakeChains.deploy();
    await makeChains.deployed();

    const startGameTx = await makeChains.startGame("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", "0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
    await startGameTx.wait();

    expect(await makeChains.getPlayer1("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")).to.equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
    expect(await makeChains.getPlayer2("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")).to.equal("0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
  });
});
