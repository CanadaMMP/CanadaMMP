import _ from 'lodash';
import {proportionOfPopularVoteByParty} from './fpp';

export const beatThreshholdEh = (value, thresh) => (value >= thresh);

export const partiesPastThreshhold = (proportions, thresh) => _.reduce(proportions, (pv, pcPopVote, party) => {
  if(beatThreshholdEh(pcPopVote, thresh)){
    pv[party] = pcPopVote;
  }
  return pv;
}, {});

export const mmpFindWastage = (proportions, thresh) => _.reduce(proportions, (pv, pcPopVote) => beatThreshholdEh(pcPopVote, thresh) ? pv : (pv + pcPopVote), 0);

export const mmpReassignWastage = (parties, wastage) => {
  let denominator = Object.keys(parties).length;
  let bump = wastage/denominator;
  return _.reduce(parties, (pv, value, party) => Object.assign(pv, {[party]: value + bump}) , {});
};

export const mmpAssignSeats = (parties, seats) => {
  let oneSeat = 1/seats;
  let assignedSeats = _.reduce(parties, (pv, pcPopVote, party) => {
    pv[party] = Math.floor(pcPopVote * seats);
    return pv;
  }, {});
  let uneven = seats % Object.keys(parties).length;
  if (uneven > 0) {
    let remainders = _.map(parties, (vote, party) => ({
      "party": party,
      "value": vote - (oneSeat * assignedSeats[party])
    })).sort((a, b) => (a.value > b.value) ? 1 : (a.value > b.value) ? -1 : 0).slice(0, uneven);
    remainders.forEach((rem) => {
      assignedSeats[rem.party] += 1;
    });
  }
  return assignedSeats;
};

export const mmpSeatsByParty = (documents, seats, thresh) => {
  let proportions = proportionOfPopularVoteByParty(documents);
  let partiesRemaining = partiesPastThreshhold(proportions, thresh);
  let wastage = mmpFindWastage(proportions, thresh);
  let mmpAdjustment = mmpReassignWastage(partiesRemaining, wastage);
  return mmpAssignSeats(mmpAdjustment, seats);
};
