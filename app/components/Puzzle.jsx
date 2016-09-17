import React from 'react';
import ReactDOM from 'react-dom';

// https://gist.github.com/sebmarkbage/6f7da234174ab9f64cce


const Piece = React.createClass({
  getInitialState() {
    return {
      i: this.props.i,
      j: this.props.j,
      x: this.props.x,
      y: this.props.y
    };
  },

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
    const {i, j, x, y} = this.state;
    const {tileSize} = this.props;

    const w = [];
    for (let u=0; u<pieceContentSize; ++u) {
      w.push(-maxWaveDepth * Math.sin(u / pieceContentSize * Math.PI));
    }

    ctx.save();
    ctx.translate(maxWaveDepth, maxWaveDepth);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    for (let u=0; u<pieceContentSize; ++u){
      ctx.lineTo(w[u], u);
    }
    for (let u=0; u<pieceContentSize; ++u) {
      ctx.lineTo(u, pieceContentSize + w[u]);
    }
    for (let u=pieceContentSize; --u >= 0;) {
      ctx.lineTo(pieceContentSize + w[u], u);
    }
    for (let u=pieceContentSize; --u >= 0;) {
      ctx.lineTo(u, w[u]);
    }
    ctx.closePath();
    ctx.restore();
    ctx.clip();

    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(0, pieceActualSize);
    ctx.lineTo(pieceActualSize, pieceActualSize);
    ctx.closePath();
    ctx.fill();

    const x0 = maxWaveDepth + j * tileSize;
    const y0 = maxWaveDepth + i * tileSize;
    const size = tileSize * pieceActualSize / pieceContentSize;
    const d = (size - tileSize) / 2;

    ctx.drawImage(this.props.img,
      x0 - d, y0 - d,
      size, size,
      0, 0,
      pieceActualSize, pieceActualSize);
  },

  render: function() {
    const {x, y} = this.state;
    const style = {
      position: 'absolute',
      left: x - pieceActualSize / 2,
      top: y - pieceActualSize / 2,
      outline: '1px solid green'
    }
    return <canvas style={style} width={pieceActualSize} height={pieceActualSize} />;
  }

});

const rows = 3;
const cols = 3;
const pieceContentSize = 100;
const maxWaveDepth = 20;
const pieceActualSize = maxWaveDepth * 2 + pieceContentSize;
const nWaves = 1;

const createWaveData = (n) => {
  const waveData = [];
  for (let i = 0; i <= n; ++i ) {
    const waveDatum = [];
    let maxDepth = 0;
    for (let k=0; k<nWaves; ++k) {
      const a = (Math.random() - 0.5);
      const f = Math.random() * 1;
      const v = (Math.random() - 0.5) * 1;
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
    return {
      img: document.createElement('img'),
      waveHorizontalData: createWaveData(rows),
      waveVerticalData: createWaveData(cols),
      pieces: []
    };
  },

  componentDidMount: function() {
    this.state.img.src = 'http://placekitten.com/800/800';
    this.state.img.addEventListener('load', () => {
      const { width, height } = this.state.img;
      const d = maxWaveDepth * 2 * pieceActualSize / pieceContentSize;
      const prospectiveTileWidth = Math.floor((width - d) / cols);
      const prospectiveTileHeight = Math.floor((height - d) / rows);
      const tileSize = Math.min(prospectiveTileWidth, prospectiveTileHeight);

      this.setState({ tileSize });
      console.log(this.state.tileSize);
      this.setState({
        pieces: [
          <Piece i={0} j={0} x={100} y={200} img={this.state.img} tileSize={this.state.tileSize}/>,
          <Piece i={0} j={1} x={281} y={200} img={this.state.img} tileSize={this.state.tileSize}/>,
          <Piece i={1} j={0} x={100} y={401} img={this.state.img} tileSize={this.state.tileSize}/>,
          <Piece i={1} j={1} x={281} y={401} img={this.state.img} tileSize={this.state.tileSize}/>
        ]
      });
    });
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
        <h6>Howdy</h6>
        <h1>Howdy</h1>
        <h2>Howdy</h2>
        {this.state.pieces}
      </div>
    );
  }

});

export default Puzzle;
