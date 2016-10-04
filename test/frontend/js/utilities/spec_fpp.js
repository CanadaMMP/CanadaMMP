import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;
import controller from '../../../../src/backend/js/db/controller';
import provinces from '../../../../src/utils/provinces';
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
  voteWastageByParty,
  proportionOfSeatsByParty,
  filterDataByProvince,
} from '../../../../src/frontend/js/utilities/fpp';
import correctData from '../../../examples/correctData';
import expectedVoteWastageByParty from '../../../examples/voteWastageByPartySample';


describe("fpp.js", function() {
  let recordsFromDB;
  before(function(done) {
    controller().getEveryRecord().then((documents) => {
      recordsFromDB = documents;
      return recordsFromDB;
    }).then(() => {
      done();
    });
  });

  describe('popularVoteByParty()', function() {
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
    describe('provincial results', function(){
      for(let province in provinces){
        it('has data for ' + province, function(){
          expect(fppDataResults.byProvince[province]).to.be.an('object');
        });
      }
      it('has the right data for New Brunswick (rep. sample)', function(){
        let expected = {
          "seatsByParty": {
            "Liberal": 10
          },
          "proportionOfSeatsByParty": {
            "Liberal": 1
          },
          "provincePopularVoteByParty": {
            "Independents": 296,
            "Green Party": 20551,
            "Liberal": 227764,
            "Conservative": 112070,
            "NDP-New Democratic Party": 81105
          },
          "proportionOfProvincePopularVoteByParty": {
            "Independents": 0.0006700076507630391,
            "Green Party": 0.04651799740145681,
            "Liberal": 0.5155527789472731,
            "Conservative": 0.25367485615207364,
            "NDP-New Democratic Party": 0.1835843598484334
          },
          "totalVotesCast": 441786,
          "provincePopularVoteWastage": 307968,
          "provincePopularVoteWastagePc": 0.6970976898317285
        };
        expect(fppDataResults.byProvince["New Brunswick"]).to.eql(expected);
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
      "winner": {
        "party": "Liberal",
        "familyName": "McDonald",
        "middleName": "",
        "firstName": "Ken",
        "votes": 23528
      },
      "losers": [
        {
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
      ],
      "winnerWaste": 16027,
      "winnerWastePc": 0.6811883713022782,
      "totalVotes": 42086,
      "totalWaste": 34584,
      "totalWastePc": 0.821745948771563
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
  describe('popularVoteWastagePc()', function(){
    it('calculates the national vote wastage percentage', function(){
      expect(popularVoteWastagePc(recordsFromDB)).to.eql(0.7009396828053236);
    });
  });
  describe('filterDataByProvince()', function(){
    it('correctly filters the data by province', function(){
      expect(filterDataByProvince(recordsFromDB, 'Ontario')).to.have.length(121);
    });
  });
  describe('voteWastageByParty()', function(){
    it('correctly calculates the vote wastage for each party,', function(){
      expect(voteWastageByParty(recordsFromDB)).to.eql(expectedVoteWastageByParty);
    });
  });
});
