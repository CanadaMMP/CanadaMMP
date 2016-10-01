import controller from './backend/js/db/controller';
import _ from 'lodash';

const candidateNameGenerator = (candidate) => "" + candidate.familyName.toUpperCase() + ", " + candidate.firstName + " " + candidate.middleName;

const findWinner = (districtResults) => {
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

controller().getEveryRecord().then((docs) => {
  console.log("all Votes");
  let allVotes = docs.reduce((pv, doc) => {

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
  console.log("total: ", allVotes);

  let winners = docs.map((doc) => ({district: doc.districtNameEnglish, winner: findWinner(doc)}));
  console.log("winners: \n", JSON.stringify(winners));
});
