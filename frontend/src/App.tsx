import React from 'react';
import './App.css';
import { Symfoni } from "./hardhat/SymfoniContext";
import { MakeChains } from './components/MakeChains';

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <Symfoni autoInit={true} >
          <h1>Welcome to make Chains!</h1>
          <p>MakeChains is an NFT that is minted by beating someone at Tic-Tac-Toe</p>
          <MakeChains></MakeChains>
        </Symfoni>
      </header>
    </div>
  );
}

export default App;
