import AppBar from 'material-ui/AppBar';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import React from 'react';
import Snackbar from 'material-ui/Snackbar';
import { withRouter } from 'react-router';

const Nav = React.createClass({
  getInitialState() {
    return {
      loggedIn: false,
      username: null,
      userId: null,
      loginIsOpen: false,
      signupIsOpen: false,
      snackbarIsOpen: false,
      snackbarMessage: ''
    };
  },
  handleLoginTouchTap() {
    this.setState({ loginIsOpen: true });
  },
  handleSignupTouchTap() {
    this.setState({ signupIsOpen: true });
  },
  handleTitleTouchTap() {
    this.props.router.push('/');
  },
  handleLoginOk() {
    this.setState({ loggedIn: true, loginIsOpen: false, snackbarIsOpen: true, snackbarMessage: 'You have logged in' });
  },
  handleLoginCancel() {
    this.setState({ loginIsOpen: false });
  },
  handleSignupOk() {
    this.setState({ loggedIn: true, signupIsOpen: false, snackbarIsOpen: true, snackbarMessage: 'You have logged in' });
  },
  handleSignupCancel() {
    this.setState({ signupIsOpen: false });
  },
  handleLogoutTouchTap() {
    this.setState({ loggedIn: false, username: null, userId: null, snackbarIsOpen: true, snackbarMessage: 'You have logged out' });
  },
  handleSnackbarRequestClose() {
    this.setState({ snackbarIsOpen: false });
  },
  render() {
    const loginActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleLoginCancel}
      />,
      <FlatButton
        label="OK"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleLoginOk}
      />,
    ];
    const signupActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleSignupCancel}
      />,
      <FlatButton
        label="OK"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleSignupOk}
      />,
    ];
    return (
      <div>
        <AppBar
          onTitleTouchTap={this.handleTitleTouchTap}
          title="Not-Quite-Jigsaw Puzzles"
        >
        {this.state.loggedIn ? (
          <FlatButton
            label="Log Out"
            onTouchTap={this.handleLogoutTouchTap}
          />
        ) : (
          <div>
            <FlatButton
              label="Sign Up"
              onTouchTap={this.handleSignupTouchTap}
            />
            <FlatButton
              label="Log In"
              onTouchTap={this.handleLoginTouchTap}
            />
          </div>
        )}
        </AppBar>
        <div>
          [{this.props.children}]
        </div>
        <Dialog
          title="Login Dialog"
          actions={loginActions}
          modal={true}
          open={this.state.loginIsOpen}
        >
          Login stuff goes here.
        </Dialog>
        <Dialog
          title="Signup Dialog"
          actions={signupActions}
          modal={true}
          open={this.state.signupIsOpen}
        >
          Signup stuff goes here...
        </Dialog>
        <Snackbar
          open={this.state.snackbarIsOpen}
          message={this.state.snackbarMessage}
          autoHideDuration={3000}
          onRequestClose={this.handleSnackbarRequestClose}
        />
      </div>
    );
  }
});

export default withRouter(Nav);
