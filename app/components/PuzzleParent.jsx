import Pause from 'components/Pause';
import PuzzleBar from 'components/PuzzleBar';
import React from 'react';
import Puzzle from 'components/Puzzle';
import axios from 'axios';

const PuzzleParent = React.createClass({
  getInitialState() {
    return {
      elapsedTime: 0,
      paused: false,
      quoteText: '',
      quoteAuthor: ''
    };
  },
  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState({ elapsedTime: this.state.elapsedTime + 1 });
    }, 1000);
  },
  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  handlePauseTouchTap() {
    this.setState({ paused: true });
    if (this.timer) {
      clearInterval(this.timer);
    }
    axios.get('http://cors-anywhere.herokuapp.com/http://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en')
    .then((result) => {
      this.setState({
        quoteText: result.data.quoteText,
        quoteAuthor: result.data.quoteAuthor ? result.data.quoteAuthor : 'Unknown'
      })
    })
    .catch((err) => {
      console.log(err);
    });
  },
  handleResumeTouchTap() {
    this.setState({ paused: false });
    this.componentDidMount(); // restart timer
  },
  render() {
    return (
      <div>
        <PuzzleBar
          elapsedTime={this.state.elapsedTime}
          handlePauseTouchTap={this.handlePauseTouchTap}
        />
        <Puzzle
          puzzleId={this.props.params.puzzleId}
        />
        <Pause
          quoteText={this.state.quoteText}
          quoteAuthor={this.state.quoteAuthor}
          paused={this.state.paused}
          handleResumeTouchTap={this.handleResumeTouchTap}
        />
      </div>
    );
  }
});

export default PuzzleParent;
