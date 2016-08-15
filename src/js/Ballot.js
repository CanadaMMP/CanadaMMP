import {bindAllMethods} from './util';


export default class Ballot {
  constructor(loginName){
    this.id = loginName;
    this.percentValue = 1;
    this.vote = [];
    this.originalVote = [];
    this.locked = false;
    bindAllMethods(this);
  }

  getVote () {
    return this.vote;
  }

  setChoice (candidate, position) {
    if(!position && position !== 0){
      this.vote.push(candidate);
    } else {
      this.vote[position] = candidate;
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
