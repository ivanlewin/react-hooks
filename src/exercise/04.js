// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import { useLocalStorage } from './02';

function Board({ status, squares }) {
  return (
    <div>
      <div className="status">{status}</div>
      {squares}
    </div>
  );
}

function Game() {
  const [history, setHistory] = useLocalStorage('history', [Array(9).fill(null)]);
  const [currentStep, setCurrentStep] = useLocalStorage('currentStep', 0);
  const squares = history[currentStep];

  const moves = history.map((i, index) => {
    const label = index === 0 ? 'game start' : `move #${index}`;
    return (
      <li key={index}>
        <button
          disabled={index === currentStep}
          onClick={() => setCurrentStep(index)}
        >Go to {`${label}${index === currentStep ? ' (current)' : ''}`}</button>
      </li>
    );
  });

  const nextValue = calculateNextValue(squares);
  const winner = calculateWinner(squares);
  const status = calculateStatus(winner, squares, nextValue);

  function selectSquare(square) {
    if (winner !== null || squares[square] !== null) return;
    setHistory(prevHistory => {
      const copy = [...prevHistory.map(i => [...i])];

      copy[currentStep + 1] = [...copy[currentStep]];
      copy[currentStep + 1][square] = nextValue;

      if (currentStep < history.length) {
        return copy.slice(0, currentStep + 2);
      } else {
        return copy;
      }
    });

    setCurrentStep(c => c + 1)
  }

  function restart() {
    setHistory([Array(9).fill(null)]);
    setCurrentStep(0)
  }

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
        {squares[i]}
      </button>
    );
  }

  const currentSquares = (
    <>
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
    </>
  )

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
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
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
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
