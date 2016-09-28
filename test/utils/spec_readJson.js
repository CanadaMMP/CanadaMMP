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

let {
  getFileNames,
  // writeFile,
  // parseCSV,
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
});
