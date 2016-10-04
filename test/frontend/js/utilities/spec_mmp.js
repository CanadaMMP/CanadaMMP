import _ from 'lodash';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;
import controller from '../../../../src/backend/js/db/controller';
import {
  beatThreshholdEh,
  partiesPastThreshhold,
  mmpFindWastage,
  mmpReassignWastage,
  mmpAssignSeats,
  mmpSeatsByParty,
} from '../../../../src/frontend/js/utilities/mmp';
import correctData from '../../../examples/correctData';

const election = {
  "apple": 0.1,
  "pear": 0.2,
  "banana": 0.3,
  "grape": 0.051,
  "strawberry": 0.049,
  "peach": 0.050,
  "mango": 0.25,
};

const electionVotes =  _.reduce(election, (pv, val, key) => {
  pv[key] = {"votes": Math.floor(val * 100000)};
  return pv;
}, {});

describe("mmp.js - tools for MMP calculation", function(){
  describe('beatThreshholdEh()', function(){
    it('correctly determines if a party has beat the threshhold', function(){
      expect(beatThreshholdEh(0.1, 0.05)).to.equal(true);
      expect(beatThreshholdEh(0.05, 0.05)).to.equal(true);
      expect(beatThreshholdEh(0.049, 0.5)).to.equal(false);
    });
  });
  describe('partiesPastThreshhold()', function(){
    it('correctly finds the parties past thresshold', function(){
      expect(partiesPastThreshhold(election, 0.05)).to.eql({
        "apple": 0.1,
        "pear": 0.2,
        "banana": 0.3,
        "grape": 0.051,
        "peach": 0.050,
        "mango": 0.25,
      });
      expect(partiesPastThreshhold(election, 0.15)).to.eql({
        "pear": 0.2,
        "banana": 0.3,
        "mango": 0.25,
      });
    });
  });
  describe("mmpFindWastage()", function(){
    it('finds the amount of wastage in an MMP election for different threshholds', function(){
      expect(mmpFindWastage(election, 0.05)).to.equal(0.049);
      expect(mmpFindWastage(election, 0.15)).to.equal(0.25);
    });
  });
  describe('mmpReassignWastage()', function(){
    it('reassigns the wastage proportionally to each party', function(){
      expect(mmpReassignWastage({
        "pear": 0.2,
        "banana": 0.3,
        "mango": 0.25,
      }, 0.25)).to.eql({
        "pear": 0.2833333333333333,
        "banana": 0.3833333333333333,
        "mango": 0.3333333333333333,
      });
    });
  });
  describe('mmpAssignSeats()', function(){
    it('assigns seats proportionally', function(){
      expect(mmpAssignSeats({
        "banana": 0.3833333333333333,
        "mango": 0.3333333333333333,
        "pear": 0.2833333333333333,
      }, 338)).to.eql({
        banana: 130,
        mango: 113,
        pear: 95,
      });
    });
  });
  describe('mapSeatsByParty (from sample)', function() {
    it('correctly takes document records and assigns the correct seats', function() {
      expect(mmpSeatsByParty([electionVotes], 500, 0.05))
        .to.eql({
          "apple": 54,
          "banana": 155,
          "grape": 29,
          "mango": 129,
          "peach": 29,
          "pear": 105,
        });


      expect(mmpSeatsByParty([electionVotes], 500, 0.1))
        .to.eql({
          "apple": 68,
          "banana": 168,
          "mango": 143,
          "pear": 118,
        });
    });
  });

  describe('mapSeatsByParty (from DB)', function(){
    let docs;
    before(function(done) {
      this.timeout(30000);
      controller().getEveryRecord()
        .then((documents) => {
          docs = documents;
          return docs;
        })
        .then(() => done());
    });
    it('correctly takes document records and assigns the correct seats', function(){
      expect(mmpSeatsByParty(docs, 338, 0.025))
        .to.eql({
          "Conservative": 108,
          "Liberal": 133,
          "NDP-New Democratic Party": 68,
          "Green Party": 13,
          "Bloc Québécois": 17,
        });
      expect(mmpSeatsByParty(docs, 338, 0.05))
        .to.eql({
          "Conservative": 117,
          "Liberal": 144,
          "NDP-New Democratic Party": 77,
        });
    });
  });
});
