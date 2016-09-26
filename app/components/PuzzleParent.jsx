import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Pause from 'components/Pause';
import Puzzle from 'components/Puzzle';
import PuzzleBar from 'components/PuzzleBar';
import React from 'react';
import Snackbar from 'material-ui/Snackbar';
import axios from 'axios';
import cookie from 'react-cookie';
import { Link, withRouter } from 'react-router';

const PuzzleParent = React.createClass({
  getInitialState() {
    return {
      drawerIsOpen: false,
      elapsedTime: 0,
      playing: true,
      paused: false,
      quoteText: '',
      quoteAuthor: '',
      snackbarIsOpen: false,
      snackbarMessage: 'blah blah'
    };
  },
  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState({ elapsedTime: this.state.elapsedTime + 1 });
    }, 1000);
    this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave);
  },
  routerWillLeave(nextLocation) {
    // return false to prevent a transition w/o prompting the user,
    // or return a string to allow the user to decide:
    if (this.state.playing) {
      return 'Puzzle is still unsolved! Are you sure you want to leave?';
    }
  },
  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },
  handleReturnTouchTap() {
    this.setState({ drawerIsOpen: false });
    this.props.router.push('/puzzles');
  },
  handlePauseTouchTap() {
    this.stopTimer();
    this.setState({
      paused: true,
      quoteText: '',
      quoteAuthor: '',
      drawerIsOpen: false
    });
    axios.get('http://cors-anywhere.herokuapp.com/http://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en')
    .then((result) => {
      this.setState({
        quoteText: result.data.quoteText,
        quoteAuthor: result.data.quoteAuthor
      });
    })
    .catch((err) => {
      this.setState({ snackbarIsOpen: true, snackbarMessage: err.message });
    });
  },
  handleResumeTouchTap() {
    this.setState({ paused: false });
    this.componentDidMount(); // restart timer
  },
  gameOver() {
    this.setState({ playing: false });
    this.stopTimer();
    if (cookie.load('NQJ_loggedIn')) {
      // eslint-disable-next-line prefer-template
      const apiUrl = '/api/puzzles_users/' +
        this.props.params.puzzleId + '/' +
        cookie.load('NQJ_userId');

      axios.post(apiUrl, { puzzleSolvingTime: this.state.elapsedTime })
      .then(() => {
        this.setState({
          snackbarIsOpen: true,
          snackbarMessage: 'Solved! Your time has been recorded.'
        });
      })
      .catch((err) => {
        this.setState({ snackbarIsOpen: true, snackbarMessage: err.message });
      });
    }
    else {
      this.setState({
        snackbarIsOpen: true,
        snackbarMessage: 'You have solved the puzzle!'
      });
    }
  },
  handleSnackbarRequestClose() {
    this.setState({ snackbarIsOpen: false });
  },
  handleLeftIconButtonTouchTap(event) {
    this.setState({ drawerIsOpen: !this.state.drawerIsOpen });
  },
  render() {
    return (
      <div>
        <PuzzleBar
          elapsedTime={this.state.elapsedTime}
          onLeftIconButtonTouchTap={this.handleLeftIconButtonTouchTap}
          onPauseTouchTap={this.handlePauseTouchTap}
          playing={this.state.playing}
        />
        <Puzzle
          gameOver={this.gameOver}
          paused={this.state.paused}
          puzzleId={this.props.params.puzzleId}
        />
        <Drawer
          docked={false}
          width={200}
          open={this.state.drawerIsOpen}
          onRequestChange={(drawerIsOpen) => this.setState({drawerIsOpen})}
        >
          <MenuItem onTouchTap={this.handlePauseTouchTap}>Pause</MenuItem>
          <MenuItem onTouchTap={this.handleReturnTouchTap}>Return to Puzzles</MenuItem>
        </Drawer>
        <Pause
          onResumeTouchTap={this.handleResumeTouchTap}
          paused={this.state.paused}
          quoteAuthor={this.state.quoteAuthor}
          quoteText={this.state.quoteText}
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

export default withRouter(PuzzleParent);
