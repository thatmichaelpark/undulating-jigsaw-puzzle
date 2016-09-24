import { Card, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import Nav from 'components/Nav';
import React from 'react';
import { Link } from 'react-router';
// import { Tabs, Tab } from 'material-ui/Tabs';
import { Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';
import Slider from 'material-ui/Slider';
import axios from 'axios';

const styles = {
  cards: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center'
  }
};

const Puzzles = React.createClass({
  getInitialState() {
    return {
      puzzles: []
    };
  },
  componentDidMount() {
    axios.get('/api/puzzles/full')
      .then((result) => {
        this.setState({ puzzles: result.data });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  render() {
    const parseTimes = (times) => {
      const result = [];
      const re = /(\d+),(\w+)/g;
      let x;
      while (x = re.exec(times)) {
        result.push({
          time: Number.parseInt(x[1]),
          username: x[2]
        });
      }
      return result;
    }
    const formatTime = (timeInSeconds) => {
      const hours = Math.floor(timeInSeconds / 3600);
      const minutes = Math.floor((timeInSeconds % 3600) / 60);
      const seconds = timeInSeconds % 60;
      const twoDigits = (a) => (a <= 9 ? '0' : '') + a;
      return `${hours}:${twoDigits(minutes)}:${twoDigits(seconds)}`
    }
    const makeCards = () =>
      this.state.puzzles.map((puzzle, index) => {
        return (
          <Card
            key={index}
            style={{width: '22rem', margin: '1rem'}}
            zDepth={4}
          >
            <Link to={`/puzzle/${puzzle.id}`}>
              <CardMedia
                overlay={
                  <CardTitle
                    title={`${puzzle.nRows} x ${puzzle.nCols}`}
                    subtitle={puzzle.hasRotatedPieces ? "With rotations" : null}
                  />
                }
              >
                <img src={puzzle.imageUrl} />
              </CardMedia>
            </Link>
            {
              puzzle.times ?
                <CardText>
                  <Table>
                    <TableBody displayRowCheckbox={false}>
                      {parseTimes(puzzle.times).slice(0, 3).map((time, index) => {
                        return (
                          <TableRow key={index}>
                            <TableRowColumn>
                              {index + 1}
                            </TableRowColumn>
                            <TableRowColumn>
                              {formatTime(time.time)}
                            </TableRowColumn>
                            <TableRowColumn>
                              {time.username}
                            </TableRowColumn>

                          </TableRow>

                        );
                      })}
                    </TableBody>
                  </Table>
                </CardText> :
                null
            }
          </Card>
        );
      }
    );

    return (
      <div>
        <Nav />
        <div style={styles.cards}>
          {makeCards()}
        </div>
      </div>
    );
  }
});

export default Puzzles;
