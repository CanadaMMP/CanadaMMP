import React, { Component } from 'react';
import * as actions from '../actions/index';
import reduxify from '../utilities/reduxify'

import Ballot from './Ballot';
import Login from './Login';

class App extends Component {
  constructor(props){
    super(props);
    this.incrementComponentCounter = this.incrementComponentCounter.bind(this);
    this.state = {
      componentCounter: 0,
    }
  }
  incrementComponentCounter (){
    this.setState({componentCounter: this.state.componentCounter + 1})
  }
  render() {
    return (<div>
      <Ballot />
      <Login />
      </div>
    );
  }
}

export default reduxify(actions, ['counter'], App);
