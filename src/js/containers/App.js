import React, { Component } from 'react';
import * as actions from '../actions';
import reduxify from '../utilities/reduxify'

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
      <h1>Hello, world.</h1>
      <h2>Component Counter:
        <b>{this.state.componentCounter}</b>
      </h2>
      <button onClick={this.incrementComponentCounter} >Increment Component Counter</button>
      <h2>Redux Store Counter:
        <b>{this.props.counter}</b>
      </h2>
      <button onClick={this.props.actions.incrementCounter}>Increment Redux Store Counter</button>
      </div>
    );
  }
}

export default reduxify(actions, ['counter'], App)
