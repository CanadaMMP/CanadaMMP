// import {bindAllMethods} from './util';
import reduxify from '../utilities/reduxify';
import * as actions from '../actions/index';
import React, {Component} from 'react';
import _ from 'lodash';
import {sendToDatabase} from '../utilities/database'

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
    this.helloDatabase = this.helloDatabase.bind(this);
  }

  handleUsername (event) {
    this.setState({username: event.target.value})
  }
  handlePassword (event) {
    this.setState({password: event.target.value});
  }
  helloDatabase () {
    sendToDatabase('hello world', this.state.username, this.state.password)
      .then((result) => {
        this.setState({status: result})
      }, (err) => {
        this.setState({status: err})
      })
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
        <button onClick={this.helloDatabase}>write to database</button>
        {this.state.status}
      </div>
    );
  }
}

export default reduxify(actions, [], Login)
