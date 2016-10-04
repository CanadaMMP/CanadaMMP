import _ from 'lodash';

export const proportionallyRemoveVotes = (parties, voteChange) => {
  let totalVotes = _.reduce(parties, (pv, votes) => (pv + votes), 0);
  return _.reduce(parties, (pv, votes, party) => {
    let ratio = votes/totalVotes;
    pv[party] = Math.round(votes + (voteChange * ratio));
    return pv;
  }, {});
};

export const manipulatePartyByPercent = (parties, changedParty, pc) => {
  let result = {};
  result[changedParty] = parties[changedParty] * (1 + pc);
  let diff = parties[changedParty] - result[changedParty];
  return Object.assign({}, result, proportionallyRemoveVotes(_.omit(parties, [changedParty]), diff));
};
