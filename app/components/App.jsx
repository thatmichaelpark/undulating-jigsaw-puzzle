import { IndexRoute, Route, Router, browserHistory } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import PuzzleParent from 'components/PuzzleParent';
import Puzzles from 'components/Puzzles';
import React from 'react';
import Welcome from 'components/Welcome';

import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

const App = React.createClass({
  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
        <Router history={browserHistory}>
          <Route path="/" >
            <IndexRoute component={Welcome} />
            <Route component={Puzzles} path="puzzles" />
            <Route component={PuzzleParent} path="puzzle/:puzzleId" />
          </Route>
        </Router>
      </MuiThemeProvider>
    );
  }
});

export default App;
// import RaisedButton from 'material-ui/RaisedButton';
// import React from 'react';
//
// const App = React.createClass({
//   render() {
//     return <RaisedButton label="Hello world" />;
//   }
// });
//
// export default App;
