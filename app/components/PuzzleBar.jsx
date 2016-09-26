import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import { Link } from 'react-router';
import React from 'react';
import { formatTime } from 'components/utils';

const PuzzleBar = React.createClass({
  render() {
    const styles = {
      flatButton: {
        color: 'white',
        height: '64px',
        lineHeight: '64px'
      }
    };

    return (
      <AppBar
        onLeftIconButtonTouchTap={this.props.onLeftIconButtonTouchTap}
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
