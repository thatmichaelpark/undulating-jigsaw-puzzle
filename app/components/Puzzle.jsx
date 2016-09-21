import Piece from 'components/Piece';
import React from 'react';
import ReactDOM from 'react-dom';

const hitTest = function(mx, my, piece, pieceContentSize) {
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

const createWaveData = (nWaveData, nWaves, maxWaveDepth) => {
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

  nRows: 4,
  nCols: 5,

  maxWaveDepth: 10,
  nWaves: 3,
  pieceContentSize: 150,

  getInitialState() {
    this.pieceActualSize = this.pieceContentSize + 2 * this.maxWaveDepth;

    const pieceDataArray = [];
    const sortedPieceData = [];

    for (let row = 0; row < this.nRows; ++row) {
      const pieceDataRow = [];

      for (let col = 0; col < this.nCols; ++col) {
        const pieceData = {
          row,
          col,
          x: this.pieceContentSize + col * (this.pieceContentSize - 30),
          y: this.pieceContentSize + row * (this.pieceContentSize - 30),
          rot: 0  // 0, 90, 180, 270
        };

        pieceData.group = [pieceData];
        pieceDataRow.push(pieceData);
        sortedPieceData.push(pieceData);
      }
      pieceDataArray.push(pieceDataRow);
    }

    const waveHorizontalData = createWaveData(this.nRows, this.nWaves, this.maxWaveDepth);
    const waveVerticalData = createWaveData(this.nCols, this.nWaves, this.maxWaveDepth);
    const time = 0;
    const verticalWaves = waveVerticalData.map((waveData) => {
      return generateWaves(waveData, this.pieceContentSize, this.nRows, time);
    });
    const horizontalWaves = waveHorizontalData.map((waveData) => {
      return generateWaves(waveData, this.pieceContentSize, this.nCols, time);
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
    this.state.img.src = '/images/clouds-06.jpg';
    this.state.img.addEventListener('load', () => {
      const { width, height } = this.state.img;
      const scaleFactor = Math.min(
        width / (this.maxWaveDepth * 2 + this.pieceContentSize * this.nCols),
        height / (this.maxWaveDepth * 2 + this.pieceContentSize * this.nRows)
      );
      const tileSize = this.pieceContentSize * scaleFactor;

      this.setState({ scaleFactor, tileSize, imgLoaded: true });
      requestAnimationFrame(this.tick);
    });
  },

  tick(ms) {
    const time = ms * 0.001;
    const verticalWaves = this.state.waveVerticalData.map((waveData) => {
      return generateWaves(waveData, this.pieceContentSize, this.nRows, time);
    });
    const horizontalWaves = this.state.waveHorizontalData.map((waveData) => {
      return generateWaves(waveData, this.pieceContentSize, this.nCols, time);
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

  mouseCoords(event) {
    const div = ReactDOM.findDOMNode(this);
    const { left, top } = div.getBoundingClientRect();
    const { scrollLeft, scrollTop } = div;
    return {
      mx: event.clientX - left + scrollLeft,
      my: event.clientY - top + scrollTop
    };
  },

  handleMouseDown(event) {
    const { sortedPieceData } = this.state;
    const { mx, my } = this.mouseCoords(event);

    for (let i = sortedPieceData.length; (i -= 1) >= 0;) {
      const piece = sortedPieceData[i];

      if (hitTest(mx, my, piece, this.pieceContentSize)) {
        // bring hit piece's group to top
        this.clickedPiece = piece;
        this.bringGroupToTop(this.clickedPiece.group);
        this.mx0 = mx;
        this.my0 = my;
        if (event.buttons === 1) {
          this.isDragging = true;
        }
        else if (event.buttons === 2) {
          const rotate = (piece, origin, ccw) => {
            const dx = piece.x - origin.x;
            const dy = piece.y - origin.y;
            return ccw ?
              { x: origin.x + dy, y: origin.y - dx} :
              { x: origin.x - dy, y: origin.y + dx};
          }
          const ccw = event.shiftKey;
          this.clickedPiece.group.forEach((piece) => {
            piece.rot = (piece.rot + (ccw ? 270 : 90)) % 360;
            const { x, y } = rotate(piece, this.clickedPiece, ccw);
            piece.x = x;
            piece.y = y;
          });
        }
        break;
      }
    }
  },

  handleMouseMove(event) {
    if (!this.isDragging) {
      return;
    }
    const { mx, my } = this.mouseCoords(event);
    const dx = mx - this.mx0;
    const dy = my - this.my0;

    this.mx0 = mx;
    this.my0 = my;

    const top =
      this.state.sortedPieceData[this.state.sortedPieceData.length - 1];

    this.moveGroup(top.group, dx, dy);
  },

  handleMouseUp() {
    const checkNeighbor = (piece, drow, dcol) => {
      const neighbor =
        this.state.pieceDataArray[piece.row + drow][piece.col + dcol];

      if (piece.group === neighbor.group) { // neighbor is in same group?
        return null;
      }
      if (piece.rot !== neighbor.rot) { // different orientations?
        return null;
      }
      let x = piece.x;
      let y = piece.y;

      switch (piece.rot) {
        case 0:
          x += dcol * this.pieceContentSize;
          y += drow * this.pieceContentSize;
          break;
        case 90:
          x -= drow * this.pieceContentSize;
          y += dcol * this.pieceContentSize;
          break;
        case 180:
          x -= dcol * this.pieceContentSize;
          y -= drow * this.pieceContentSize;
          break;
        default: // 270
          x += drow * this.pieceContentSize;
          y -= dcol * this.pieceContentSize;
          break;
      }
      const dx = neighbor.x - x;
      const dy = neighbor.y - y;

      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
        this.moveGroup(piece.group, dx, dy);

        return neighbor;
      }

      return null;
    };

    const checkNeighbors = (piece) => {
      const { row, col } = piece;

      if (row > 0) {
        const neighbor = checkNeighbor(piece, -1, 0);

        if (neighbor) {
          return neighbor;
        }
      }
      if (row < this.nRows - 1) {
        const neighbor = checkNeighbor(piece, 1, 0);

        if (neighbor) {
          return neighbor;
        }
      }
      if (col > 0) {
        const neighbor = checkNeighbor(piece, 0, -1);

        if (neighbor) {
          return neighbor;
        }
      }
      if (col < this.nCols - 1) {
        const neighbor = checkNeighbor(piece, 0, 1);

        if (neighbor) {
          return neighbor;
        }
      }

      return null;
    };

    if (this.isDragging) {
      // See if any piece in clickedPiece's group is adjacent to a piece
      // in another group; if so, combine groups.
      const group = this.clickedPiece.group;

      for (let i = 0; i < group.length; ++i) {
        const piece = group[i];
        const neighbor = checkNeighbors(piece);

        if (neighbor) {
          // Combine piece's group and neighbor's group
          neighbor.group.forEach((np) => {
            piece.group.push(np);
            np.group = piece.group;
          });

          // and bring combined group to top
          this.bringGroupToTop(piece.group);

          break;
        }
      }
    }
    this.isDragging = false;
  },

  handleContextMenu(event) {
    event.preventDefault();
  },

  render() {
    const style = {
      width: '100%',
      top: '64px',
      bottom: 0,
      position: 'absolute',
      backgroundColor: 'yellow',
      overflow: 'auto'
    };

    return (
      <div
        onContextMenu={this.handleContextMenu}
        onMouseDown={this.handleMouseDown}
        onMouseLeave={this.handleMouseUp}
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.handleMouseUp}
        style={style}
      >
        {this.state.imgLoaded ? (
          this.state.sortedPieceData.map((piece, index) => {
            return (
              <Piece
                col={piece.col}
                horizontalWaves={this.state.horizontalWaves}
                img={this.state.img}
                key={index}
                maxWaveDepth={this.maxWaveDepth}
                pieceActualSize={this.pieceActualSize}
                pieceContentSize={this.pieceContentSize}
                rot={piece.rot}
                row={piece.row}
                scaleFactor={this.state.scaleFactor}
                tileSize={this.state.tileSize}
                time={this.state.time}
                verticalWaves={this.state.verticalWaves}
                x={piece.x}
                y={piece.y}
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
