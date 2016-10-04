import _ from 'lodash';
import candidateNameGenerator from './candidateName';

/**
 * ridingResultsInOrder takes a record from the database and calculates
 * the results, in decending (winner-first) order
 * @param  {object} riding - data for the riding;
 * @return {array}         - an array of the candidates, in decending (winner-first) order by votes.
 */

export const ridingResultsInOrder = (riding) => {
  let results = Object.assign(_.omit(riding, ['_id', 'districtNumber', 'districtNameEnglish', 'districtNameFrench', 'Independents']), riding.Independents);
  // all keys should be a candidate.
  let resultsArray = _.reduce(results, (pv, value, party) => {
    let listing = Object.assign({}, {party}, value);
    return pv.concat(listing);
  }, []);
  let output = resultsArray.sort((a, b) => (a.votes < b.votes) ? 1 : (a.votes === b.votes) ? 0 : -1);
  return output;
};

export const ridingVoteWastage = (riding) => {
  let results = ridingResultsInOrder(riding);
  let winnerWaste = results[0].votes - results[1].votes;
  let winnerWastePc = winnerWaste/results[0].votes;
  let totalVotes = results.reduce((pv, res) => pv + res.votes, 0);
  let totalWaste = totalVotes - (results[1].votes + 1);
  let totalWastePc = totalWaste/totalVotes;
  return {
    winner: results[0],
    winnerWaste,
    winnerWastePc,
    totalVotes,
    totalWaste,
    totalWastePc
  };
};

/**
* nationalPopularVoteByParty() reduces the total results from the election and tallies up
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


export const totalVotesCast = (documents) => {
  return _.reduce(popularVoteByParty(documents), (pv, value) => pv + value, 0);
};

export const popularVoteWastage = (documents) => documents.map((riding) => ridingVoteWastage(riding)).reduce((pv, ridingWastage) => pv + ridingWastage.totalWaste, 0);

export const popularVoteWastagePc = (documents) => popularVoteWastage(documents)/totalVotesCast(documents);

/**
 * findWinner() simply returns the first result from a sorting.
 * @param  {object} riding - the riding results (as grabbed from the DB; )
 * @return {object}        - the winner of each election (including party, name, and votes);
 */
export const findWinner = (riding) => ridingResultsInOrder(riding)[0];


/**
 * seatsByParty returns the seats by party of a FPP election;
 * @param  {array}  documents - documents directly fromt he database;
 * @return {object}           - an array containing each party's number of seats;
 */
export const seatsByParty = (documents) => documents.map((riding) => findWinner(riding)).reduce((pv, winner) => {
  if(!pv[winner.party]){
    pv[winner.party] = 0;
  }
  pv[winner.party] += 1;
  return pv;
}, {});

/**
 * proportionOfSeatsByParty calculates the proportion of each party's representation.
 * @param  {array}  documents - documents directly fromt he database;
 * @return {object}           - the proportion of seats by party
 */
export const proportionOfSeatsByParty = (documents) => {
  let seats = seatsByParty(documents);
  let totalSeats = _.reduce(seats, (pv, value) => {
    return pv + value;
  }, 0);
  let output = {};
  for(let key in seats){
    output[key] = seats[key]/totalSeats;
  }
  return output;
};
/**
 * proportionOfNationalPopularVoteByParty calculates the proportion of each party's share of the popular vote;
 * @param  {array}  documents - documents directly fromt he database;
 * @return {object}           - the proportion of seats by party
 */
export const proportionOfPopularVoteByParty = (documents) => {
  let votes = popularVoteByParty(documents);
  let totalPopularVote = _.reduce(votes, (pv, value) => {
    return pv + value;
  }, 0);
  let output = {};
  for(let key in votes){
    output[key] = votes[key]/totalPopularVote;
  }
  return output;
};
/**
 * fppData takes all of the above and runs the parameters on the same set of documents.
 * @param  {array}  documents - documents directly fromt he database;
 * @return {object}           - the proportion of seats by party
 *   @property {object} seatsByParty - the number of seats by party;
 *   @property {object} proportionOfSeatsByParty - the proportion of seats by party;
 *   @property {object} nationalPopularVoteByParty - the popular vote by party
 *   @property {object} proportionOfNationalPopularVoteByParty - the proportion of popular vote by party.
 */
export const fppData = (documents) => ({
  seatsByParty: seatsByParty(documents),
  proportionOfSeatsByParty: proportionOfSeatsByParty(documents),
  nationalPopularVoteByParty: popularVoteByParty(documents),
  proportionOfNationalPopularVoteByParty: proportionOfPopularVoteByParty(documents),
});
