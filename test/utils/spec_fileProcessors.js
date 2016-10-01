import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;
import fs from 'fs';

import fileProcessor from '../../src/utils/fileProcessors';
import parseCSV_expected from '../examples/parseCSV_expected';
// tests with spies

// tests with the real FS
let {
  getFileNames,
  writeFile,
  parseCSV,
  stripQuotes,
  formatPollingPlaceInfo,
  readJsons,
  jsonToObject,
  getAllFiles,
} = fileProcessor();

const clearTestData = (folder) => new Promise(function(resolve, reject) {
  fs.readdir(folder, (err, filenames) => {
    if (err){
      reject(err);
    }
    Promise.all(filenames.map((filename) => new Promise((resolve2) => {
      fs.unlink(folder + filename, () => resolve2());
    }))).then(() => resolve());
  });
});


describe('/utils/readJson.js', function() {
  describe('getFileNames()', function() {
    it('should call fs.readdir with the correct directory name', function(done) {
      expect(getFileNames('./test/examples/csvdir/')).to.eventually.eql([
        "pollresults_resultatsbureau10001.csv",
        "pollresults_resultatsbureau10002.csv",
      ]).notify(done);
    });
  });
  describe('writeFile()', function() {
    it('should write JSON to a file', function(done) {
      const testObj = {
        you: ["must", "build", "additional", 3.14, "lons"]
      };
      expect(clearTestData("./test/examples/test/")
        .then(() => writeFile("./test/examples/test/", "test", testObj))
        .then(() => getFileNames("./test/examples/test/"))).to.eventually.eql([ 'test.json' ]).notify(done);
    });
  });
  describe('parseCSV()', function() {
    it('should convert CSV to JSON', function(done) {
      expect(parseCSV('./test/examples/', 'testcsv.csv')).to.eventually.eql({
        filename: 'testcsv.csv',
        json: parseCSV_expected
      }).notify(done);
    });
  });
  describe('stripQuotes()', function() {
    it('should strip out escaped quote literals from string', function() {
      expect(stripQuotes("\"I am the legendary \"fartmaster\"\ -- Sans")).to.equal("I am the legendary fartmaster -- Sans");
    });
  });
  describe('formatPollingPlaceInfo', function() {
    it('should take a raw JSON object and extract the important elements', function() {
      let sample = parseCSV_expected[1];
      expect(formatPollingPlaceInfo(sample)).to.eql({
        firstName: "Jeannie",
        familyName: "Baldwin",
        middleName: "",
        party: "NDP-New Democratic Party",
        votes: 9,
      });
    });
  });
  describe('getAllFiles()', function() {
    before(function(done) {
      clearTestData('./test/examples/outdir/').then(() => done());
    });
    it('should get all the files in the ./data/byDistrict directory and process them', function(done) {
      expect(getAllFiles('./test/examples/csvdir/', './test/examples/outdir/')
        .then(() => new Promise(function(resolve2) {
          fs.readdir('./test/examples/outdir/', (err, filenames) => resolve2(filenames));
        }))).to.eventually.eql([
          "pollresults_resultatsbureau10001.csv.json",
          "pollresults_resultatsbureau10002.csv.json",
        ]).notify(done);
    });
    it('should have written the right data', function(done) {
      let expectation = {
        "districtNumber": "10001",
        "districtNameEnglish": "Avalon",
        "districtNameFrench": "Avalon",
        "Independents": {
          "Andrews": {
            "familyName": "Andrews",
            "middleName": "",
            "firstName": "Scott",
            "votes": 7501
          }
        },
        "NDP-New Democratic Party": {
          "familyName": "Baldwin",
          "middleName": "",
          "firstName": "Jeannie",
          "votes": 6075
        },
        "Conservative": {
          "familyName": "Barnett",
          "middleName": "",
          "firstName": "Lorraine E.",
          "votes": 4670
        },
        "Green Party": {
          "familyName": "Byrne-Puumala",
          "middleName": "",
          "firstName": "Krista",
          "votes": 228
        },
        "Forces et Démocratie - Allier les forces de nos régions": {
          "familyName": "McCreath",
          "middleName": "",
          "firstName": "Jennifer",
          "votes": 84
        },
        "Liberal": {
          "familyName": "McDonald",
          "middleName": "",
          "firstName": "Ken",
          "votes": 23528
        }
      };
      const reader = () => new Promise((resolve, reject) => {
        fs.readFile('./test/examples/outdir/pollresults_resultatsbureau10001.csv.json', 'utf-8', (err, data) => {
          if (err) {
            reject(err);
            throw err;
          }
          resolve(data);
        });
      });
      expect(reader()).to.eventually.eql(JSON.stringify(expectation, null, 2)).notify(done);
    });
  });
  describe('jsonToObject()', function() {
    it('parses JSON files into javascript objects', function(done) {
      expect(getFileNames('./test/examples/outdir/')
          .then((filenames) => jsonToObject('./test/examples/outdir/', filenames[0])))
        .to.eventually.be.an('object').notify(done);
    });
  });
  describe('jsonToObject()', function() {
    it('parses JSON files into javascript objects', function(done) {
      expect(getFileNames('./test/examples/outdir/')
        .then((filenames) => jsonToObject('./test/examples/outdir/', filenames[0]))
        .then((result) => JSON.stringify(result)))
        .to.eventually.equal(JSON.stringify({
          "districtNumber": "10001",
          "districtNameEnglish": "Avalon",
          "districtNameFrench": "Avalon",
          "Independents": {
            "Andrews": {
              "familyName": "Andrews",
              "middleName": "",
              "firstName": "Scott",
              "votes": 7501
            }
          },
          "NDP-New Democratic Party": {
            "familyName": "Baldwin",
            "middleName": "",
            "firstName": "Jeannie",
            "votes": 6075
          },
          "Conservative": {
            "familyName": "Barnett",
            "middleName": "",
            "firstName": "Lorraine E.",
            "votes": 4670
          },
          "Green Party": {
            "familyName": "Byrne-Puumala",
            "middleName": "",
            "firstName": "Krista",
            "votes": 228
          },
          "Forces et Démocratie - Allier les forces de nos régions": {
            "familyName": "McCreath",
            "middleName": "",
            "firstName": "Jennifer",
            "votes": 84
          },
          "Liberal": {
            "familyName": "McDonald",
            "middleName": "",
            "firstName": "Ken",
            "votes": 23528
          }
        })).notify(done);

    });
  });
  describe('readJsons()', function() {
    it('parses an array of filenames of JSON documents into JS objects', function(done) {
      let expected = [{
        "districtNumber": "10001",
        "districtNameEnglish": "Avalon",
        "districtNameFrench": "Avalon",
        "Independents": {
          "Andrews": {
            "familyName": "Andrews",
            "middleName": "",
            "firstName": "Scott",
            "votes": 7501
          }
        },
        "NDP-New Democratic Party": {
          "familyName": "Baldwin",
          "middleName": "",
          "firstName": "Jeannie",
          "votes": 6075
        },
        "Conservative": {
          "familyName": "Barnett",
          "middleName": "",
          "firstName": "Lorraine E.",
          "votes": 4670
        },
        "Green Party": {
          "familyName": "Byrne-Puumala",
          "middleName": "",
          "firstName": "Krista",
          "votes": 228
        },
        "Forces et Démocratie - Allier les forces de nos régions": {
          "familyName": "McCreath",
          "middleName": "",
          "firstName": "Jennifer",
          "votes": 84
        },
        "Liberal": {
          "familyName": "McDonald",
          "middleName": "",
          "firstName": "Ken",
          "votes": 23528
        }
      }, {
        "districtNumber": "10002",
        "districtNameEnglish": "Bonavista--Burin--Trinity",
        "districtNameFrench": "Bonavista--Burin--Trinity",
        "NDP-New Democratic Party": {
          "familyName": "Brown",
          "middleName": "",
          "firstName": "Jenn",
          "votes": 2557
        },
        "Green Party": {
          "familyName": "Colbourne",
          "middleName": "",
          "firstName": "Tyler John",
          "votes": 297
        },
        "Liberal": {
          "familyName": "Foote",
          "middleName": "",
          "firstName": "Judy M.",
          "votes": 28704
        },
        "Conservative": {
          "familyName": "Windsor",
          "middleName": "",
          "firstName": "Mike",
          "votes": 3534
        }
      }];
      expect(getFileNames('./test/examples/outdir/')
        .then((filenames) => readJsons('./test/examples/outdir/', filenames)))
        .to.eventually.eql(expected).notify(done);
    });
  });
});
