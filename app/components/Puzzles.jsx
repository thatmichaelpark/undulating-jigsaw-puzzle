import React from 'react';
import { Link } from 'react-router';
import { Tabs, Tab } from 'material-ui/Tabs';
import Slider from 'material-ui/Slider';
import axios from 'axios';

const styles = {
  tabs: {
    margin: '0 auto',
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
        console.log(result);
        this.setState({ puzzles: result.data });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  render() {
    return (
      <Tabs style={styles.tabs}>
        <Tab label="Easy" >
          <div>
            <p>
              This is an example tab.
            </p>
            {this.state.puzzles.filter((puzzle) => puzzle.difficulty === 1).map((puzzle, index) => {
              return <p key={index}><Link to={`/puzzle/${puzzle.id}`}>{puzzle.imageUrl}</Link></p>;
            })}
          </div>
        </Tab>
        <Tab label="5 x 5" >
          <div>
            <p>
              This is another example tab.
            </p>
          </div>
        </Tab>
        <Tab label="6 x 6">
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
