import Dialog from 'material-ui/Dialog';
import React from 'react';

const Help = React.createClass({
  render() {
    return (
      <Dialog
        modal={false}
        onRequestClose={this.props.onCloseHelpTouchTap}
        open={this.props.helping}
      >
        <div>
          <ul>
            <li>
              Move pieces by dragging them with your mouse.
            </li>
            <li>
              Rotate pieces 90° clockwise by right-clicking.
            </li>
            <li>
              Rotate pieces 90° counterclockwise by shift-right-clicking.
            </li>
          </ul>
        </div>
      </Dialog>
    );
  }
});

export default Help;
