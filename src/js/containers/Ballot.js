// import {bindAllMethods} from './util';
import reduxify from '../utilities/reduxify';
import * as actions from '../actions/index';
import React, {Component} from 'react';
import {allCandidates} from '../../data/2016Election'
import _ from 'lodash';

const candidatesByParty = (election) => {
  let ballotOrder = []
  for(let party in election){
    ballotOrder.push({
      party: party,
      candidates: election[party]
    })
  }
  return ballotOrder;
}

class Ballot extends Component {
  constructor(props){
    super(props);
    this.state = {
      candidateName: '',
      position: 0,
    }
    this.handleCandidateNameChange = this.handleCandidateNameChange.bind(this);
    this.handlePositionChange = this.handlePositionChange.bind(this);
    this.registerPreference = this.registerPreference.bind(this);
    this.handleDirectClick = this.handleDirectClick.bind(this);
    this.handleDirectRemoval = this.handleDirectRemoval.bind(this);
  }

  handleCandidateNameChange (event) {
    this.setState({candidateName: event.target.value});
  }
  handlePositionChange(event) {
    this.setState({position: event.target.value});
  }
  registerPreference(){
    this.props.actions.addVotePreference(this.state.candidateName, this.state.position);
  }
  handleDirectClick(name){
    this.props.actions.addVotePreference(name);
  }
  handleDirectRemoval(name){
    this.props.actions.removeCandidate(name);
  }
  render() {


    return (<div>
      <h1>Hello, Ballot.</h1>
      <h2>Preferences:
        <ol>{this.props.votePreferences.map((pref, i) => (<li onClick={() => this.handleDirectRemoval(pref)} key={"votePreferences" + i}>{pref}</li>))}</ol>
      </h2>
      <input type="text" value={this.state.candidateName}
        onChange={this.handleCandidateNameChange} name="preference"/><br/>
      <input type="text" value={this.state.position}
        onChange={this.handlePositionChange} name="position"/><br/>
      <button onClick={this.registerPreference}>Add Candidate</button>
      <div>{candidatesByParty(allCandidates).map((group, g) => (
        <div key={"group" + g}><h4>{group.party}</h4>
          <ol>
            {group.candidates.map((name, n) => (<li onClick={() => this.handleDirectClick(name)} key={"candidate" + group.party + n}>{name}</li>))}
          </ol>
        </div>
      ))}</div>
      </div>
    );
  }
}

export default reduxify(actions, ['votePreferences', 'voteValue'], Ballot)
