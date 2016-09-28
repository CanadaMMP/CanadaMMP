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
  // stripQuotes,
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
  describe('parseCSV', function(){
    it('should convert CSV to JSON', function(done){
      expect(parseCSV('./test/examples/', 'testcsv.csv')).to.eventually.eql({filename: 'testcsv.csv', json: parseCSV_expected}).notify(done);
    });
  });
});
