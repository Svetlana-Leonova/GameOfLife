import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Button from "react-bootstrap/Button";

class Box extends React.Component {
  selectBox = () => {
    this.props.selectBox(this.props.row, this.props.col);
  };

  render() {
    return (
      <div
        className={this.props.boxClass}
        id={this.props.id}
        onClick={this.selectBox}
      />
    );
  }
}

class Grid extends React.Component {
  render() {
    const width = this.props.cols * 19;
    var rowsArr = [];

    var boxClass = "";
    for (var i = 0; i < this.props.rows; i++) {
      for (var j = 0; j < this.props.cols; j++) {
        let boxId = i + "_" + j;

        boxClass = this.props.gridFull[i][j] ? "box on" : "box off";
        rowsArr.push(
          <Box
            boxClass={boxClass}
            key={boxId}
            boxId={boxId}
            row={i}
            col={j}
            selectBox={this.props.selectBox}
          />
        );
      }
    }

    return (
      <div className="grid" style={{ width: width }}>
        {rowsArr}
      </div>
    );
  }
}

class Buttons extends React.Component {
  handleSelect = (evt) => {
    this.props.gridSize(evt);
  };

  render() {
    return (
      <div className="center">
        <Button className="button" onClick={this.props.playButton}>
          Play
        </Button>
        <Button className="button" onClick={this.props.pauseButton}>
          Pause
        </Button>
        <Button className="button" onClick={this.props.clear}>
          Clear
        </Button>
        <Button className="button" onClick={this.props.slow}>
          Slow
        </Button>
        <Button className="button" onClick={this.props.fast}>
          Fast
        </Button>
        <Button className="button" onClick={this.props.seed}>
          Seed
        </Button>
      </div>
    );
  }
}

class Main extends React.Component {
  constructor() {
    super();
    // this.speed = 1000;
    this.rows = 30;
    this.cols = 30;

    this.state = {
      gridFull: Array(this.rows)
        .fill()
        .map(() => Array(this.cols).fill(false)),
      speed: 1000,
    };

    this.selectBox = this.selectBox.bind(this);
    this.seed = this.seed.bind(this);
    this.play = this.play.bind(this);
    this.clear = this.clear.bind(this);
    this.calculateBoard = this.calculateBoard.bind(this);
    this.playButton = this.playButton.bind(this);
    this.pauseButton = this.pauseButton.bind(this);
  }

  selectBox = (row, col) => {
    let gridCopy = arrayClone(this.state.gridFull);
    gridCopy[row][col] = !gridCopy[row][col];
    this.setState({
      gridFull: gridCopy,
    });
  };

  playButton = () => {
    clearInterval(this.intervalId);
    this.intervalId = setInterval(this.play, this.speed);
  };

  pauseButton = () => {
    clearInterval(this.intervalId);
  };

  slow = () => {
    this.speed = 1000;
    this.playButton();
  };

  fast = () => {
    this.speed = 100;
    this.playButton();
  };

  seed = () => {
    let gridCopy = arrayClone(this.state.gridFull);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (Math.floor(Math.random() * 4) === 1) {
          gridCopy[i][j] = true;
        }
      }
    }
    this.setState({
      gridFull: gridCopy,
    });
  };

  clear = () => {
    var grid = Array(this.rows)
      .fill()
      .map(() => Array(this.cols).fill(false));
    this.setState({
      gridFull: grid,
      generation: 0,
    });
  };

  calculateBoard = (col, row, board) => {
    let neighbors = 0;
    for (let i = -1; i <= 1; i++) {
      if (board[col + 1]?.[row + i] === true) {
        neighbors++;
      }
      if (board[col - 1]?.[row + i] === true) {
        neighbors++;
      }
    }

    if (board[col][row + 1] === true) neighbors++;
    if (board[col][row - 1] === true) neighbors++;

    if (board[col][row] === false) {
      if (neighbors === 3) {
        board[col][row] = true;
      } else {
        board[col][row] = false;
      }
    } else {
      if (neighbors < 2 || neighbors > 3) {
        board[col][row] = false;
      } else {
        board[col][row] = true;
      }
    }
  };

  play = () => {
    let g = this.state.gridFull;
    let g2 = arrayClone(this.state.gridFull);

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        g[i][j] = this.calculateBoard(i, j, g2);
      }
    }
    this.setState({
      gridFull: g2,
    });
  };

  componentDidMount() {
    this.seed();
    this.playButton();
  }

  render() {
    return (
      <div>
        <h1>The Game of Life</h1>
        <Buttons
          playButton={this.playButton}
          pauseButton={this.pauseButton}
          slow={this.slow}
          fast={this.fast}
          clear={this.clear}
          seed={this.seed}
        />
        <Grid
          gridFull={this.state.gridFull}
          rows={this.rows}
          cols={this.cols}
          selectBox={this.selectBox}
        />
      </div>
    );
  }
}

function arrayClone(arr) {
  return JSON.parse(JSON.stringify(arr));
}

ReactDOM.render(<Main />, document.getElementById("root"));
