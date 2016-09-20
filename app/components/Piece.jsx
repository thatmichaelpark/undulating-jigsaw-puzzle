import {
  maxWaveDepth, pieceActualSize, pieceContentSize
} from '../constants';
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

export default Piece;
