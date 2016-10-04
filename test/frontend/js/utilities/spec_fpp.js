import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;
import controller from '../../../../src/backend/js/db/controller';
import {
  ridingResultsInOrder,
  ridingVoteWastage,
  findWinner,
  popularVoteByParty,
  totalVotesCast,
  popularVoteWastage,
  popularVoteWastagePc,
  fppData,
  proportionOfPopularVoteByParty,
  seatsByParty,
  proportionOfSeatsByParty
} from '../../../../src/frontend/js/utilities/fpp';
import correctData from '../../../examples/correctData';

describe("fpp.js", function() {
  let recordsFromDB;
  before(function(done) {
    controller().getEveryRecord().then((documents) => {
      recordsFromDB = documents;
      console.log(Array.isArray(recordsFromDB));
      return recordsFromDB;
    }).then(() => {
      done();
    });
  });

  describe('opularVoteByParty()', function() {
    it('finds the correct totals for each party\'s popular vote totals', function() {
      expect(popularVoteByParty(recordsFromDB)).to.eql(correctData.partyTotals);
    });
  });

  describe('seatsByParty()', function() {
    it('finds the correct totals for each party\'s seat totals', function() {
      expect(seatsByParty(recordsFromDB)).to.eql({"Bloc Québécois": 10, "Conservative": 99, "Green Party": 1, "Liberal": 184, "NDP-New Democratic Party": 44});
    });
  });

  describe('findWinner()', function() {
    it('finds the correct winner in each election', function() {
      expect(recordsFromDB.slice(0, 5).map((doc) => findWinner(doc))).to.eql([
        {
          "party": "Liberal",
          "familyName": "McDonald",
          "middleName": "",
          "firstName": "Ken",
          "votes": 23528
        }, {
          "party": "Liberal",
          "familyName": "Foote",
          "middleName": "",
          "firstName": "Judy M.",
          "votes": 28704
        }, {
          "party": "Liberal",
          "familyName": "Simms",
          "middleName": "",
          "firstName": "Scott",
          "votes": 26523
        }, {
          "party": "Liberal",
          "familyName": "Jones",
          "middleName": "",
          "firstName": "Yvonne",
          "votes": 8878
        }, {
          "party": "Liberal",
          "familyName": "Hutchings",
          "middleName": "",
          "firstName": "Gudie",
          "votes": 30889
        }
      ]);
    });

    describe('proportionOfSeatsByParty()', function() {
      it('finds the correct proportion of seats', function() {
        expect(proportionOfSeatsByParty(recordsFromDB)).to.eql({"Liberal": 0.5443786982248521, "NDP-New Democratic Party": 0.1301775147928994, "Conservative": 0.29289940828402367, "Bloc Québécois": 0.029585798816568046, "Green Party": 0.0029585798816568047});
      });
    });

    describe('proportionOfPopularVoteParty()', function() {
      it('finds the correct proportion of seats', function() {
        expect(proportionOfPopularVoteByParty(recordsFromDB)).to.eql({
          "Independents": 0.0028204581902999794,
          "NDP-New Democratic Party": 0.19721878810796234,
          "Conservative": 0.3191111168209498,
          "Green Party": 0.03427417200201825,
          "Forces et Démocratie - Allier les forces de nos régions": 0.00047034164516571327,
          "Liberal": 0.3946763851658088,
          "Communist": 0.0002497233317878872,
          "Christian Heritage Party": 0.0008658742976993165,
          "Marxist-Leninist": 0.0005024026420080462,
          "Rhinoceros": 0.00041287060295365914,
          "Libertarian": 0.002090502054746085,
          "Bloc Québécois": 0.046678537572873394,
          "ATN": 0.00000773102051517247,
          "United Party": 0.000003240207127682579,
          "Animal Alliance/Environment Voters": 0.00009658091070057371,
          "CAP": 0.000022795141371942352,
          "PC Party": 0.0002544415281317057,
          "Radical Marijuana": 0.00008850881575090834,
          "Pirate": 0.00005161593108659266,
          "PACT": 0.000005172962256475696,
          "Seniors Party": 0.00000892478103589763,
          "The Bridge": 0.000006935180168022362,
          "Canada Party": 0.000015405195291262788,
          "Democratic Advancement": 0.00006747589229051265
        });
      });
    });

    describe("fppData()", function() {
      let fppDataResults;
      before(function(done) {
        fppDataResults = fppData(recordsFromDB);
        done();
      });
      it('finds all of the above', function() {
        expect(fppDataResults).to.be.an('object');
      });
      it('has the right seatsByParty', function() {
        expect(fppDataResults.seatsByParty).to.eql({"Bloc Québécois": 10, "Conservative": 99, "Green Party": 1, "Liberal": 184, "NDP-New Democratic Party": 44});
      });
      it('has the right proportionOfSeatsByParty', function() {
        expect(fppDataResults.proportionOfSeatsByParty).to.eql({"Liberal": 0.5443786982248521, "NDP-New Democratic Party": 0.1301775147928994, "Conservative": 0.29289940828402367, "Bloc Québécois": 0.029585798816568046, "Green Party": 0.0029585798816568047});
      });
      it('has the right proportionOfNationalPopularVoteByParty', function() {
        expect(fppDataResults.proportionOfNationalPopularVoteByParty).to.eql({
          "Independents": 0.0028204581902999794,
          "NDP-New Democratic Party": 0.19721878810796234,
          "Conservative": 0.3191111168209498,
          "Green Party": 0.03427417200201825,
          "Forces et Démocratie - Allier les forces de nos régions": 0.00047034164516571327,
          "Liberal": 0.3946763851658088,
          "Communist": 0.0002497233317878872,
          "Christian Heritage Party": 0.0008658742976993165,
          "Marxist-Leninist": 0.0005024026420080462,
          "Rhinoceros": 0.00041287060295365914,
          "Libertarian": 0.002090502054746085,
          "Bloc Québécois": 0.046678537572873394,
          "ATN": 0.00000773102051517247,
          "United Party": 0.000003240207127682579,
          "Animal Alliance/Environment Voters": 0.00009658091070057371,
          "CAP": 0.000022795141371942352,
          "PC Party": 0.0002544415281317057,
          "Radical Marijuana": 0.00008850881575090834,
          "Pirate": 0.00005161593108659266,
          "PACT": 0.000005172962256475696,
          "Seniors Party": 0.00000892478103589763,
          "The Bridge": 0.000006935180168022362,
          "Canada Party": 0.000015405195291262788,
          "Democratic Advancement": 0.00006747589229051265
        });
      });
    });
    describe('ridingResultsInOrder()', function() {
      it('lists the results in winner-first order', function() {
        let expected = [
          {
            "party": "Liberal",
            "familyName": "McDonald",
            "middleName": "",
            "firstName": "Ken",
            "votes": 23528
          }, {
            "party": "Andrews",
            "familyName": "Andrews",
            "middleName": "",
            "firstName": "Scott",
            "votes": 7501
          }, {
            "party": "NDP-New Democratic Party",
            "familyName": "Baldwin",
            "middleName": "",
            "firstName": "Jeannie",
            "votes": 6075
          }, {
            "party": "Conservative",
            "familyName": "Barnett",
            "middleName": "",
            "firstName": "Lorraine E.",
            "votes": 4670
          }, {
            "party": "Green Party",
            "familyName": "Byrne-Puumala",
            "middleName": "",
            "firstName": "Krista",
            "votes": 228
          }, {
            "party": "Forces et Démocratie - Allier les forces de nos régions",
            "familyName": "McCreath",
            "middleName": "",
            "firstName": "Jennifer",
            "votes": 84
          }
        ];

        expect(ridingResultsInOrder(recordsFromDB[0])).to.eql(expected);
      });
    });
    describe("ridingVoteWastage()", function() {
      it('calculates the vote wastage for a district', function() {
        expect(ridingVoteWastage(recordsFromDB[0])).to.eql({
          winner: {
            party: 'Liberal',
            familyName: 'McDonald',
            middleName: '',
            firstName: 'Ken',
            votes: 23528
          },
          winnerWaste: 16027,
          winnerWastePc: 0.6811883713022782,
          totalVotes: 42086,
          totalWaste: 34584,
          totalWastePc: 0.821745948771563
        });
      });
    });
    describe('totalVotesCast', function(){
      it('calculates the total votes cast', function(){
        expect(totalVotesCast(recordsFromDB)).to.equal(17591468);
      });
    });
    describe('popularVoteWastage()', function(){
      it('calculates the national vote wastage', function(){
        expect(popularVoteWastage(recordsFromDB)).to.eql(12330558);
      });
    });
    describe('popularVoteWastage()', function(){
      it('calculates the national vote wastage', function(){
        expect(popularVoteWastagePc(recordsFromDB)).to.eql(0.7009396828053236);
      });
    });
  });
});
