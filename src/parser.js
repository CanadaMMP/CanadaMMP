import fs from 'fs';
import _ from 'lodash';
// THIS IS WHAT"S SCREWING UP THE PARSER.
//
// 12001,"Cape Breton--Canso","Cape Breton--Canso"," 156","Antigonish, Subd. B",N,N,"",1,364,"Rodgers","","Adam Daniel","Conservative","Conservateur",N,N,23
// "Antigonish, Subd. B"
// Use an off-the rack parser instead of this one, should fix the data problems. 
const parseCSV = (document) => {
    let lines = _.reject(document.split('\n'), (line) => (line.length < 3));
    let trueHeaders = lines[0];
    console.log("True Headers:\n", trueHeaders);
    let headers = [
      "electoralDistrictNumber",
      "englishDistrictName",
      "frenchDistrictName",
      "skip",
      "skip",
      "skip",
      "skip",
      "skip",
      "skip",
      "skip",
      "familyName",
      "middleName",
      "firstName",
      "partyEnglish",
      "partyFrench",
      "skip",
      "skip",
      "votes",
    ]
    console.log("headers:\n", headers);
    let results = lines.slice(1).map((line) => line.split(','));
    let firstMap = results.map((result) => {
        let data = {}
        for (let n = 0; n < result.length; n++) {
          if(headers[n] !== "skip"){
            const removeQuote = /\"/gi
            data[headers[n]] = result[n].replace(removeQuote, "")
          }
        }
        return data;
    })
    let out = _.pick(firstMap[0], ["electoralDistrictNumber", "englishDistrictName", "frenchDistrictName"])
    return firstMap.reduce((pv, cv) => {
      if(cv.partyEnglish === "Rodger"){
        console.log("CV: ", cv)
      }
      if(cv.partyEnglish === "No Affiliation" || cv.partyEnglish === "Independent"){
        pv.Independent = pv.Independent || {}
        pv.Independent[cv.familyName] = pv.Independent[cv.familyName] || Object.assign({votes: 0}, _.pick(cv, ["familyName", "middleName", "firstName"]))
        pv.Independent[cv.familyName].votes += parseInt(cv.votes);
        if(pv.Independent[cv.familyName].votes === null){
          console.log("INDIE\n", cv);
        }
        return pv;
      }
      pv[cv.partyEnglish] = pv[cv.partyEnglish] || Object.assign({votes: 0}, _.pick(cv, ["familyName", "middleName", "firstName"]))
      pv[cv.partyEnglish].votes += parseInt(cv.votes)
      if(pv[cv.partyEnglish].votes === null){
        console.log("AS PARTY\n", cv);
      }
      return pv;
    }, out)
}

const readFile = (dirname, filename) => new Promise(function(resolve, reject) {
    fs.readFile(dirname + filename, 'utf-8', (err, content) => {
        if (err) {
            reject(err);
            return;
        }
        resolve({
            file: filename,
            content: content,
        })
    });
});
const writeFile = (filename, content) => new Promise(function(resolve, reject) {
    fs.appendFile("./out/" + filename + ".json", JSON.stringify(
        parseCSV(content), null, 2), (err) => {
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

const getAllFiles = (dirname) => new Promise(function(resolve, reject) {
    getFileNames(dirname)
      .then((filenames) => stagger(filenames.map((filename) => ({dirname, filename})), readNWrite))
      .then((x) => resolve(x))
      .catch((e) => reject(e))
})

getAllFiles('./src/data/byDistrict/')
  .then((x) => console.log(x))
  .catch((e) => console.log(e))
