import { Card, CardText } from 'material-ui/Card';
import Dimensions from 'react-dimensions';
import Nav from 'components/Nav';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';
import { withRouter } from 'react-router';

const Welcome = React.createClass({
  handleStartTouchTap() {
    this.props.router.push('/puzzles');
  },
  render() {
    const styles = {
      card: {
        width: this.props.containerWidth >= 700 ? (
          `${this.props.containerWidth / 5}px`
        ) : null
      },
      paper: {
        width: this.props.containerWidth >= 600 ? '70%' : null,
        overflow: 'auto',
        margin: '64px 0 0',
        padding: '2rem'
      }
    };

    return (
      <div>
        <Nav />
        <div
          style={{
            backgroundImage: this.props.containerWidth >= 600 ? (
              'url(/images/27_haruhi_jigsaw_03.jpg)'
            ) : null,
            backgroundSize: 'cover',
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0'
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              height: '100%'
            }}
          >
            <Paper style={styles.paper} zDepth={0}>
              <p>
              An experimental variation on traditional jigsaw puzzles.
              The pieces of these puzzles have edges that vary over time.
              Different puzzles' edges vary at different rates.
              </p>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center'
                }}
              >
                <Card style={styles.card} zDepth={0}>
                  <CardText>
                    Left-click and drag pieces; if a piece is placed next
                    to a piece with a matching edge, the pieces will
                    click together.
                  </CardText>
                </Card>
                <Card style={styles.card} zDepth={0}>
                  <CardText>
                    Some puzzles require you to rotate pieces. Right-click
                    a piece to rotate it clockwise 90°; to rotate
                    counterclockwise, right-click while holding down
                    the shift key.
                  </CardText>
                </Card>
                <Card style={styles.card} zDepth={0}>
                  <CardText>
                    You don't <em>have</em> to log in, but if you do,
                    your puzzle times will be recorded.
                  </CardText>
                </Card>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <RaisedButton
                  label="Start"
                  onTouchTap={this.handleStartTouchTap}
                  primary={true}
                />
              </div>
            </Paper>
          </div>
        </div>
      </div>
    );
  }
});

export default Dimensions()(withRouter(Welcome)); // eslint-disable-line new-cap
