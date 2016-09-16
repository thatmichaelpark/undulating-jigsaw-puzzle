import React from 'react';
import ReactDOM from 'react-dom';

// https://gist.github.com/sebmarkbage/6f7da234174ab9f64cce


const img = document.createElement('img');

var Graphic = React.createClass({
  getInitialState() {
    return {
      x: 100,
      y: 100,
    };
  },
  componentDidMount: function() {
    var context = ReactDOM.findDOMNode(this).getContext('2d');
    this.paint(context);
    img.src = 'http://placekitten.com/800/800';
    console.log('loading');
    img.addEventListener('load', () => {
      this.paint(context);
      console.log('loaded');
    });
  },

  componentDidUpdate: function() {
    var context = ReactDOM.findDOMNode(this).getContext('2d');
    context.clearRect(0, 0, 200, 200);
    this.paint(context);
  },

  paint: function(ctx) {
    console.log('painted');
    // Save the state, so we can undo the clipping
    ctx.save();

    // Create a circle
    ctx.beginPath();
    // ctx.arc(106, 77, 74, 0, Math.PI * 2, false);
    ctx.moveTo(0, 0);
    ctx.translate(100, 100);
    ctx.lineTo(0, 0);
    ctx.lineTo(0, 250);
    ctx.closePath();

    ctx.restore();
    // Clip to the current path
    ctx.clip();

    ctx.drawImage(img, 0, 0);

    // Undo the clipping
  },

  handleMouseDown(event) {
    console.log(event.screenX, event.screenY);
    console.log(event.pageX, event.pageY);
    console.log(event.clientX, event.clientY);
    this.setState({
      x: event.pageX - 50,
      y: event.pageY - 50
    })
  },
  render: function() {
    const style = {
      position: 'absolute',
      left: this.state.x,
      top: this.state.y,
    }
    return <canvas style={style} onMouseDown={this.handleMouseDown} width={200} height={200} />;
  }

});

var Puzzle = React.createClass({

  getInitialState: function() {
    return { rotation: 0 };
  },

  componentDidMount: function() {
    // requestAnimationFrame(this.tick);
  },

  tick: function() {
    this.setState({ rotation: this.state.rotation + .01 });
    requestAnimationFrame(this.tick);
  },

  render: function() {
    return (
      <div>
        <Graphic rotation={this.state.rotation} />
        <img src="http://placekitten.com/700/700"/>
      </div>
    );
  }

});

export default Puzzle;
