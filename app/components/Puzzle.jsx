import React from 'react';

const Puzzle = React.createClass({
  render() {
    return (
      <div>
        Puzzle {this.props.params.puzzleId}
      </div>
    );
  }
});

export default Puzzle;
