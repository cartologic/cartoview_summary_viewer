import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

/**
 * Dialog with action buttons. The actions are passed in as an array of React objects,
 * in this example [FlatButtons](/#/components/flat-button).
 *
 * You can also close this dialog by clicking outside the dialog, or with the 'Esc' key.
 */
export default class DialogExampleSimple extends React.Component {
  state = {
    open: this.props.open,
  };

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    // this.setState({open: false});
    window.location.replace(appInstanceUrl) // appInstanceUrl defined view.html
  };

  render() {
    const actions = [
      <FlatButton
        label="Back To Apps"
        primary={true}
        onTouchTap={this.handleClose}
      />,
    ];

    return (
      <div>
        <Dialog
          title="Permission Error !"
          titleStyle={{color: '#CC0000'}}
          actions={actions}
          modal={false}
          open={this.state.open}
        >
          This map is private
        </Dialog>
      </div>
    );
  }
}