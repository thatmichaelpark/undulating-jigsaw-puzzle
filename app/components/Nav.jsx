import AppBar from 'material-ui/AppBar';
import axios from 'axios';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Login from 'components/Login'
import React from 'react';
import Signup from 'components/Signup'
import Snackbar from 'material-ui/Snackbar';
import { withRouter } from 'react-router';
import cookie from 'react-cookie';

const Nav = React.createClass({
  getInitialState() {
    return {
      loggedIn: cookie.load('NQJ_loggedIn'),
      username: cookie.load('NQJ_username'),
      userId: cookie.load('NQJ_userId'),
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
    this.props.router.push('/puzzles');
  },
  handleLoginOk(username, password) {
    axios.post('/api/token', { username, password })
      .then((result) => {
        console.log('login result', result.data);
        this.setState({ loggedIn: true, loginIsOpen: false, snackbarIsOpen: true, snackbarMessage: 'You have logged in' });
      })
      .catch((err) => {
        this.setState({ snackbarIsOpen: true, snackbarMessage: err.message });
      });
  },
  handleLoginCancel() {
    this.setState({ loginIsOpen: false });
  },
  handleSignupOk(username, password) {
    axios.post('/api/users', { username, password })
      .then((result) => {
        return axios.post('/api/token', { username, password })
      })
      .then((result) =>{
        const { userId } = result.data;

        this.setState({
          loggedIn: true,
          username,
          userId,
          signupIsOpen: false,
          snackbarIsOpen: true,
          snackbarMessage: 'Signup successful; you are now logged in'
        });
      })
      .catch((err) => {
        this.setState({ snackbarIsOpen: true, snackbarMessage: err.message });
      });
  },
  handleSignupCancel() {
    this.setState({ signupIsOpen: false });
  },
  handleLogoutTouchTap() {
    axios.delete('/api/token')
      .then(() => {
        this.setState({ loggedIn: false, username: null, userId: null, snackbarIsOpen: true, snackbarMessage: 'You have logged out' });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  handleSnackbarRequestClose() {
    this.setState({ snackbarIsOpen: false });
  },
  render() {
    const styles = {
      flatButton: {
        color: 'white',
        height: '64px',
        lineHeight: '64px'
      }
    };
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
              style={styles.flatButton}
            />
          ) : (
            <div>
              <FlatButton
                label="Sign Up"
                onTouchTap={this.handleSignupTouchTap}
                style={styles.flatButton}
              />
              <FlatButton
                label="Log In"
                onTouchTap={this.handleLoginTouchTap}
                style={styles.flatButton}
              />
            </div>
          )}
        </AppBar>
        <div>
          {this.props.children}
        </div>
        <Login
          handleCancel={this.handleLoginCancel}
          handleOk={this.handleLoginOk}
          open={this.state.loginIsOpen}
        />
        <Signup
          handleCancel={this.handleSignupCancel}
          handleOk={this.handleSignupOk}
          open={this.state.signupIsOpen}
        />
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
