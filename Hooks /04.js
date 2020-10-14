// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

//This execercise was about really using derived state and when to use it vs normal state.
//We also took adavtange of the useLocalStorgeState custom hook we created earlier.

import React from "react";
import { useLocalStorageState } from "../utils.js";

function Board({ squares, onClick }) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    );
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
}

function Game() {
  const [history, setHistory] = useLocalStorageState("tic-tac-toe:history", [
    Array(9).fill(null),
  ]);
  const [currentStep, setCurrentStep] = useLocalStorageState(
    "tic-tac-toe:step",
    0
  );

  let currentSquares = history[currentStep];

  let nextValue = calculateNextValue(currentSquares);
  let winner = calculateWinner(currentSquares);
  let status = calculateStatus(winner, currentSquares, nextValue);

  function selectSquare(square) {
    if (winner || currentSquares[square]) return;

    let copy = [...currentSquares];
    copy[square] = nextValue;

    let newHistory = [...history, copy];

    setHistory(newHistory);
    setCurrentStep(newHistory.length - 1);
  }

  let moves = history.map((move, idx) => {
    return (
      <li key={move}>
        <button
          disabled={idx === currentStep}
          onClick={() => setCurrentStep(idx)}
        >
          Go to {idx === 0 ? "start of game" : `move #${idx}`}
        </button>
      </li>
    );
  });

  function restart() {
    // 🐨 set the currentSquares to `Array(9).fill(null)`
    // setSquares(Array(9).fill(null))
    setHistory(Array(9).fill(null));
    setCurrentStep(0);
  }
  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={currentSquares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`;
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  const xSquaresCount = squares.filter((r) => r === "X").length;
  const oSquaresCount = squares.filter((r) => r === "O").length;
  return oSquaresCount === xSquaresCount ? "X" : "O";
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function App() {
  return <Game />;
}

export default App;
