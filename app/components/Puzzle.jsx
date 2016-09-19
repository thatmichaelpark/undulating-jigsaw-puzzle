import React from 'react';
import ReactDOM from 'react-dom';

const nRows = 3;
const nCols = 3;
const pieceContentSize = 150;
const maxWaveDepth = 10;
const pieceActualSize = maxWaveDepth * 2 + pieceContentSize;
const nWaves = 3;

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
    const {
      row, col, verticalWaves, horizontalWaves, scaleFactor, tileSize
    } = this.props;

    // ctx.clearRect(0, 0, pieceActualSize, pieceActualSize);
    ctx.save();
    ctx.translate(maxWaveDepth, maxWaveDepth);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    for (let i = 0; i < pieceContentSize; ++i) {
      ctx.lineTo(verticalWaves[col][row * pieceContentSize + i], i);
    }
    for (let i = 0; i < pieceContentSize; ++i) {
      ctx.lineTo(i, pieceContentSize +
        horizontalWaves[row + 1][col * pieceContentSize + i]);
    }
    for (let i = pieceContentSize; (i -= 1) >= 0;) {
      ctx.lineTo(pieceContentSize +
        verticalWaves[col + 1][row * pieceContentSize + i], i);
    }
    for (let i = pieceContentSize; (i -= 1) >= 0;) {
      ctx.lineTo(i, horizontalWaves[row][col * pieceContentSize + i]);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.clip();
    ctx.translate(-maxWaveDepth, -maxWaveDepth);

    const x0 = (maxWaveDepth + col * pieceContentSize) * scaleFactor;
    const y0 = (maxWaveDepth + row * pieceContentSize) * scaleFactor;
    const size = tileSize * pieceActualSize / pieceContentSize;
    const offset = (size - tileSize) / 2;

    ctx.drawImage(this.props.img,
      x0 - offset, y0 - offset,
      size, size,
      0, 0,
      pieceActualSize, pieceActualSize
    );
    ctx.restore();
  },

  render() {
    const { x, y, rot } = this.props;
    const style = {
      position: 'absolute',
      left: x - pieceActualSize / 2,
      top: y - pieceActualSize / 2,
      transform: `rotate(${rot}deg)`
    };

    return (
      <canvas
        height={pieceActualSize}
        style={style}
        width={pieceActualSize}
      />
    );
  }
});

const hitTest = function(mx, my, piece) {
// mx, my: mouse coordinates
// piece.x, piece.y: piece center coordinates
// piece.rot: piece's rotation (0, 90, 180, or 270)
// Return true if (mx, my) hits the piece.
  const { x, y, rot } = piece;
  const dx = mx - x;
  const dy = my - y;
  let cx = pieceContentSize / 2;
  let cy = pieceContentSize / 2;

  switch (rot) {
    case 0:
      cx += dx;
      cy += dy;
      break;
    case 90:
      cx += dy;
      cy -= dx;
      break;
    case 180:
      cx -= dx;
      cy -= dy;
      break;
    default: // 270
      cx -= dy;
      cy += dx;
      break;
  }
  const left = 0;
  const right = pieceContentSize;
  const top = 0;
  const bottom = pieceContentSize;

  return left < cx && cx < right && top < cy && cy < bottom;
};

const createWaveData = (nWaveData) => {
  const waveData = [];

  for (let i = 0; i <= nWaveData; ++i) {
    const waveDatum = [];
    let maxDepth = 0;

    for (let k = 0; k < nWaves; ++k) {
      const a = (Math.random() - 0.5);
      const freq = Math.random() * 5;
      const v = (Math.random() - 0.5) * 10;

      maxDepth += Math.abs(a);
      waveDatum.push({ a, freq, v });
    }
    for (let k = 0; k < nWaves; ++k) {
      waveDatum[k].a *= maxWaveDepth / maxDepth;
    }
    waveData.push(waveDatum);
  }

  return waveData;
};

// eslint-disable-next-line max-params
const generateWaves = (waveData, pieceSize, nPieces, time) => {
  const result = [];

  for (let i = 0; i < pieceSize * nPieces; ++i) {
    const theta = i * Math.PI * 2 / pieceSize;
    let sum = 0;

    for (let k = 0; k < waveData.length; ++k) {
      sum += waveData[k].a * Math.sin(waveData[k].freq * theta +
        waveData[k].v * time);
    }
    result.push(sum * Math.sin(theta / 2));
  }

  return result;
};

const Puzzle = React.createClass({
  getInitialState() {
    const pieceDataArray = [];
    const sortedPieceData = [];

    for (let row = 0; row < nRows; ++row) {
      const pieceDataRow = [];

      for (let col = 0; col < nCols; ++col) {
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
    const spd = this.state.sortedPieceData.slice(); // copy

    group.forEach((piece) => {
      piece.x += dx;
      piece.y += dy;
    });
    this.setState({ sortedPieceData: spd });
  },

  bringGroupToTop(group) {
    let spd = this.state.sortedPieceData.slice(); // copy

    group.forEach((piece) => {
      const j = spd.indexOf(piece);
      const left = (spd.slice(0, j));
      const right = (spd.slice(j));

      right.push(right.shift());
      spd = left.concat(right);
    });
    this.setState({ sortedPieceData: spd });
  },

  isDragging: false,
  mx0: 0,
  my0: 0,
  clickedPiece: null,

  handleMouseDown(event) {
    const { sortedPieceData } = this.state;

    for (let i = sortedPieceData.length; (i -= 1) >= 0;) {
      const piece = sortedPieceData[i];

      if (hitTest(event.pageX, event.pageY, piece)) {
        // bring hit piece's group to top
        this.clickedPiece = piece;
        this.bringGroupToTop(this.clickedPiece.group);
        this.mx0 = event.pageX;
        this.my0 = event.pageY;
        if (event.buttons === 1) {
          this.isDragging = true;
        }
        else if (event.buttons === 2) {
          this.clickedPiece.rot = (this.clickedPiece.rot + 90) % 360;
          // this.setState({ sortedPieceData: sortedPieceData });
        }
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
    const top =
      this.state.sortedPieceData[this.state.sortedPieceData.length - 1];
    this.moveGroup(top.group, dx, dy);
  },

  handleMouseUp(event) {
    const checkNeighbor = (piece, drow, dcol) => {
      const n = this.state.pieceDataArray[piece.row + drow][piece.col + dcol];
      if (piece.group === n.group) { // neighbor is in same group as piece
        return null;
      }
      if (piece.rot !== n.rot) { // different orientations?
        return null;
      }
      let x = piece.x;
      let y = piece.y;
      switch (piece.rot) {
        case 0:
          x += dcol * pieceContentSize;
          y += drow * pieceContentSize;
          break;
        case 90:
          x -= drow * pieceContentSize;
          y += dcol * pieceContentSize;
          break;
        case 180:
          x -= dcol * pieceContentSize;
          y -= drow * pieceContentSize;
          break;
        default: // 270
          x += drow * pieceContentSize;
          y -= dcol * pieceContentSize;
          break;
      }
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
        // Combine piece's group and neighbor's group
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

  handleContextMenu(event) {
    event.preventDefault();
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
        onContextMenu={this.handleContextMenu}
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
