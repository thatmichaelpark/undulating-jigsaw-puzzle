import { Card, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import React from 'react';
import { Link } from 'react-router';
import { Tabs, Tab } from 'material-ui/Tabs';
import Slider from 'material-ui/Slider';
import axios from 'axios';

const styles = {
  tabs: {
    margin: '20px auto',
    width: '80%',
  },
};

const Puzzles = React.createClass({
  getInitialState() {
    return {
      puzzles: []
    };
  },
  componentDidMount() {
    axios.get('/api/puzzles')
      .then((result) => {
        this.setState({ puzzles: result.data });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  render() {
    return (
      <Tabs style={styles.tabs}>
        <Tab label='Easy' >
          <div className='tab-contents'>
            {this.state.puzzles.filter((puzzle) => puzzle.difficulty === 1).map((puzzle, index) => {
              return (
                <Link key={index} to={`/puzzle/${puzzle.id}`}>
                  <Card style={{width: '30rem', margin: '1rem'}}>
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
                  </Card>
                </Link>
              );
            })}
          </div>
        </Tab>
        <Tab label='Moderate' >
          <div>
            <p>
              This is another example tab.
            </p>
          </div>
        </Tab>
        <Tab label='Difficult'>
          <div>
            <p>
              This is a third example tab.
            </p>
          </div>
        </Tab>
        <Tab label='OMG WTF'>
          <div>
            <p>
              This is a third example tab.
            </p>
          </div>
        </Tab>
      </Tabs>
    );
  }
});

export default Puzzles;
