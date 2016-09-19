import React from 'react';
import ReactDOM from 'react-dom';

// https://gist.github.com/sebmarkbage/6f7da234174ab9f64cce

const Piece = React.createClass({

  componentDidMount() {
    const ctx = ReactDOM.findDOMNode(this).getContext('2d');
    this.paint(ctx);
  },

  componentDidUpdate() {
    const ctx = ReactDOM.findDOMNode(this).getContext('2d');
    ctx.clearRect(0, 0, 200, 200);
    this.paint(ctx);
  },

  paint(ctx) {
    const {row, col, x, y, time, verticalWaves, horizontalWaves} = this.props;
    const {scaleFactor, tileSize} = this.props;

    // ctx.clearRect(0, 0, pieceActualSize, pieceActualSize);
    ctx.save();
    ctx.translate(maxWaveDepth, maxWaveDepth);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    for (let u=0; u<pieceContentSize; ++u){
      ctx.lineTo(verticalWaves[col][row * pieceContentSize + u], u);
    }
    for (let u=0; u<pieceContentSize; ++u) {
      ctx.lineTo(u, pieceContentSize + horizontalWaves[row + 1][col * pieceContentSize + u]);
    }
    for (let u=pieceContentSize; --u >= 0;) {
      ctx.lineTo(pieceContentSize + verticalWaves[col + 1][row * pieceContentSize + u], u);
    }
    for (let u=pieceContentSize; --u >= 0;) {
      ctx.lineTo(u, horizontalWaves[row][col * pieceContentSize + u]);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.clip();
    ctx.translate(-maxWaveDepth, -maxWaveDepth);

    const x0 = (maxWaveDepth + col * pieceContentSize) * scaleFactor;
    const y0 = (maxWaveDepth + row * pieceContentSize) * scaleFactor;
    const size = tileSize * pieceActualSize / pieceContentSize;
    const d = (size - tileSize) / 2;

    ctx.drawImage(this.props.img,
      x0 - d, y0 - d,
      size, size,
      0, 0,
      pieceActualSize, pieceActualSize
    );
    ctx.restore();
  },

  render() {
    const {x, y, rot} = this.props;
    const style = {
      position: 'absolute',
      left: x - pieceActualSize / 2,
      top: y - pieceActualSize / 2,
      transform: `rotate(${rot}deg)`
      // outline: '1px solid green'
    }
    return (
      <canvas
        style={style}
        width={pieceActualSize}
        height={pieceActualSize}
      />
    );
  }

});

const nRows = 3;
const nCols = 3;
const pieceContentSize = 150;
const maxWaveDepth = 10;
const pieceActualSize = maxWaveDepth * 2 + pieceContentSize;
const nWaves = 3;

const hitTest = function(mx, my, piece) {
// mx, my: mouse coordinates
// piece.x, piece.y: piece center coordinates
// piece.rot: piece's rotation (0, 90, 180, or 270)
// Return true if (mx, my) hits the piece.
  const { x, y, rot } = piece;
  const dx = mx - x;
  const dy = my - y;
  let u = pieceContentSize / 2;
  let v = pieceContentSize / 2;

  switch(rot) {
    case 0:
      u += dx;
      v += dy;
      break;
    case 90:
      u += dy;
      v -= dx;
      break;
    case 180:
      u -= dx;
      v -= dy;
      break;
    default: // 270
      u -= dy;
      v += dx;
      break;
  }
  const l = 0; // left
  const r = pieceContentSize; // right
  const t = 0; // top
  const b = pieceContentSize; // bottom
  return l < u && u < r && t < v && v < b;
};


const createWaveData = (n) => {
  const waveData = [];
  for (let i = 0; i <= n; ++i ) {
    const waveDatum = [];
    let maxDepth = 0;
    for (let k=0; k<nWaves; ++k) {
      const a = (Math.random() - 0.5);
      const f = Math.random() * 5;
      const v = (Math.random() - 0.5) * 10;
      maxDepth += Math.abs(a);
      waveDatum.push({ a, f, v });
    }
    for (let k=0; k<nWaves; ++k) {
      waveDatum[k].a *= maxWaveDepth / maxDepth;
    }
    waveData.push(waveDatum);
  }
  return waveData;
};

const generateWaves = (waveData, pieceSize, nPieces, time) => {
  const result = [];
  for (let i = 0; i < pieceSize * nPieces; ++i) {
    const t = i * Math.PI * 2 / pieceSize;
    let sum = 0;
    for (let k = 0; k < waveData.length; ++k) {
      sum += waveData[k].a * Math.sin(waveData[k].f * t + waveData[k].v * time);
    }
    result.push(sum * Math.sin(t / 2));
  }
  return result;
};

var Puzzle = React.createClass({

  getInitialState() {
    const pieceDataArray = [];
    const sortedPieceData = [];

    for (let row=0; row<nRows; ++row) {
      const pieceDataRow = [];
      for (let col=0; col<nCols; ++col) {
        const pieceData = {
          row,
          col,
          x: 100 + col * (pieceContentSize - 30),
          y: 170 + row * (pieceContentSize - 30),
          rot: 0  // 0, 90, 180, 270
        };
        pieceData.group = [pieceData];
        pieceDataRow.push(pieceData);
        sortedPieceData.push(pieceData);
      }
      pieceDataArray.push(pieceDataRow);
    }

    const waveHorizontalData = createWaveData(nRows);
    const waveVerticalData = createWaveData(nCols);
    const time = 0;
    const verticalWaves = waveVerticalData.map((waveData) => {
      return generateWaves(waveData, pieceContentSize, nCols, time);
    });
    const horizontalWaves = waveHorizontalData.map((waveData) => {
      return generateWaves(waveData, pieceContentSize, nRows, time);
    });
    return {
      img: document.createElement('img'),
      imgLoaded: false,
      waveHorizontalData,
      waveVerticalData,
      pieceDataArray,
      sortedPieceData,
      time: 0,
      verticalWaves,
      horizontalWaves
    };
  },

  componentDidMount() {
    this.state.img.src = '/images/3x3.png';
    this.state.img.addEventListener('load', () => {
      const { width, height } = this.state.img;
      const scaleFactor = Math.min(
        width / (maxWaveDepth * 2 + pieceContentSize * nCols),
        height / (maxWaveDepth * 2 + pieceContentSize * nRows)
      );
      const tileSize = pieceContentSize * scaleFactor;

      this.setState({ scaleFactor, tileSize, imgLoaded: true });
      requestAnimationFrame(this.tick);
    });
  },

  tick(ms) {
    const time = ms * 0.001;
    const verticalWaves = this.state.waveVerticalData.map((waveData) => {
      return generateWaves(waveData, pieceContentSize, nCols, time);
    });
    const horizontalWaves = this.state.waveHorizontalData.map((waveData) => {
      return generateWaves(waveData, pieceContentSize, nRows, time);
    });
    this.setState({ time, verticalWaves, horizontalWaves });
    requestAnimationFrame(this.tick);
  },

  moveGroup(group, dx, dy) {
    const s = this.state.sortedPieceData.slice(); // copy
    group.forEach((p) => {
      p.x += dx;
      p.y += dy;
    })
    this.setState({ sortedPieceData: s });
  },

  bringGroupToTop(group) {
    let s = this.state.sortedPieceData.slice(); // copy

    group.forEach((p) => {
      const j = s.indexOf(p);
      const left = (s.slice(0, j))
      const right = (s.slice(j))
      right.push(right.shift())
      s = left.concat(right);
    });
    this.setState({ sortedPieceData: s });
  },

  isDragging: false,
  mx0: 0,
  my0: 0,
  clickedPiece: null,

  handleMouseDown(event) {
    const { sortedPieceData } = this.state;

    for (let i=sortedPieceData.length; --i >= 0;) {
      const piece = sortedPieceData[i];
      if (hitTest(event.pageX, event.pageY, piece)) {
        // bring hit piece's group to top
        this.clickedPiece = piece;
        this.bringGroupToTop(this.clickedPiece.group);
        this.mx0 = event.pageX;
        this.my0 = event.pageY;
        this.isDragging = true;
        break;
      }
    }
  },

  handleMouseMove(event) {
    if (!this.isDragging) {
      return;
    }
    const dx = event.pageX - this.mx0;
    const dy = event.pageY - this.my0;
    this.mx0 = event.pageX;
    this.my0 = event.pageY;
    const top = this.state.sortedPieceData[this.state.sortedPieceData.length - 1];
    this.moveGroup(top.group, dx, dy);
  },

  handleMouseUp(event) {
    const checkNeighbor = (piece, drow, dcol) => {
      const n = this.state.pieceDataArray[piece.row + drow][piece.col + dcol];
      if (piece.group === n.group) { // neighbor is in same group as piece
        return null;
      }
      const x = piece.x + dcol * pieceContentSize;
      const y = piece.y + drow * pieceContentSize;
      const dx = n.x - x;
      const dy = n.y - y;
      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
        this.moveGroup(piece.group, dx, dy);
        return n;
      }
      return null;
    };
    const checkNeighbors = (piece) => {
      const { row, col } = piece;
      if (row > 0) {
        const p = checkNeighbor(piece, -1, 0);
        if (p) return p;
      }
      if (row < nRows - 1) {
        const p = checkNeighbor(piece, 1, 0);
        if (p) return p;
      }
      if (col > 0) {
        const p = checkNeighbor(piece, 0, -1);
        if (p) return p;
      }
      if (col < nCols - 1) {
        const p = checkNeighbor(piece, 0, 1);
        if (p) return p;
      }
      return null;
    };

    this.isDragging = false;

    // See if any piece in clickedPiece's group is adjacent to a piece
    // in another group; if so, combine groups.
    const group = this.clickedPiece.group;
    for (let i=0; i<group.length; ++i) {
      const piece = group[i];
      const neighbor = checkNeighbors(piece);
      if (neighbor) {
        // combine piece's group and neighbor's group
        neighbor.group.forEach((p) => {
          piece.group.push(p);
          p.group = piece.group;
        });
        // and bring combined group to top
        this.bringGroupToTop(piece.group);
        return;
      }
    }
  },

  render() {
    const style = {
      width: '100%',
      top: 0,
      bottom: 0,
      position: 'absolute',
      backgroundColor: 'yellow'
    }
    return (
      <div
        style={style}
        onMouseDown={this.handleMouseDown}
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.handleMouseUp}
        onMouseLeave={this.handleMouseUp}
      >
        {this.state.imgLoaded ? (
          this.state.sortedPieceData.map((piece, index) => {
            return (
              <Piece
                key={index}
                row={piece.row}
                col={piece.col}
                x={piece.x}
                y={piece.y}
                rot={piece.rot}
                img={this.state.img}
                scaleFactor={this.state.scaleFactor}
                tileSize={this.state.tileSize}
                time={this.state.time}
                verticalWaves={this.state.verticalWaves}
                horizontalWaves={this.state.horizontalWaves}
              />
            );
          }))
           : null
        }
      </div>
    );
  }

});

export default Puzzle;
