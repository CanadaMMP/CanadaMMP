// import {bindAllMethods} from './util';
import reduxify from '../utilities/reduxify';
import * as actions from '../actions/index';
import React, {Component} from 'react';
import _ from 'lodash';

class Login extends Component {
  constructor(props){
    super(props);
    this.state = {
      username: '',
      password: '',
      status: '',
    }
    this.handleUsername = this.handleUsername.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
  }

  handleUsername (event) {
    this.setState({username: event.target.value})
  }
  handlePassword (event) {
    this.setState({password: event.target.value});
  }

  render() {
    return (<div>
      <h1>Hello, Login.</h1>
      <div>Username
      <input type="text" value={this.state.username}
        onChange={this.handleUsername} name="username"/></div>
      <input type="password" value={this.state.password}
        onChange={this.handlePassword} name="password"/><br/>
        <div>username: {this.state.username}</div>
        <div>password: {this.state.password}</div>
        {this.state.status}
      </div>
    );
  }
}

export default reduxify(actions, [], Login)
