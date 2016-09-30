import Dialog from 'material-ui/Dialog';
import React from 'react';

const Pause = React.createClass({
  render() {
    return (
      <Dialog
        modal={false}
        onRequestClose={this.props.onResumeTouchTap}
        open={this.props.paused}
      >
        <div style={{ fontSize: 24, fontFamily: 'Courgette' }}>
          <p style={{ textAlign: 'center' }}>
            {this.props.quoteText}
          </p>
          <p style={{ textAlign: 'center' }}>
            {this.props.quoteAuthor}
          </p>
        </div>
      </Dialog>
    );
  }
});

export default Pause;
