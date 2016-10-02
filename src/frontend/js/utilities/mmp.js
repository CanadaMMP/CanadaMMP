import _ from 'lodash';
import candidateNameGenerator from './candidateName';
/**
 * findWinner() takes a single document (as stored in the database)
 * and calculates who won that election, even if the winner is an
 * independent candidate.
 * @param      {object} districtResults - The record for the election in the database;
 * @return     {object}                 - An object containing the victorious party, candidate, and how many votes they got.
 *   @property {string} party           - The name of the victorious party (or Independent)
 *   @property {string} candidate       - A parsed full name (such as TRUDEAU, Justin) of the winning candidate
 *   @property {Number} votes           - the number of votes the winning candidate got
 */
export const findWinner = (districtResults) => {
  let parties = _.omit(districtResults, ["districtNumber", "districtNameEnglish", "districtNameFrench", "Independents", "_id"]);
  let base = {votes:0};
  if(districtResults.Independents){
    base = Object.keys(districtResults.Independents).reduce((pv, candidate) => {
      let candidateRecord = districtResults.Independents[candidate];
      let candidateName = candidateNameGenerator(candidateRecord);
      return (candidateRecord.votes > pv.votes) ? ({party: "Independent", candidate: candidateName, votes: 0}) : pv;
    }, {party: "Independent", candidate: null, votes: 0});
  }
  return Object.keys(parties).reduce((pv, party) => {
    let partyRecord = parties[party];
    let partyCandidateName = candidateNameGenerator(partyRecord);
    return (partyRecord.votes > pv.votes) ? ({party: party, candidate: partyCandidateName, votes: partyRecord.votes}) : pv;
  }, base);
};

/**
 * popularVoteByParty() reduces the total results from the election and tallies up
 * the popular vote results.
 * @param  {array} documents - all the election results, retrieved from the database.
 *   @element {object}       - a single district's election results.
 * @return {object}          - an object - keys are parties, and the value is the number of votes
 * */
export const popularVoteByParty = (documents) => documents.reduce((pv, doc) => {
  doc = _.omit(doc, ["districtNumber", "districtNameEnglish", "districtNameFrench", "_id"]);
  for(let key in doc){
    if(key === "Independents"){
      for(let name in doc[key]){
        pv["Independents"] += doc[key][name].votes;
      }
      continue;
    }
    if(!pv[key]){
      pv[key] = 0;
    }
    pv[key] += doc[key].votes;
  }
  return pv;
}, {Independents: 0});

/**
 * seatsByParty returns the seats by party of a FPP election;
 * @param  {array}  documents - documents directly fromt he database;
 * @return {object}           - an array containing each party's number of seats;
 */
export const seatsByParty = (documents) => documents.map((doc) => findWinner(doc)).reduce((pv, winner) => {
  if (!pv[winner.party]){
    pv[winner.party] = 0;
  }
  pv[winner.party] += 1;
  return pv;
}, {});
