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
    axios.get('/api/puzzles/full')
      .then((result) => {
        this.setState({ puzzles: result.data });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  render() {
    const makeCards = (difficulty) =>
      this.state.puzzles.filter((puzzle) => puzzle.difficulty === difficulty).map((puzzle, index) => {
        return (
          <Link key={index} to={`/puzzle/${puzzle.id}`}>
            <Card
              style={{width: '30rem', margin: '1rem'}}
              zDepth={4}
            >
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
              {
                puzzle.times ?
                  <CardText>
                    blah blah blah
                  </CardText> :
                  null
              }
            </Card>
          </Link>
        );
      }
    );

    return (
      <Tabs style={styles.tabs}>
        <Tab label='Easy' >
          <div className='tab-contents'>
            {makeCards(1)}
          </div>
        </Tab>
        <Tab label='Moderate' >
          <div className='tab-contents'>
            {makeCards(2)}
          </div>
        </Tab>
        <Tab label='Difficult'>
          <div className='tab-contents'>
            {makeCards(3)}
          </div>
        </Tab>
        <Tab label='OMG WTF'>
          <div className='tab-contents'>
            {makeCards(4)}
          </div>
        </Tab>
      </Tabs>
    );
  }
});

export default Puzzles;
