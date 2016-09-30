import fsImport from 'fs';
import _ from 'lodash';
import csvToJSON from 'csv-to-json';

export default (fs = fsImport) => {

  const getFileNames = (inputDir) => new Promise(function(resolve, reject) {
    fs.readdir(inputDir, (err, filenames) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(filenames);
    });
  });

  const writeFile = (outputDir, filename, content) => new Promise(function(resolve, reject) {
    fs.appendFile(outputDir + filename + ".json", JSON.stringify(content, null, 2), (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });



  const parseCSV = (inputDir, filename) => new Promise(function(resolve, reject) {
    csvToJSON.parse({
      filename: inputDir + filename
    }, (err, json) => {
      if (err) {
        reject(err);
      }
      // removes invalid data from CSV-to-JSON module.
      json.filter((j) => !!j['Candidate’s Family Name/Nom de famille du candidat']);
      json = json.map((j) => {
        let val = {};
        for(let key in j){
          if (key.indexOf("Electoral District Number") !== -1){
            val["Electoral District Number"] = j[key];
          } else {
            val[key] = j[key];
          }
        }
        return val;
      });
      resolve({
        json,
        filename
      });
    });
  });

  const stripQuotes = (string) => typeof(string) === "string" ? string.replace(/\"/g, "") : string;

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

  const isValidLine = (line) => {
    let districtNum = Object.keys(line)[0];
    return !!line[districtNum];
  };

  const countVotes = (lines) => {
    lines = lines.filter((line) => isValidLine(line));
    let firstLine = lines[0];
    let districtNameEnglish = stripQuotes(firstLine['Electoral District Name_English/Nom de circonscription_Anglais']);
    let districtNameFrench = stripQuotes(firstLine['Electoral District Name_French/Nom de circonscription_Français']);
    let districtNumber = firstLine['Electoral District Number'];
    return consolidatePollingPlaces(lines.map((line) => formatPollingPlaceInfo(line)), {
      districtNumber,
      districtNameEnglish,
      districtNameFrench
    });
  };

  const getAllFiles = (inputDir, outputDir) => new Promise((resolve, reject) => {
    getFileNames(inputDir)
      .then((filenames) => Promise.all(filenames.map((filename) => parseCSV(inputDir, filename))))
      .then((jsons) => jsons.map(({json, filename}) => ({
        filename: filename,
        votes: countVotes(json)
      })))
      .then((items) => Promise.all(items.map(({filename, votes}) => writeFile(outputDir, filename, votes))))
      .then(() => resolve())
      .catch((err) => reject(err));
  });


  const jsonToObject = (inputDir, filename) => new Promise((resolve, reject) => {
    fs.readFile(inputDir + filename, 'utf-8', (err, data) => {
      if(err) {
        reject(err);
        throw err;
      }
      resolve(JSON.parse(data));
    });
  });

  const readJsons = (inputDir, filenames) => new Promise((resolve, reject) => {
    Promise.all(filenames.map((filename) => jsonToObject(inputDir, filename)))
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });

  return {
    getFileNames,
    writeFile,
    jsonToObject,
    readJsons,
    parseCSV,
    stripQuotes,
    formatPollingPlaceInfo,
    consolidatePollingPlaces,
    countVotes,
    getAllFiles,
  };

};

// getAllFiles('../data/byDistrict/')
