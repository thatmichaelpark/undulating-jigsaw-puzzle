import React from 'react';
import ReactDOM from 'react-dom';

// https://gist.github.com/sebmarkbage/6f7da234174ab9f64cce

const Piece = React.createClass({
  componentDidMount: function() {
    var ctx = ReactDOM.findDOMNode(this).getContext('2d');
    this.paint(ctx);
  },

  componentDidUpdate: function() {
    var ctx = ReactDOM.findDOMNode(this).getContext('2d');
    ctx.clearRect(0, 0, 200, 200);
    this.paint(ctx);
  },

  paint: function(ctx) {
    const {i, j, x, y, time, verticalWaves, horizontalWaves} = this.props;
    const {scaleFactor, tileSize} = this.props;

    // ctx.clearRect(0, 0, pieceActualSize, pieceActualSize);
    ctx.save();
    ctx.translate(maxWaveDepth, maxWaveDepth);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    for (let u=0; u<pieceContentSize; ++u){
      ctx.lineTo(verticalWaves[j][i * pieceContentSize + u], u);
    }
    for (let u=0; u<pieceContentSize; ++u) {
      ctx.lineTo(u, pieceContentSize + horizontalWaves[i + 1][j * pieceContentSize + u]);
    }
    for (let u=pieceContentSize; --u >= 0;) {
      ctx.lineTo(pieceContentSize + verticalWaves[j + 1][i * pieceContentSize + u], u);
    }
    for (let u=pieceContentSize; --u >= 0;) {
      ctx.lineTo(u, horizontalWaves[i][j * pieceContentSize + u]);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.clip();
    ctx.translate(-maxWaveDepth, -maxWaveDepth);

    const x0 = (maxWaveDepth + j * pieceContentSize) * scaleFactor;
    const y0 = (maxWaveDepth + i * pieceContentSize) * scaleFactor;
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

  render: function() {
    const {x, y} = this.props;
    const style = {
      position: 'absolute',
      left: x - pieceActualSize / 2,
      top: y - pieceActualSize / 2,
      // outline: '1px solid green'
    }
    return <canvas style={style} width={pieceActualSize} height={pieceActualSize} />;
  }

});

const rows = 4;
const cols = 4;
const pieceContentSize = 150;
const maxWaveDepth = 10;
const pieceActualSize = maxWaveDepth * 2 + pieceContentSize;
const nWaves = 3;

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

  getInitialState: function() {
    const pieces = [];
    for (let i=0; i<rows; ++i) {
      for (let j=0; j<cols; ++j) {
        pieces.push({
          i,
          j,
          x: 100 + j * (pieceContentSize + 10),
          y: 170 + i * (pieceContentSize + 10)
        });
      }
    }
    const waveHorizontalData = createWaveData(rows);
    const waveVerticalData = createWaveData(cols);
    const time = 0;
    const verticalWaves = waveVerticalData.map((waveData) => {
      return generateWaves(waveData, pieceContentSize, cols, time);
    });
    const horizontalWaves = waveHorizontalData.map((waveData) => {
      return generateWaves(waveData, pieceContentSize, rows, time);
    });
    return {
      img: document.createElement('img'),
      imgLoaded: false,
      waveHorizontalData,
      waveVerticalData,
      pieces,
      time: 0,
      verticalWaves,
      horizontalWaves
    };
  },

  componentDidMount: function() {
    this.state.img.src = 'http://placekitten.com/800/800';
    this.state.img.addEventListener('load', () => {
      const { width, height } = this.state.img;
      const scaleFactor = Math.min(
        width / (maxWaveDepth * 2 + pieceContentSize * cols),
        height / (maxWaveDepth * 2 + pieceContentSize * rows)
      );
      const tileSize = pieceContentSize * scaleFactor;

      this.setState({ scaleFactor, tileSize, imgLoaded: true });
      requestAnimationFrame(this.tick);
    });
  },

  tick(ms) {
    const time = ms * 0.001;
    const verticalWaves = this.state.waveVerticalData.map((waveData) => {
      return generateWaves(waveData, pieceContentSize, cols, time);
    });
    const horizontalWaves = this.state.waveHorizontalData.map((waveData) => {
      return generateWaves(waveData, pieceContentSize, rows, time);
    });
    this.setState({ time, verticalWaves, horizontalWaves });
    requestAnimationFrame(this.tick);
  },

  handleMouseDown() {
    console.log('down');
  },

  handleMouseLeave() {
    console.log('Leave');
  },

  render: function() {
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
        onMouseLeave={this.handleMouseLeave}
      >
        {this.state.imgLoaded ? (
          this.state.pieces.map((piece, index) => {
            return (
              <Piece
                key={index}
                i={piece.i}
                j={piece.j}
                x={piece.x}
                y={piece.y}
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
