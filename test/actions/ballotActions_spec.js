import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;

import {
  SET_CHOICE,
  REMOVE_CANDIDATE,
  CLEAR_BALLOT,
  REPLACE_BALLOT,
  SET_NEW_VALUE,
} from '../../src/frontend/js/constants/index'
import {
  addVotePreference,
  removeCandidate,
  clearBallot,
  replaceBallot,
  eliminateLoser,
  processWinner,
} from '../../src/frontend/js/actions/ballotActions'

describe('actions - ballotActions', () => {
  describe('addVotePreference()', () => {
    it('should create an action to add a name to the ballot not given a position', () => {
      expect(addVotePreference('CLINTON, Hillary')).to.eql({
        type: SET_CHOICE,
        candidate: 'CLINTON, Hillary',
        position: undefined,
      })
    })
    it('should create an action to modify a ballot given a position', () => {
      expect(addVotePreference('CRUZ, Rafael "Ted"', 1)).to.eql({
        type: SET_CHOICE,
        candidate: 'CRUZ, Rafael "Ted"',
        position: 1
      })
    })
  })
  describe('removeCandidate()', () => {
    it('should create an action to remove a candidate', () => {
      expect(removeCandidate('RUBIO, Marco')).to.eql({
        type: REMOVE_CANDIDATE,
        candidate: 'RUBIO, Marco',
      })
    })
  })
  describe('clearBallot()', () => {
    it('should clear a ballot', () => {
      expect(clearBallot()).to.eql({type: CLEAR_BALLOT})
    })
  })
  describe('replaceBallot()', () => {
    it('should replace a ballot', () => {
      expect(replaceBallot(['SANDERS, Bernie', 'SUPREME, Vermin', 'CLINTON, Hillary']))
        .to.eql({
          type: REPLACE_BALLOT,
          ballot: ['SANDERS, Bernie', 'SUPREME, Vermin', 'CLINTON, Hillary'],
        })
    })
  })
  describe('eliminateLoser()', () => {
    it('should modify the ballot but NOT the vote value', () => {
      expect(eliminateLoser('BUSH, Jeb')).to.eql({
        type: REMOVE_CANDIDATE,
        candidate: 'BUSH, Jeb'
      })
    })
  })
  describe('processWinner()', () => {
    it('should modify the ballot *and* modify the vote value', () => {
      expect(processWinner('CLINTON, Hillary', 0.33)).to.eql([
        {type: SET_NEW_VALUE, value: 0.33},
        {type: REMOVE_CANDIDATE, candidate: 'CLINTON, Hillary'}
      ])
    })
  })
})
