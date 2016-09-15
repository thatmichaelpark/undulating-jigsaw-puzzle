import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import React from 'react';

const Signup = React.createClass({
  render() {
    const signupActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.props.handleCancel}
      />,
      <FlatButton
        label="OK"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.props.handleOk}
      />,
    ];
    return (
      <Dialog
        title="Signup Dialog"
        actions={signupActions}
        modal={true}
        open={this.props.open}
      >
        Signup stuff goes here...
      </Dialog>
    );
  }
});

export default Signup;
