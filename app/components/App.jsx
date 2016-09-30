import { IndexRoute, Route, Router, browserHistory } from 'react-router';
import PuzzleParent from 'components/PuzzleParent';
import Puzzles from 'components/Puzzles';
import React from 'react';
import Welcome from 'components/Welcome';

const App = React.createClass({
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" >
          <IndexRoute component={Welcome} />
          <Route component={Puzzles} path="puzzles" />
          <Route component={PuzzleParent} path="puzzle/:puzzleId" />
        </Route>
      </Router>
    );
  }
});

export default App;
