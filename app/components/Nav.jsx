import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import Login from 'components/Login';
import React from 'react';
import Signup from 'components/Signup';
import Snackbar from 'material-ui/Snackbar';
import axios from 'axios';
import cookie from 'react-cookie';
import { withRouter } from 'react-router';

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
  componentDidMount() {
    if (this.state.loggedIn) {
      this.props.router.push('/puzzles');
    }
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
      .then(() => {
        this.setState({
          loggedIn: true,
          loginIsOpen: false,
          snackbarIsOpen: true,
          snackbarMessage: 'You have logged in'
        });
        this.props.router.push('/puzzles');
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
      .then(() => {
        return axios.post('/api/token', { username, password });
      })
      .then((result) => {
        const { userId } = result.data;

        this.setState({
          loggedIn: true,
          username,
          userId,
          signupIsOpen: false,
          snackbarIsOpen: true,
          snackbarMessage: 'Signup successful; you are now logged in'
        });
        this.props.router.push('/puzzles');
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
        this.setState({
          loggedIn: false,
          username: null,
          userId: null,
          snackbarIsOpen: true,
          snackbarMessage: 'You have logged out'
        });
        this.props.router.push('/');
      })
      .catch((err) => {
        this.setState({ snackbarIsOpen: true, snackbarMessage: err.message });
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
          onHandleCancel={this.handleLoginCancel}
          onHandleOk={this.handleLoginOk}
          open={this.state.loginIsOpen}
        />
        <Signup
          onHandleCancel={this.handleSignupCancel}
          onHandleOk={this.handleSignupOk}
          open={this.state.signupIsOpen}
        />
        <Snackbar
          autoHideDuration={3000}
          message={this.state.snackbarMessage}
          onRequestClose={this.handleSnackbarRequestClose}
          open={this.state.snackbarIsOpen}
        />
      </div>
    );
  }
});

export default withRouter(Nav);
