import chai from 'chai';
const expect = chai.expect;
import candidateName from '../../../../src/frontend/js/utilities/candidateName';

describe('candidateName()', function(){
  it('correctly does each candidate\'s name', function(){
    expect(candidateName({
      familyName: "Newman",
      middleName: "E.",
      firstName: "Alfred",
    })).to.equal("NEWMAN, Alfred E.");

    expect(candidateName({
      familyName: "Bear",
      middleName: "",
      firstName: "Fozzie",
    })).to.equal("BEAR, Fozzie");
  });
});
