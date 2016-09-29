import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;
import sinon from 'sinon';
import fs from 'fs';


let rd = sinon.spy();
let appF = sinon.spy();
let Console = console;

const spyObj = {
  fs: {
    readdir: rd,
    appendFile: appF,
  },
  Console: Console,
};

import readJson from '../../src/utils/readJson';
import parseCSV_expected from '../examples/parseCSV_expected';

let {
  getFileNames,
  writeFile,
  parseCSV,
  stripQuotes,
  formatPollingPlaceInfo,
} = readJson("./in/", "out", spyObj);
let {
  getAllFiles,
} = readJson('./test/examples/csvdir/', './test/examples/outdir/');

describe('/utils/readJson.js', function(){
  describe('getFileNames()', function(){
    it('should call fs.readdir with the correct directory name', function(){
      getFileNames();
      expect(rd.getCall(0).args[0]).to.equal("./in/");
    });
  });
  describe('writeFile()', function(){
    it('should write JSON to a file', function(){
      const testObj = {you: ["must", "build", "additional", 3.14, "lons"]};
      writeFile("test", testObj);
      expect(appF.getCall(0).args[0]).to.equal("./out/test.json");
      expect(appF.getCall(0).args[1]).to.equal(JSON.stringify(testObj, null, 2));
    });
  });
  describe('parseCSV()', function(){
    it('should convert CSV to JSON', function(done){
      expect(parseCSV('./test/examples/', 'testcsv.csv')).to.eventually.eql({filename: 'testcsv.csv', json: parseCSV_expected}).notify(done);
    });
  });
  describe('stripQuotes()', function(){
    it('should strip out escaped quote literals from string', function(){
      expect(stripQuotes("\"I am the legendary \"fartmaster\"\ -- Sans")).to.equal("I am the legendary fartmaster -- Sans");
    });
  });
  describe('formatPollingPlaceInfo', function(){
    it('should take a raw JSON object and extract the important elements', function(){
      let sample = parseCSV_expected[1];
      expect(formatPollingPlaceInfo(sample)).to.eql({
        firstName: "Jeannie",
        familyName:"Baldwin",
        middleName: "",
        party: "NDP-New Democratic Party",
        votes: 9,
      });
    });
  });
  describe('getAllFiles()', function(){
    before(function(done){
      fs.readdir('./test/examples/outdir/', (err, filenames) => {
        Promise.all(filenames.map((filename) => new Promise((resolve) => {
          fs.unlink('./test/examples/outdir/' + filename, () => resolve());
        }))).then(() => done());
      });
    });
    it('should get all the files in the ./data/byDistrict directory and process them', function(done){
      expect(getAllFiles()
        .then(() => new Promise(function(resolve2) {
          fs.readdir('./test/examples/outdir/', (err, filenames) => resolve2(filenames));
        })
      )).to.eventually.eql(  [
        "pollresults_resultatsbureau10001.csv.json",
        "pollresults_resultatsbureau10002.csv.json",
      ]).notify(done);
    });
    it('should have written the right data', function(done){
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
});
