import fs from 'fs';
import _ from 'lodash';
import csv from 'csv-to-json';
// THIS IS WHAT"S SCREWING UP THE PARSER.
//
// 12001,"Cape Breton--Canso","Cape Breton--Canso"," 156","Antigonish, Subd. B",N,N,"",1,364,"Rodgers","","Adam Daniel","Conservative","Conservateur",N,N,23
// "Antigonish, Subd. B"
// Use an off-the rack parser instead of this one, should fix the data problems.

const readFile = (dirname, filename) => new Promise(function(resolve, reject) {
    fs.readFile(dirname + filename, 'utf-8', (err, content) => {
        if (err) {
            reject(err);
            return;
        }
        resolve({filename, content})
    });
});

const writeFile = (filename, content) => new Promise(function(resolve, reject) {
    fs.appendFile("./out/" + filename + ".json", JSON.stringify(content, null, 2), (err) => {
        if (err) {
            reject(err);
        } else {
            resolve(true);
        }
    })
});

const readNWrite = ({dirname, filename}) => new Promise(function(resolve, reject) {
    readFile(dirname, filename)
      .then(({file, content}) => writeFile(file, content))
      .then(resolve).catch((x) => reject(x))
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

const stagger = (arrayOfArgs, thenable) => new Promise(function(resolve, reject) {
    if (arrayOfArgs.length <= 0) {
        resolve(true)
        return;
    }
    let file = arrayOfArgs.shift();
    thenable(file).then((successEh) => {
        if (!successEh) {
            reject("Error: File did not successfully write");
        } else {
            stagger(arrayOfArgs, thenable).then(() => resolve())
        }
    })
});

const parseCSV = (dir, filename) => new Promise(function(resolve, reject) {
  csv.parse({filename: dir + filename}, (err, json) => {
    if(err){
      reject(err);
    }
    resolve(json);
  })
});

const countVotes = (lines) => {
  let initialInfo = {
    districtNumber: lines[0]['﻿Electoral District Number/Numéro de circonscription'],
    districtNameEnglish: lines[0]['Electoral District Name_English/Nom de circonscription_Anglais'],
    districtNameFrench: lines[0]['Electoral District Name_French/Nom de circonscription_Français'],
  }
  let simplifiedLines = lines.map((line) => ({
    firstName: line['Candidate’s First Name/Prénom du candidat'],
    familyName: line['Candidate’s Family Name/Nom de famille du candidat'],
    middleName: line['Candidate’s Middle Name/Second prénom du candidat'],
    party: line['Political Affiliation Name_English/Appartenance politique_Anglais'],
    votes: parseInt(line['Candidate Poll Votes Count/Votes du candidat pour le bureau']),
  }))
  return simplifiedLines.reduce((pv, line) => {
    if(line.familyName === undefined){
      return pv;
    }
    if(line.party === "No Affiliation" || line.party === "Independent"){
      if(!pv.hasOwnProperty("Independents")){
        pv.Independents = {}
      }
      if(!pv.Independents.hasOwnProperty(line.familyName)){
        pv.Independents[line.familyName] = _.pick(line, ["familyName", "middleName", "firstName"])
        pv.Independents[line.familyName].votes = 0;
      }
      pv.Independents[line.familyName].votes += line.votes;
      return pv;
    }
    if(!pv.hasOwnProperty[line.party]){
      pv[line.party] = _.pick(line, ["familyName", "middleName", "firstName"]);
      pv[line.party].votes = 0;
    }
    pv[line.party].votes += line.votes;
    return pv;
  }, initialInfo)
}

const getAllFiles = (dirname) => new Promise(function(resolve, reject) {
    getFileNames(dirname)
      .then((filenames) => Promise.all(filenames.map((filename) => parseCSV(dirname, filename)))
      .then((jsons) => jsons.map((json) => countVotes(json))))
      .then((jsons) => resolve(jsons))
      .catch((err) => reject(err))
})

getAllFiles('./src/data/byDistrict/')
  .then((x) => console.log(x))
  .catch((e) => console.log(e))
