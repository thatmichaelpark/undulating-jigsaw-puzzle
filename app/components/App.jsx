import { IndexRoute, Route, Router, browserHistory } from 'react-router';
import Home from 'components/Home';
import Login from 'components/Login';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Nav from 'components/Nav';
import Puzzle from 'components/Puzzle';
import Puzzles from 'components/Puzzles';
import React from 'react';
import Signup from 'components/Signup';
import Welcome from 'components/Welcome';

import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

const App = React.createClass({
  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
        <Router history={browserHistory}>
          <Route component={Nav} path="/" >
            <IndexRoute component={Welcome} />
            <Route component={Login} path="login" />
            <Route component={Signup} path="signup" />
            <Route component={Puzzles} path="puzzles" />
            <Route component={Puzzle} path="puzzle" />
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
