import React, { useReducer } from "react";
import "./App.css";
import XIcon from "./img/x.png";
import OIcon from "./img/o.png";

type Player = 1 | 2;
type BoardState = {
  [key: number]: Player | null;
};

type PlayerSelection = Array<number>;

type State = {
  boardState: BoardState;
  currentTurn: Player;
  player1: PlayerSelection;
  player2: PlayerSelection;
  winner: Player;
  player1Win: number;
  player2Win: number;
  tieCount: number;
  leftChoices: Array<number>;
};

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
    9: null,
  },
  player1: [],
  player2: [],
  winner: null,
  player1Win: 0,
  player2Win: 0,
  leftChoices: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  tieCount: 0,
};

type Action = {
  type: "PLAYER_1_SELECT" | "PLAYER_2_SELECT";
  payload: number; // tile number
};

function boardReducer(state: State, action: Action): State {
  switch (action.type) {
    case "PLAYER_1_SELECT": {
      const newPlayer1Selection = [...state.player1, action.payload].sort();
      const isPlayer1Win = isWinner(newPlayer1Selection);
      const newChoices = state.leftChoices.filter((n) => n != action.payload);

      if (newChoices.length === 0 && !isPlayer1Win) {
        return {
          ...initialState,
          player1Win: state.player1Win,
          player2Win: state.player2Win,
          tieCount: state.tieCount + 1,
        };
      }
      if (isPlayer1Win) {
        return {
          ...initialState,
          player1Win: state.player1Win + 1,
          player2Win: state.player2Win,
        };
      } else {
        return {
          ...state,
          currentTurn: 2,
          boardState: {
            ...state.boardState,
            [action.payload]: 1,
          },
          player1: newPlayer1Selection,
          leftChoices: newChoices,
        };
      }
    }
    case "PLAYER_2_SELECT": {
      const newPlayer2Selection = [...state.player2, action.payload].sort();
      const isPlayer2Win = isWinner(newPlayer2Selection);
      const newChoices = state.leftChoices.filter((n) => n != action.payload);
      if (newChoices.length === 0 && !isPlayer2Win) {
        return {
          ...initialState,
          player1Win: state.player1Win,
          player2Win: state.player2Win,
          tieCount: state.tieCount + 1,
        };
      }
      if (isPlayer2Win) {
        return {
          ...initialState,
          player1Win: state.player1Win,
          player2Win: state.player2Win + 1,
        };
      } else {
        return {
          ...state,
          currentTurn: 1,
          boardState: {
            ...state.boardState,
            [action.payload]: 2,
          },
          player2: newPlayer2Selection,
          leftChoices: newChoices,
        };
      }
    }
    default: {
      return state;
    }
  }
}

// Check if arr 2 is in arr 1
function isIncludeArray(arr1: Array<number>, arr2: Array<number>): boolean {
  const reference = [...arr2];
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] === reference[0]) {
      reference.shift();
    }
  }

  if (reference.length > 0) {
    return false;
  } else {
    return true;
  }
}

// Function to check if the current user's selection is
// the correct solution. This function using the possible solutions array
const isWinner = (selectionArr: Array<number>): boolean => {
  // Possible check algorithms:
  // 1. Using 2D array
  // has the same first index
  // [[0,0], [0,1], [0,2]]
  // has the same second index
  // [[0,1], [1,1], [2,1]]

  // 2. Using 1D array
  // has the same first index
  // in a row: [1,2,3] -> horizontal correct
  // in a row with 2 number span: [2,5,8] -> vertical correct
  // in a row with 3 number span: cross correct

  // 3. Using possible solutions array
  // correct solutions
  // [1,2,3]
  // [4,5,6]
  // [7,8,9]
  // [1,4,7]
  // [2,5,8]
  // [3,6,9]
  // [1,5,9]
  // [3,5,7]

  // correct solution sorted
  // [1,2,3]
  // [1,4,7]
  // [1,5,9]
  // [2,5,8]
  // [3,5,7]
  // [3,6,9]
  // [4,5,6]
  // [7,8,9]

  // Check if has solution minimal length
  if (selectionArr.length < 3) {
    return false;
  }

  const firstArr = selectionArr[0];
  // Check the solutions based on correct solutions array
  switch (firstArr) {
    case 1:
      if (
        isIncludeArray(selectionArr, [1, 2, 3]) ||
        isIncludeArray(selectionArr, [1, 4, 7]) ||
        isIncludeArray(selectionArr, [1, 5, 9])
      )
        return true;
      break;

    case 2:
      if (isIncludeArray(selectionArr, [2, 5, 8])) return true;
      break;

    case 3:
      if (
        isIncludeArray(selectionArr, [3, 5, 7]) ||
        isIncludeArray(selectionArr, [3, 6, 9]) ||
        isIncludeArray(selectionArr, [3, 5, 7])
      )
        return true;
      break;

    case 4:
      if (isIncludeArray(selectionArr, [4, 5, 6])) return true;
      break;

    case 7:
      if (isIncludeArray(selectionArr, [7, 8, 9])) return true;
      break;

    default:
      return false;
  }
};

function App() {
  const [state, dispatch] = useReducer(boardReducer, initialState);

  // Read from local storage
  const getSavedScore = () => {
    // read from local storage
    return {
      ...initialState,
      player1Win:
        localStorage.getItem("player1Win") != ""
          ? localStorage.getItem("player1Win")
          : 0,

      player2Win:
        localStorage.getItem("player2Win") != ""
          ? localStorage.getItem("player1Win")
          : 1,
    };
  };

  // TODO: useMemo for render board
  const onClickTile = (tileNumber: number) => {
    if (state.currentTurn === 1) {
      dispatch({ type: "PLAYER_1_SELECT", payload: tileNumber });
    } else {
      dispatch({ type: "PLAYER_2_SELECT", payload: tileNumber });
    }
  };

  const isSelected = (n: number) => {
    return state.boardState[n] ?? false;
  };

  return (
    <div className="App">
      <h1>Tic Tac Toe</h1>

      <div style={{ paddingBottom: 25 }}>
        <div>Current Turn: {state.currentTurn}</div>
        <div>Player 1(X): {state.player1Win}</div>
        <div>Player 1 Selections: {JSON.stringify(state.player1)}</div>
        <div>Tie: {state.tieCount}</div>
        <div>Player 2(O): {state.player2Win}</div>
        <div>Player 2 Selections: {JSON.stringify(state.player2)}</div>

        <div>Choices Left: {JSON.stringify(state.leftChoices)}</div>
      </div>

      <div className="grid-container">
        {Object.keys(state.boardState).map((n) => (
          <div
            key={n}
            className="grid-item"
            onClick={() =>
              isSelected(Number(n))
                ? alert("tile already selected!")
                : onClickTile(Number(n))
            }
          >
            {state.boardState[n] === 1 && (
              <img
                src={OIcon}
                alt="player-1-selection"
                height={50}
                width={50}
              />
            )}
            {state.boardState[n] === 2 && (
              <img
                src={XIcon}
                alt="player-2-selection"
                height={50}
                width={50}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
