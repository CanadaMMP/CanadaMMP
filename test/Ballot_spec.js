import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;

import Ballot from '../src/js/Ballot';

const ballotR = [
  {candidate: 'TRUMP', position: 0},
  {candidate: 'CRUZ', position: 1},
  {candidate: 'KASICH', position: 2},
]

const ballotI = [
  {candidate: 'JOHNSON', position: 0},
  {candidate: 'STEIN', position: 1},
  {candidate: 'SUPREME', position: 2},
]

const ballotD = [
  {candidate: 'CLINTON', position: 0},
  {candidate: 'SANDERS', position: 1},
  {candidate: 'O\'MALLEY', position: 2},
]

const ballotP = [
  {candidate: 'SANDERS', position: 0},
  {candidate: 'CLINTON', position: 1},
  {candidate: 'O\'MALLEY', position: 2},
]

let b = new Ballot("Steve Irwin");

describe('Ballot()', () => {
  describe('constructor()', () => {
    it('should create a new ballot', () => {
      expect(b.id).to.equal("Steve Irwin")
      expect(b.percentValue).to.equal(1);
      expect(b.vote).to.eql([]);
      expect(b.originalVote).to.eql([]);
      expect(b.locked).to.equal(false);
    })
  })
  describe('setChoice()', () => {
    it('should register new choices', () => {
      b.setChoice('SANDERS');
      expect(b.getVote()).to.eql(['SANDERS'])
      b.setChoice('O\'MALLEY');
      expect(b.getVote()).to.eql(['SANDERS', 'O\'MALLEY'])
      b.setChoice('CLINTON');
      expect(b.id).to.equal("Steve Irwin");
      expect(b.getVote()).to.eql(['SANDERS', 'O\'MALLEY', 'CLINTON'])
    })
    it('should modify choices', () => {
      b.setChoice('LESSIG', 1);
      expect(b.getVote()).to.eql(['SANDERS', 'LESSIG', 'CLINTON'])
    })
  })
  describe('setChoices()', () => {
    it('should modify multiple choices', () => {

      b.setChoices(ballotR);
      expect(b.getVote()).to.eql(['TRUMP', 'CRUZ', 'KASICH']);
    })
  })
  describe('clearChoices()', () => {
    it ('should clear all the choices', () => {
      b.clearChoices();
      expect(b.getVote()).to.eql([])
    })
  })
  describe('removeCandidate()', () => {
    it ('should remove the candidate from the vote list', () => {

      b.setChoices(ballotI);
      expect(b.getVote()).to.eql(['JOHNSON', 'STEIN', 'SUPREME']);
      b.removeCandidate('STEIN');
      expect(b.getVote()).to.eql(['JOHNSON', 'SUPREME']);
      b.setChoices(ballotI);
      b.removeCandidate('JOHNSON');
      expect(b.getVote()).to.eql(['STEIN', 'SUPREME']);
    })
  })
  describe('setWinningCandidate()', () => {
    it ('should remove the candidate from the vote list\n' +
        '\t& should NOT change vote lists where the candidate\n' +
        '\t  does not appear\n' +
        '\t& should alter the vote percentage IF and ONLY IF\n' +
        '\t  the candidate was that voter\'s leading choice.', () => {
      let establishment = new Ballot("Establishment");
      let progressive = new Ballot("Progressive");
      let republican = new Ballot("Republican");
      establishment.setChoices(ballotD);
      progressive.setChoices(ballotP);
      republican.setChoices(ballotR);
      let allVotes = [establishment, progressive, republican];
      allVotes.forEach((vote) => {
        vote.setWinningCandidate('CLINTON', .18);
      })
      expect(establishment.getVote()).to.eql(['SANDERS', 'O\'MALLEY']);
      expect(establishment.percentValue).to.equal(0.18);
      expect(progressive.getVote()).to.eql(['SANDERS', 'O\'MALLEY']);
      expect(progressive.percentValue).to.equal(1);
      expect(republican.getVote()).to.eql(['TRUMP', 'CRUZ', 'KASICH']);
      expect(republican.percentValue).to.equal(1);
    })
  })
})
