import { checkNeighbors, createWaveData, generateWaves, hitTest,
  rotateGroupEnd, rotateGroupInit, rotateGroupStep }
  from 'components/utils';
import Piece from 'components/Piece';
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

const Puzzle = React.createClass({

  getInitialState() {
    return {
      img: document.createElement('img'),
      imgLoaded: false,
      time: 0
    };
  },

  componentDidMount() {
    this.clickSound =
      new Audio('/sounds/178186__snapper4298__camera-click-nikon.wav');

    axios.get(`/api/puzzles/${this.props.puzzleId}`)
      .then((result) => {
        (() => { // extract data
          this.nRows = result.data.nRows;
          this.nCols = result.data.nCols;
          this.maxWaveDepth = result.data.maxWaveDepth;
          this.nWaves = result.data.nWaves;
          this.maxFreq = result.data.maxFreq;
          this.maxV = result.data.maxV;
          this.backgroundColor = result.data.backgroundColor;
          this.hasRotatedPieces = result.data.hasRotatedPieces;
          this.pieceContentSize = result.data.pieceContentSize;
          this.pieceActualSize = this.pieceContentSize + 2 * this.maxWaveDepth;
        })();

        // eslint-disable-next-line react/no-find-dom-node
        const bcr = ReactDOM.findDOMNode(this).getBoundingClientRect();
        const pieceDataArray = [];
        const sortedPieceData = [];

        for (let row = 0; row < this.nRows; ++row) {
          const pieceDataRow = [];

          (() => { // Build pieceDataRow
            for (let col = 0; col < this.nCols; ++col) {
              const pieceData = {
                row,
                col,
                x: Math.random() * bcr.width,
                y: Math.random() * bcr.height,
                rot: this.hasRotatedPieces
                ? Math.floor(Math.random() * 4) * 90
                : 0
              };

              pieceData.group = [pieceData];
              pieceDataRow.push(pieceData);
              sortedPieceData.push(pieceData);
            }
          })();
          pieceDataArray.push(pieceDataRow);
        }

        (() => { // Generate wave arrays
          const waveHorizontalData = createWaveData(this.nRows, this.nWaves,
            this.maxWaveDepth, this.maxFreq, this.maxV);
          const waveVerticalData = createWaveData(this.nCols, this.nWaves,
            this.maxWaveDepth, this.maxFreq, this.maxV);
          const verticalWaves = waveVerticalData.map((waveData) => {
            return generateWaves(waveData, this.pieceContentSize, this.nRows,
              0);
          });
          const horizontalWaves = waveHorizontalData.map((waveData) => {
            return generateWaves(waveData, this.pieceContentSize, this.nCols,
              0);
          });

          this.setState({
            waveHorizontalData, waveVerticalData, pieceDataArray,
            sortedPieceData, verticalWaves, horizontalWaves
          });
        })();

        const img = this.state.img;

        img.src = result.data.imageUrl;
        img.addEventListener('load', () => {
          const { width, height } = img;
          const scaleFactor = Math.min(
            width /
              (this.maxWaveDepth * 2 + this.pieceContentSize * this.nCols),
            height /
              (this.maxWaveDepth * 2 + this.pieceContentSize * this.nRows)
          );
          const tileSize = this.pieceContentSize * scaleFactor;

          this.setState({ scaleFactor, tileSize, imgLoaded: true });
          this.raf = requestAnimationFrame(this.tick);
        });
      })
      .catch((err) => {
        console.log(err); // eslint-disable-line no-console
      });
  },

  componentWillUnmount() {
    cancelAnimationFrame(this.raf);
  },

  tick(ms) {
    this.time = ms * 0.001;
    const time = this.time;

    const verticalWaves = this.state.waveVerticalData.map((waveData) => {
      return generateWaves(waveData, this.pieceContentSize, this.nRows, time);
    });
    const horizontalWaves = this.state.waveHorizontalData.map((waveData) => {
      return generateWaves(waveData, this.pieceContentSize, this.nCols, time);
    });

    this.setState({ time, verticalWaves, horizontalWaves });

    if (this.isRotating) {
      const rotateTime = 0.33;
      const easing = (tt) => {
        // after https://github.com/danro/jquery-easing/blob/master/jquery.easing.js
        const ss = 1.70158;

        return (tt -= 1) * tt * ((ss + 1) * tt + ss) + 1;
      };
      const dt = (this.time - this.rotateStartTime) / rotateTime;

      if (dt < 1) {
        rotateGroupStep(this, this.clickedPiece.group,
          this.rotateAngle * easing(dt));
      }
      else {
        this.isRotating = false;
        rotateGroupEnd(this, this.clickedPiece.group, this.rotateAngle);
      }
    }
    this.raf = requestAnimationFrame(this.tick);
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
  isRotating: false,
  mx0: 0,
  my0: 0,
  clickedPiece: null,
  rotateStartTime: 0,
  rotateAngle: 0, // 90 or -90 when rotating
  time: 0,  // time in seconds based on requestAnimationFrame timer

  mouseCoords(event) {
    // eslint-disable-next-line react/no-find-dom-node
    const div = ReactDOM.findDOMNode(this);
    const { left, top } = div.getBoundingClientRect();
    const { scrollLeft, scrollTop } = div;

    return {
      mx: event.clientX - left + scrollLeft,
      my: event.clientY - top + scrollTop
    };
  },

  handleMouseDown(event) {
    if (this.isRotating) {
      return;
    }

    const { sortedPieceData } = this.state;
    const { mx, my } = this.mouseCoords(event);

    for (let i = sortedPieceData.length; (i -= 1) >= 0;) {
      const piece = sortedPieceData[i];

      if (hitTest(mx, my, piece, this.pieceContentSize)) {
        (() => { // Bring hit pieces' group to top
          this.clickedPiece = piece;
          this.bringGroupToTop(this.clickedPiece.group);
          this.mx0 = mx;
          this.my0 = my;
        })();
        if (event.buttons === 1) {
          this.isDragging = true;
        }
        else if (event.buttons === 2) {
          this.isRotating = true;
          this.rotateStartTime = this.time;
          this.rotateAngle = event.shiftKey ? -90 : 90;

          rotateGroupInit(this, this.clickedPiece.group);
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
    if (this.isDragging) {
      // See if any piece in clickedPiece's group is adjacent to a piece
      // in another group; if so, combine groups.
      const group = this.clickedPiece.group;

      for (let i = 0; i < group.length; ++i) {
        const piece = group[i];
        const neighbor = checkNeighbors(this, piece);

        if (neighbor) {
          this.clickSound.play();

          // Combine piece's group and neighbor's group
          neighbor.group.forEach((np) => {
            piece.group.push(np);
            np.group = piece.group;
          });

          // and bring combined group to top
          this.bringGroupToTop(piece.group);

          if (piece.group.length === this.nRows * this.nCols) {
            clearInterval(this.timer);
            this.timer = null;
            this.props.gameOver();
          }
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
      backgroundColor: this.backgroundColor,
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
        {this.state.imgLoaded && !this.props.paused ? (
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
