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
        An experimental variation on traditional jigsaw puzzles. The pieces
        of these puzzles have borders that vary over time. Different puzzles
        vary at different rates.
        <div style={styles.div}>
          <Card style={styles.card} zDepth={0}>
            <CardText>
              Left-click and drag pieces next to other pieces; if the pieces match, they'll click together.
            </CardText>
          </Card>
          <Card style={styles.card} zDepth={0}>
            <CardText>
              Some puzzles require you to rotate pieces. Right-click a piece to rotate it clockwise 90°; to rotate counterclockwise, right-click while holding down the shift key.
            </CardText>
          </Card>
          <Card style={styles.card} zDepth={0}>
            <CardText>
              You don't <em>have</em> to log in, but if you do, your puzzle times will be
              recorded.
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
