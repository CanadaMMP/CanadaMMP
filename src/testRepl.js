import controller from './backend/js/db/controller';
import _ from 'lodash';

controller().getEveryRecord().then((docs) => {
  console.log("all Votes");
  let allVotes = docs.reduce((pv, doc) => {
    doc = _.omit(doc, ["districtNumber", "districtNameEnglish", "districtNameFrench", "_id"]);
    for(let key in doc){
      if(key === "Independents"){
        pv["Independents"] += Object.keys(doc["Independents"]).reduce((pv, name) => pv + doc["Independents"][name].votes, 0);
      }
      if(!pv[key]){
        pv[key] = 0;
      }
      pv[key] += doc[key].votes;
    }
    return pv;
  }, {Independents: 0});
  console.log("total: ", allVotes);
});
