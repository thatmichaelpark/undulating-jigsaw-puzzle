import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import React from 'react';

const Login = React.createClass({
  render() {
    const loginActions = [
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
        title="Login Dialog"
        actions={loginActions}
        modal={true}
        open={this.props.open}
      >
        Login stuff goes here.
      </Dialog>
    );
  }
});

export default Login;
