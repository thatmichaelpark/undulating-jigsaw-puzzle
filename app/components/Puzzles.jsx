import React from 'react';
import { Link } from 'react-router';
import { Tabs, Tab } from 'material-ui/Tabs';
import Slider from 'material-ui/Slider';

const styles = {
  tabs: {
    margin: '0 auto',
    width: '80%',
  },
};

const Puzzles = React.createClass({
  render() {
    const puzzleData4x4 = [
      { id: 1, image: 'images/cat800.jpeg' }
    ];
    return (
      <Tabs style={styles.tabs}>
        <Tab label="4 x 4" >
          <div>
            <p>
              This is an example tab.
            </p>
            {puzzleData4x4.map((puzzle, index) => {
              return <p key={index}><Link to={`/puzzle/${puzzle.id}`}>{puzzle.image}</Link></p>;
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
