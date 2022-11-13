import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Tic Tac Toe</h1>

      <div style={{ paddingBottom: 25}}>
        <div>Player 1(X): [score placeholder]</div>
        <div>Tie: [score placeholder]</div>
        <div>Player 2(O): [score placeholder]</div>
      </div>

      <div className="grid-container">
        {[1,2,3,4,5,6,7,8,9].map((n) => <div className="grid-item">{n}</div>)}
      </div>
    </div>
  );
}

export default App;
