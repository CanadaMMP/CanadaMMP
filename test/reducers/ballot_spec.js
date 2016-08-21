import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;

import {
  addVotePreference,
  removeCandidate,
  clearBallot,
  replaceBallot,
  eliminateLoser,
  changeVoteValue,
  processWinner,
} from '../../src/js/actions/ballotActions'

import {
  votePreferences,
  voteValue,
} from '../../src/js/reducers/ballot'

describe('reducers - ballot.js', () => {
  describe('votePreferences()', () => {
    it('should add vote preferences', () => {
      let step1 = votePreferences();
      expect(step1).to.eql([])
      let step2 = votePreferences(step1, addVotePreference('CLINTON, Hillary'));
      expect(step2).to.eql(['CLINTON, Hillary']);
      let step3 = votePreferences(step2, addVotePreference('SANDERS, Bernie'));
      expect(step3).to.eql(['CLINTON, Hillary', 'SANDERS, Bernie']);
      let step4 = votePreferences(step3, addVotePreference('O\'MALLEY, Martin'));
      expect(step4).to.eql(['CLINTON, Hillary', 'SANDERS, Bernie', 'O\'MALLEY, Martin']);
      let step5 = votePreferences(step4, addVotePreference('SANDERS, Bernie'))
      expect(step5).to.eql(['CLINTON, Hillary', 'SANDERS, Bernie', 'O\'MALLEY, Martin']);
      let step6 = votePreferences(step5, addVotePreference('SANDERS, Bernie', 0));
      expect(step6).to.eql(['SANDERS, Bernie', 'CLINTON, Hillary', 'O\'MALLEY, Martin']);
      let step7 = votePreferences(step5, addVotePreference('SANDERS, Bernie', 2));
      expect(step7).to.eql(['CLINTON, Hillary', 'O\'MALLEY, Martin', 'SANDERS, Bernie']);
      let step8 = votePreferences(step2, addVotePreference('SANDERS, Bernie', 2))
      expect(step8).to.eql(['CLINTON, Hillary', 'SANDERS, Bernie'])
    })
  })
  describe('voteValue()',() => {
    it('should keep track of the vote value', () => {
      let step1 = voteValue(undefined);
      expect(step1).to.equal(1);
      let step2 = voteValue(step1, changeVoteValue(0.5));
      expect(step2).to.equal(0.5);
      let step3 = voteValue(step2, changeVoteValue(0.5));
      expect(step3).to.equal(0.25);
    })
  })
})
