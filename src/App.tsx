import React, { useReducer } from 'react';
import logo from './logo.svg';
import './App.css';


// State
// playerTurn: who is selecting?
// boardState: currentboard state

type Player = 1 | 2;
type BoardState = {
  [key: number]: Player | null;
}

type State = {
  boardState: BoardState
  currentTurn: Player
}

const initialState: State = {
  currentTurn: 1,
  boardState: {
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
    6: null,
    7: null,
    8: null,
    9: null
  }
}

type Action = {
  type: 'PLAYER_1_SELECT' | 'PLAYER_2_SELECT',
  payload: number // tile number
}

function boardReducer(state: State, action: Action): State {
  switch(action.type) {
    case 'PLAYER_1_SELECT': {
      return {
        currentTurn: 2,
        boardState: {
          ...state.boardState,
          [action.payload]: 1
        }
      }
    }
    case 'PLAYER_2_SELECT': {
      return {
          currentTurn: 1,
          boardState: {
            ...state.boardState,
            [action.payload]: 2
          }
        }
      }
    default: {
      return state
    }
  }
}

function App() {
  const [state, dispatch] = useReducer(boardReducer, initialState);

  // TODO: useMemo for render board

  return (
    <div className="App">
      <h1>Tic Tac Toe</h1>

      <div style={{ paddingBottom: 25}}>
        <div>Current Turn: {state.currentTurn}</div>
        <div>Player 1(X): [score placeholder]</div>
        <div>Tie: [score placeholder]</div>
        <div>Player 2(O): [score placeholder]</div>
      </div>

      <div className="grid-container">
        {Object.keys(state.boardState).map((n) => <div className="grid-item">{n}: {JSON.stringify(state.boardState[n])}</div>)}
      </div>
    </div>
  );
}

export default App;
