import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    let boardSquares = [];
    for (let row = 0; row < 3; row++) {
      let boardRow = [];
      for (let col = 0; col < 3; col++) {
        boardRow.push(this.renderSquare((row * 3) + col));
      }
      boardSquares.push(<div key={row} className="board-row">{boardRow}</div>);
    }

    return (
      <div>
        {boardSquares}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        mostRecentMoveLocation: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      ascending: true,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        mostRecentMoveLocation: calculateLocation(i),
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  handleToggleClick() {
    this.setState({
      ascending: !this.state.ascending,
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const xOrO = (move % 2) === 0 ? 'O' : 'X';
      const location = step.mostRecentMoveLocation;
      const bold = this.state.stepNumber === move;
      const desc = move ?
        `Go to move #${move} : ${xOrO} @ ${location}` :
        'Go to game start';

      let moveList = [];
      moveList.push(
        <li key={move}>
          <button style={{fontWeight: bold ? 'bold' : ''}} onClick={() => this.jumpTo(move)}>
            {desc}
          </button>
        </li>
      );

      return (
        moveList/*this.state.ascending ? moveList : descending*/
      );
    });

    let movesDescending = [...moves];
    movesDescending.reverse();

    const orderToggle = <button onClick={() => this.handleToggleClick()}>
      {`Order ${this.state.ascending ? '^' : 'v'}`}
    </button>;

    let status;
    if (winner) {
      status = `Winner: ${winner} `;
    } else {
      status = `Next player: ${(this.state.xIsNext ? 'X' : 'O')} `;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{this.state.ascending ? moves : movesDescending}</ol>
          <div>{orderToggle}</div>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

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

function calculateLocation(square) {
  switch (square) {
    case 0:
      return '(1, 1)';
    case 1:
      return '(2, 1)';
    case 2:
      return '(3, 1)';
    case 3:
      return '(1, 2)';
    case 4:
      return '(2, 2)';
    case 5:
      return '(3, 2)';
    case 6:
      return '(1, 3)';
    case 7:
      return '(2, 3)';
    case 8:
      return '(3, 3)';
    default:
  }
  return null;
}