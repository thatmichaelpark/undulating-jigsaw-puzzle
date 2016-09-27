import AppBar from 'material-ui/AppBar';
import Dimensions from 'react-dimensions';
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
        showMenuIconButton={this.props.containerWidth < 900}
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
        {this.props.containerWidth > 900 ? (
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
        ) : (
          null
        )}
      </AppBar>
    );
  }
});

export default Dimensions()(PuzzleBar); // eslint-disable-line new-cap
