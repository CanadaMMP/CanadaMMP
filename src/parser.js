import fs from 'fs';
import _ from 'lodash';
import csv from 'csv-to-json';
// THIS IS WHAT"S SCREWING UP THE PARSER.
//
// 12001,"Cape Breton--Canso","Cape Breton--Canso"," 156","Antigonish, Subd. B",N,N,"",1,364,"Rodgers","","Adam Daniel","Conservative","Conservateur",N,N,23
// "Antigonish, Subd. B"
// Use an off-the rack parser instead of this one, should fix the data problems.

const writeFile = (filename, content) => new Promise(function(resolve, reject) {
  fs.appendFile("./out/" + filename + ".json", JSON.stringify(content, null, 2), (err) => {
    if (err) {
      reject(err);
    } else {
      resolve(true);
    }
  })
});

const getFileNames = (dirname) => new Promise(function(resolve, reject) {
  fs.readdir(dirname, (err, filenames) => {
    if (err) {
      reject(err);
      return;
    }
    resolve(filenames);
  })
});

// const stagger = (arrayOfArgs, thenable) => new Promise(function(resolve, reject) {
//   if (arrayOfArgs.length <= 0) {
//     resolve(true)
//     return;
//   }
//   let file = arrayOfArgs.shift();
//   thenable(file)
//     .then((successEh) => {
//       if (!successEh) {
//         reject("Error: File did not successfully write");
//       } else {
//         stagger(arrayOfArgs, thenable)
//           .then(() => resolve())
//       }
//     })
// });

const parseCSV = (dir, filename) => new Promise(function(resolve, reject) {
  csv.parse({
    filename: dir + filename
  }, (err, json) => {
    if (err) {
      reject(err);
    }
    resolve({json, filename});
  })
});

/**
 * [countVotes description]
 * @param  {[type]} lines [description]
 * @return {[type]}       [description]
 */
const countVotes = (lines) => {
  let re = /\"/g; // strip out quote literals
  lines = _.filter(lines, (line) => !!line['﻿Electoral District Number/Numéro de circonscription'])
  let initialInfo = {
    districtNumber: lines[0]['﻿Electoral District Number/Numéro de circonscription'].replace(re, ''),
    districtNameEnglish: lines[0]['Electoral District Name_English/Nom de circonscription_Anglais'].replace(re, ''),
    districtNameFrench: lines[0]['Electoral District Name_French/Nom de circonscription_Français'].replace(re, ''),
  }
  console.log(initialInfo)
  let simplifiedLines = lines.map((line) => ({
    firstName: line['Candidate’s First Name/Prénom du candidat'].replace(re, ''),
    familyName: line['Candidate’s Family Name/Nom de famille du candidat'].replace(re, ''),
    middleName: line['Candidate’s Middle Name/Second prénom du candidat'].replace(re, ''),
    party: line['Political Affiliation Name_English/Appartenance politique_Anglais'].replace(re, ''),
    votes: parseInt(line['Candidate Poll Votes Count/Votes du candidat pour le bureau']),
  }))
  return simplifiedLines.reduce((pv, line) => {
    if (!line.familyName) {
      return pv;
    }
    if (line.party === "No Affiliation" || line.party === "Independent") {
      if (!pv.Independents) {
        pv.Independents = {}
      }
      if (!pv.Independents[line.familyName]) {
        pv.Independents[line.familyName] = _.pick(line, ["familyName", "middleName", "firstName"])
        pv.Independents[line.familyName].votes = 0;
      }
      pv.Independents[line.familyName].votes += line.votes;
      return pv;
    }
    if (!pv[line.party]) {
      pv[line.party] = _.pick(line, ["familyName", "middleName", "firstName"]);
      pv[line.party].votes = 0;
    }
    pv[line.party].votes += line.votes;
    return pv;
  }, initialInfo)
}


const getAllFiles = (dirname) => {
  getFileNames(dirname)
    .then((filenames) => Promise.all(filenames.map((filename) => parseCSV(dirname, filename)))
    .then((jsons) => jsons.map(({json, filename}) => ({filename: filename, votes: countVotes(json)}))))
    .then((items) => Promise.all(items.map(({filename, votes}) => writeFile(filename, votes))))
    .catch((err) => console.log(err))
}

getAllFiles('./src/data/byDistrict/')
