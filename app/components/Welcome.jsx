import Nav from 'components/Nav';
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';
import { withRouter } from 'react-router';
import { Card, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import Paper from 'material-ui/Paper';

const Welcome = React.createClass({
  handleStartTouchTap() {
    this.props.router.push('/puzzles');
  },
  render() {
    const styles = {
      card: {
        width: '18rem'
      },
      div: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around'
      },
      paper: {
        width: '70%',
        margin: '2rem auto'
      }
    };
    return (
      <div>
        <Nav />
        <Paper style={styles.paper} zDepth={0}>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        <div style={styles.div}>
          <Card style={styles.card} zDepth={0}>
            <CardText>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </CardText>
          </Card>
          <Card style={styles.card} zDepth={0}>
            <CardText>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </CardText>
          </Card>
          <Card style={styles.card} zDepth={0}>
            <CardText>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </CardText>
          </Card>
        </div>
        <div className="welcome-button">
        <RaisedButton label="Start" onTouchTap={this.handleStartTouchTap} primary={true}/>
        </div>
        </Paper>
      </div>
    );
  }
});

export default withRouter(Welcome);
