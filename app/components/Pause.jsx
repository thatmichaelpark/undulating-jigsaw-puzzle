import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';

const Pause = React.createClass({
  render() {
    return (
      <Dialog open={this.props.paused}>
        <p>
          {this.props.quoteText}
        </p>
        <p>
          {this.props.quoteAuthor}
        </p>
        <RaisedButton
          onTouchTap={this.props.handleResumeTouchTap}
        >
          Resume
        </RaisedButton>
      </Dialog>
    );
  }
});

export default Pause;
