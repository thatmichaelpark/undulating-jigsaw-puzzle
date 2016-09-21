import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';
import { withRouter } from 'react-router';
const Welcome = React.createClass({
  handleStartTouchTap() {
    this.props.router.push('/puzzles');
  },
  render() {
    return (
      <div className='welcome'>
        <div className='welcome-copy'>
          Do you like jigsaw puzzles? Me neither. Try something different: puzzles with
          moving edges
        </div>
        <div className="welcome-columns">
          <div className="welcome-column">
            Animated wavy edges.
          </div>
          <div className="welcome-column">
            Rotate pieces.
          </div>
          <div className="welcome-column">
            Lorem ipsum.
          </div>
        </div>
        <div className="welcome-button">
          <RaisedButton label="Start" onTouchTap={this.handleStartTouchTap} primary={true}/>
        </div>
      </div>
    );
  }
});

export default withRouter(Welcome);
