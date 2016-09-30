import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';

const Pause = React.createClass({
  render() {
    return (
      <Dialog
        modal={false}
        open={this.props.paused}
        onRequestClose={this.props.onResumeTouchTap}
      >
        <div style={{fontSize: 36, fontFamily: "Courgette"}}>
          <p style={{textAlign: 'center'}}>
            {this.props.quoteText}
          </p>
          <p style={{textAlign: 'center'}}>
            {this.props.quoteAuthor}
          </p>
        </div>
      </Dialog>
    );
  }
});

export default Pause;
