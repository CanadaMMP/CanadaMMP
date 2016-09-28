import fsImport from 'fs';
import _ from 'lodash';
import csv from 'csv-to-json';

export default (injections) => {
  injections = injections || {};
  let fs = injections.fs || fsImport;
  let Console = injections.Console || console;

  const getFileNames = (dirname) => new Promise(function(resolve, reject) {
    fs.readdir(dirname, (err, filenames) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(filenames);
    });
  });

  const writeFile = (filename, content) => new Promise(function(resolve, reject) {
    fs.appendFile("./out/" + filename + ".json", JSON.stringify(content, null, 2), (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });

  const parseCSV = (dir, filename) => new Promise(function(resolve, reject) {
    csv.parse({
      filename: dir + filename
    }, (err, json) => {
      if (err) {
        reject(err);
      }
      resolve({
        json,
        filename
      });
    });
  });

  const stripQuotes = (string) => string.replace(/\"/g, "");

  const formatPollingPlaceInfo = (poll) => ({
    firstName: stripQuotes(poll['Candidate’s First Name/Prénom du candidat']),
    familyName: stripQuotes(poll['Candidate’s Family Name/Nom de famille du candidat']),
    middleName: stripQuotes(poll['Candidate’s Middle Name/Second prénom du candidat']),
    party: stripQuotes(poll['Political Affiliation Name_English/Appartenance politique_Anglais']),
    votes: parseInt(poll['Candidate Poll Votes Count/Votes du candidat pour le bureau']),
  });

  const consolidatePollingPlaces = (districtResults, demographicData) => districtResults.reduce((pv, tally) => {
    // if this entry is invalid, for any reason, skip it and return the previous value.
    if (!tally.familyName) {
      return pv;
    }
    // if the candidate is an independent, add them to the independents object by family name.
    if (tally.party === "No Affiliation" || tally.party === "Independent") {
      if (!pv.Independents) {
        pv.Independents = {};
      }
      if (!pv.Independents[tally.familyName]) {
        pv.Independents[tally.familyName] = _.pick(tally, ["familyName", "middleName", "firstName"]);
        pv.Independents[tally.familyName].votes = 0;
      }
      pv.Independents[tally.familyName].votes += tally.votes;
      return pv;
    }
    // if the candidate is a nominee of a party, list them by party.
    if (!pv[tally.party]) {
      pv[tally.party] = _.pick(tally, ["familyName", "middleName", "firstName"]);
      pv[tally.party].votes = 0;
    }
    pv[tally.party].votes += tally.votes;
    return pv;

  }, demographicData);

  const countVotes = (lines) => {
    lines = _.filter(lines, (line) => !!line['﻿Electoral District Number/Numéro de circonscription']);
    let districtNumber = stripQuotes(lines[0]['﻿Electoral District Number/Numéro de circonscription']);
    let districtNameEnglish = stripQuotes(lines[0]['Electoral District Name_English/Nom de circonscription_Anglais']);
    let districtNameFrench = stripQuotes(lines[0]['Electoral District Name_French/Nom de circonscription_Français']);
    return consolidatePollingPlaces(lines.map((line) => formatPollingPlaceInfo(line)), {
      districtNumber,
      districtNameEnglish,
      districtNameFrench
    });
  };

  const getAllFiles = () => {
    getFileNames(dirname)
      .then((filenames) => Promise.all(filenames.map((filename) => parseCSV(dirname, filename))))
      .then((jsons) => jsons.map(({json, filename}) => ({
        filename: filename,
        votes: countVotes(json)
      })))
      .then((items) => Promise.all(items.map(({filename, votes}) => writeFile(filename, votes))))
      .catch((err) => {
        Console.log(err);
      });
  };

  return {
    getFileNames,
    writeFile,
    parseCSV,
    stripQuotes,
    formatPollingPlaceInfo,
    consolidatePollingPlaces,
    countVotes,
    getAllFiles,
  };

};

// getAllFiles('../data/byDistrict/')
