import controller from './backend/js/db/controller';
import _ from 'lodash';

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

  let winners = docs.map((doc) => {
    doc = _.omit(doc, ["_id"]);
    let district = _.pick(doc, ["districtNumber", "districtNameEnglish", "districtNameFrench"]);
    let king = {"party": "null", "votes": 0};
    for(let key in doc){
      if(key === "Independents"){
        for(let name in doc[key]){
          if(doc[key][name].votes > king.votes){
            king = {"party": "Independent: " + name, votes: doc[key][name].votes};
          }
        }
      } else {
        if (doc[key].votes > king.votes){
          king = {"party": key, votes: doc[key].votes};
        }
      }
    }
    return Object.assign(district, {winner: king});
  });
  let partySeats = winners.reduce((pv, district) => {
    if (!pv[district.winner.party]){
      pv[district.winner.party] = 0;
    }
    pv[district.winner.party] += 1;
    return pv;
  },{});
  console.log("PARTY SEATS:", partySeats);
});
