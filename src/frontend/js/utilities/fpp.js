import _ from 'lodash';
import candidateNameGenerator from './candidateName';
import provinces from '../../../utils/provinces';
const PARTIES_IN_PARLIAMENT = [
  "Liberal",
  "NDP-New Democratic Party",
  "Conservative",
  "Green Party",
  "Bloc Québécois",
];

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

/**
 * ridingVoteWastage calculates the amount of wasted votes in a particular riding
 * @param  {object} riding - the entry (as stored in the DB) for the riding;
 * @return {object}        = data on wasted votes;
 */
export const ridingVoteWastage = (riding) => {
  let results = ridingResultsInOrder(riding);
  let winnerWaste = results[0].votes - results[1].votes;
  let winnerWastePc = winnerWaste/results[0].votes;
  let totalVotes = results.reduce((pv, res) => pv + res.votes, 0);
  let totalWaste = totalVotes - (results[1].votes + 1);
  let totalWastePc = totalWaste/totalVotes;
  return {
    winner: results[0],
    losers: results.slice(1),
    winnerWaste,
    winnerWastePc,
    totalVotes,
    totalWaste,
    totalWastePc
  };
};

export const ridingVoteWastageByParty = (riding) => {
  let results = ridingResultsInOrder(riding);
  let notWasted = {};
  let wasted = {};
  notWasted[results[0].party] = results[1].votes + 1;
  wasted[results[0].party] = (results[0].votes - results[1].votes) - 1 ;
  results.slice(1).forEach((result) => {
    if(!wasted[result.party]){
      wasted[result.party] = 0;
    }
    wasted[result.party] += result.votes;
  });
  return { notWasted, wasted };
};


export const nationalWastedAndNonWastedVotes = (documents) => {
  let wasteCount = documents.map((riding) => ridingVoteWastageByParty(riding));
  let totalWasteCount = wasteCount.reduce((pv, riding) => {
    for(let party in riding.wasted){
      pv.wasted[party] = pv.wasted[party] ? pv.wasted[party] + riding.wasted[party] : riding.wasted[party];
    }
    for(let party in riding.notWasted){
      pv.notWasted[party] = pv.notWasted[party] ? pv.notWasted[party] + riding.notWasted[party] : riding.notWasted[party];
    }
    return pv;
  }, {wasted:{}, notWasted:{}});

  totalWasteCount.wasted = _.reduce(totalWasteCount.wasted, (pv, votes, party) => {
    if (PARTIES_IN_PARLIAMENT.includes(party)){
      pv[party] = votes;
    } else {
      pv.Others += votes;
    }
    return pv;
  }, {Others: 0});
  console.log(JSON.stringify(totalWasteCount));
  return totalWasteCount;
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

/**
 * totalVotesCast returns the number of total votes cast in the election.
 * because we're already counting each item by party anyway, it's easier to add the results of each.
 * @param  {array} documents - raw documents from the database
 * @return {number}          - the total votes cast in the document.
 */
export const totalVotesCast = (documents) => {
  return _.reduce(popularVoteByParty(documents), (pv, value) => pv + value, 0);
};

/**
 * popularVoteWastage
 * @param  {array} documents - raw documents from the database
 * @return {number}          - the number of wasted votes.
 */
export const popularVoteWastage = (documents) => documents.map((riding) => ridingVoteWastage(riding)).reduce((pv, ridingWastage) => pv + ridingWastage.totalWaste, 0);

/**
 * [popularVoteWastagePc description]
 * @param  {array} documents - raw documents from the database
 * @return {number}          - the ratio of wasted votes to all votes cast;
 */
export const popularVoteWastagePc = (documents) => popularVoteWastage(documents)/totalVotesCast(documents);

/**
 * findWinner() simply returns the first result from a sorting.
 * @param  {object} riding - the riding results (as grabbed from the DB; )
 * @return {object}        - the winner of each election (including party, name, and votes);
 */
export const findWinner = (riding) => ridingResultsInOrder(riding)[0];

/**
 * [voteWastageByParty description]
 * @param  {object} riding - the riding results (as grabbed from the DB; )
 * @return {object}        - a listing of how many votes were wasted from each political party.
 */
export const voteWastageByParty = (documents) => {
  let popularVote = popularVoteByParty(documents);
  let rawWastage = documents.map((riding) => ridingVoteWastage(riding)).reduce((pv, riding) => {
    if(!_.includes(Object.keys(popularVote), riding.winner.party)){
      riding.winner.party = "Independents";
    }
    if(!pv[riding.winner.party]){
      pv[riding.winner.party] = 0;
    }
    pv[riding.winner.party] += riding.winner.votes - riding.losers[0].votes;
    riding.losers.forEach((loser) => {
      if(!_.includes(Object.keys(popularVote), loser.party)){
        loser.party = "Independents";
      }
      if(!pv[loser.party]){
        pv[loser.party] = 0;
      }
      pv[loser.party] += loser.votes;
    });
    return pv;
  }, {});
  return _.reduce(rawWastage, (pv, votes, party) => {
    let p = {};
    p[party] = {
      waste: votes,
      wastePc: votes/popularVote[party],
    };
    return Object.assign(pv, p);
  }, {totalPopularVote: popularVote});
};


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

export const filterDataByProvince = (documents, province) => {
  let range = {
    min: provinces[province] * 1000,
    max: (provinces[province] + 1) * 1000,
  };
  return documents.filter((doc) => {
    return doc.districtNumber >= range.min && doc.districtNumber < range.max;
  });
};

/**
 * provinceData is just a formatting function for province data.
 * @param  {array}  documents - documents directly fromt he database;
 * @return {object}           - an object
 */
export const provinceData = (documents) => ({
  seatsByParty: seatsByParty(documents),
  proportionOfSeatsByParty: proportionOfSeatsByParty(documents),
  provincePopularVoteByParty: popularVoteByParty(documents),
  proportionOfProvincePopularVoteByParty: proportionOfPopularVoteByParty(documents),
  totalVotesCast: totalVotesCast(documents) ,
  provincePopularVoteWastage: popularVoteWastage(documents),
  provincePopularVoteWastagePc: popularVoteWastagePc(documents)
});

/**
 * fppData is a catchall which returns all the relevant data for the documentt.
 * In an API situation, a single call to FPP data would result in the entire relevant report
 * being sent back to the requesting page.
 * @param  {array}  documents - documents directly fromt he database;
 * @return {object}
 */
export const fppData = (documents) => {
  let output = {
    seatsByParty: seatsByParty(documents),
    proportionOfSeatsByParty: proportionOfSeatsByParty(documents),
    nationalPopularVoteByParty: popularVoteByParty(documents),
    proportionOfNationalPopularVoteByParty: proportionOfPopularVoteByParty(documents),
    totalVotesCast: totalVotesCast(documents) ,
    nationalPopularVoteWastage: popularVoteWastage(documents),
    nationalPopularVoteWastagePc: popularVoteWastagePc(documents),
    byProvince: {},
  };
  for(let province in provinces){
    output.byProvince[province] = provinceData(filterDataByProvince(documents, province));
  }
  return output;



};
