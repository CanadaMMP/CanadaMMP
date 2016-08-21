// import {bindAllMethods} from './util';
//
import React, {Component} from 'react';

export default class Ballot extends Component {
  constructor(loginName){
    this.id = loginName;
    this.percentValue = 1;
    this.originalVote = [];
    this.locked = false;
    this.state = {
      votePreferences: [],
    }
  }

  getVote () {
    return this.state.votePreferences;
  }

  setChoice (candidate, position) {
    let voteChange = this.state.votePreferences;
    if(!position && position !== 0){
      this.setState({votePreferences})
      let voteChange = this.state.votePreferences.concat(candidate);
      this.setState({votePreferences: voteChange});
    } else {
      voteChange[position] = candidate;
      this.setState({votePreferences: voteChange});
    }
  }

  setChoices (choices) {
    choices.forEach((choice) => {
      this.setChoice(choice.candidate, choice.position);
    })
  }

  clearChoices () {
    this.vote = [];
  }

  removeCandidate (candidate) {
    this.vote = this.vote.filter((choice) => (choice !== candidate))
  }

  setWinningCandidate (candidate, percentValue) {
    if(candidate === this.vote[0]){
      this.percentValue *= percentValue;
    }
    this.removeCandidate(candidate);
  }
}
