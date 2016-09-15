import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';
import { withRouter } from 'react-router';
const Welcome = React.createClass({
  handleStartTouchTap() {
    this.props.router.push('/puzzles');
  },
  render() {
    return (
      <div>
        Welcome to blah blah blah...
        <RaisedButton label="Start" onTouchTap={this.handleStartTouchTap} />
      </div>
    );
  }
});

export default withRouter(Welcome);
