import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;
import sinon from 'sinon';

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
  // consolidatePollingPlaces,
  // countVotes,
  // getAllFiles,
} = readJson(spyObj);

describe('/utils/readJson.js', function(){
  describe('getFileNames()', function(){
    it('should call fs.readdir with the correct directory name', function(){
      getFileNames("wockaWocka!");
      expect(rd.getCall(0).args[0]).to.equal("wockaWocka!");
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
});
