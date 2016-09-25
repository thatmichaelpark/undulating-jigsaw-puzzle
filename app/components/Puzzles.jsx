import { Card, CardMedia, CardText, CardTitle } from 'material-ui/Card';
import { Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';
import { Link } from 'react-router';
import Nav from 'components/Nav';
import React from 'react';
import axios from 'axios';
import { formatTime } from 'components/utils';

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
        console.log(err); // eslint-disable-line no-console
      });
  },
  render() {
    const parseTimes = (times) => {
      const result = [];
      const re = /(\d+),[\\"]*([\w\s]+)[\\"]*/g;
      let x;

      while ((x = re.exec(times)) !== null) {
        result.push({
          time: Number.parseInt(x[1]),
          username: x[2]
        });
      }

      return result;
    };
    const makeCards = () =>
      this.state.puzzles.map((puzzle, index) => {
        return (
          <Card
            key={index}
            style={{ width: '22rem', margin: '1rem' }}
            zDepth={4}
          >
            <Link to={`/puzzle/${puzzle.id}`}>
              <CardMedia
                overlay={
                  <CardTitle
                    subtitle={puzzle.hasRotatedPieces ? 'With rotations' : null}
                    title={`${puzzle.nRows} × ${puzzle.nCols}`}
                  />
                }
              >
                <img src={puzzle.imageUrl} />
              </CardMedia>
            </Link>
            {
              puzzle.times
                ? <CardText>
                  <Table>
                    <TableBody displayRowCheckbox={false}>
                      {parseTimes(puzzle.times).slice(0, 3).map((time, idx) => {
                        return (
                          <TableRow key={idx}>
                            <TableRowColumn>
                              {idx + 1}
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
                </CardText>
              : null
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
