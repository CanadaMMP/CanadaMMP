import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;
//import controller from '../../../../src/backend/js/db/controller';
import { manipulatePartyByPercent } from '../../../../src/frontend/js/utilities/voteManip';

describe('voteManip.js', function(){
  describe('manipulatePartyByPercent()', function(){
    it('adds or subtracts based on increase or decrease', function(){
      const riding = {
        "apple": 1000,
        "banana": 3000,
        "pear": 2000,
      };
      expect(manipulatePartyByPercent(riding, "apple", 0.05)).to.eql({
        "apple": 1050,
        "banana": 2970,
        "pear": 1980,
      });
      expect(manipulatePartyByPercent(riding, "banana", -0.05)).to.eql({
        "apple": 1050,
        "banana": 2850,
        "pear": 2100,
      });
    });
  });
});
