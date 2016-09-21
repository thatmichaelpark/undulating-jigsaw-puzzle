import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Joi from 'joi';
import React from 'react';
import TextField from 'material-ui/TextField';

const schema = Joi.object({
  username: Joi.string().trim().max(20),
  password: Joi.string().trim().max(50)
});

const Login = React.createClass({
  getInitialState() {
    return {
      errors: {},
      username: '',
      password: ''
    };
  },
  handleBlur(event) {
    const { name, value } = event.target;
    const nextErrors = Object.assign({}, this.state.errors);
    const inputs = { [name]: value };

    const result = Joi.validate(inputs, schema);

    if (result.error) {
      for (const detail of result.error.details) {
        nextErrors[detail.path] = detail.message;
      }
    }
    else {
      delete nextErrors[name];
    }
    this.setState({ errors: nextErrors });
  },
  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  },
  handleOk() {
    const result = Joi.validate(this.state, schema, {
      abortEarly: false,
      allowUnknown: true
    });
    if (result.error) {
      const nextErrors = [];
      for (const detail of result.error.details) {
        nextErrors[detail.path] = detail.message;
      }
      return this.setState({ errors: nextErrors });
    }
    this.props.handleOk(this.state.username, this.state.password);
  },
  render() {
    const loginActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.props.handleCancel}
      />,
      <FlatButton
        label="OK"
        primary={true}
        onTouchTap={this.handleOk}
      />,
    ];

    const { errors, username, password, confirmPassword } = this.state;

    return (
      <Dialog
        title="Log in"
        actions={loginActions}
        modal={true}
        open={this.props.open}
      >
        <TextField
          autoFocus
          errorText={errors.username}
          floatingLabelText="Username"
          fullWidth={true}
          name='username'
          onBlur={this.handleBlur}
          onChange={this.handleChange}
          value={username}
        />
        <TextField
          errorText={errors.password}
          floatingLabelText="Password"
          fullWidth={true}
          name='password'
          onBlur={this.handleBlur}
          onChange={this.handleChange}
          type="password"
          value={password}
        />
      </Dialog>
    );
  }
});

export default Login;
