import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import { Link } from 'react-router';
import React from 'react';

const PuzzleBar = React.createClass({
  render() {
    const formatTime = (timeInSeconds) => {
      const hours = Math.floor(timeInSeconds / 3600);
      const minutes = Math.floor((timeInSeconds % 3600) / 60);
      const seconds = timeInSeconds % 60;
      const twoDigits = (a) => (a <= 9 ? '0' : '') + a;

      return `${hours}:${twoDigits(minutes)}:${twoDigits(seconds)}`;
    };
    const styles = {
      flatButton: {
        color: 'white',
        height: '64px',
        lineHeight: '64px'
      }
    };

    return (
      <AppBar
        title={
          <div
            style={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            {formatTime(this.props.elapsedTime)}
          </div>
        }
      >
        <div>
          {
            this.props.playing
              ? <FlatButton
                label="Pause"
                onTouchTap={this.props.onPauseTouchTap}
                style={styles.flatButton}
              />
            : null
          }
          <Link to="/puzzles">
            <FlatButton
              label="Return to puzzles"
              style={styles.flatButton}
            />
          </Link>
        </div>
      </AppBar>
    );
  }
});

export default PuzzleBar;
