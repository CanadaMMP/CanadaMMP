import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;
import controller from '../../../../src/backend/js/db/controller';
import {fppData, popularVoteByParty, proportionOfPopularVoteByParty, seatsByParty, findWinner, proportionOfSeatsByParty } from  '../../../../src/frontend/js/utilities/fpp';
import correctData from '../../../examples/correctData';

describe('popularVoteByParty()', function(){
  it('finds the correct totals for each party\'s popular vote totals', function(done){
    expect(controller().getEveryRecord()
      .then((docs) => popularVoteByParty(docs)))
      .to.eventually.eql(correctData.partyTotals).notify(done);
  });
});

describe('seatsByParty()', function(){
  it('finds the correct totals for each party\'s seat totals', function(done){
    expect(controller().getEveryRecord()
      .then((docs) => seatsByParty(docs)))
      .to.eventually.eql({
        "Bloc Québécois": 10,
        "Conservative": 99,
        "Green Party": 1,
        "Liberal": 184,
        "NDP-New Democratic Party": 44
      }).notify(done);
  });
});

describe('findWinner()', function(){
  it('finds the correct winner in each election', function(done){
    expect(controller().getEveryRecord()
      .then((docs) => docs.map((doc) => findWinner(doc))))
      .to.eventually.eql(correctData.winnerList).notify(done);
  });
});

describe('proportionOfSeatsByParty()', function(){
  it('finds the correct proportion of seats', function(done){
    expect(controller().getEveryRecord()
      .then((docs) => proportionOfSeatsByParty(docs)))
      .to.eventually.eql({
        "Liberal": 0.5443786982248521,
        "NDP-New Democratic Party": 0.1301775147928994,
        "Conservative": 0.29289940828402367,
        "Bloc Québécois": 0.029585798816568046,
        "Green Party": 0.0029585798816568047
      }).notify(done);
  });
});

describe('proportionOfPopularVoteParty()', function(){
  it('finds the correct proportion of seats', function(done){
    expect(controller().getEveryRecord()
      .then((docs) => proportionOfPopularVoteByParty (docs)))
      .to.eventually.eql({
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
      }).notify(done);
  });
});

describe("fppData()", function(){
  let data = null;
  before(function(done){
    this.timeout(30000);
    controller().getEveryRecord()
      .then((documents) => {
        data = fppData(documents);
        return data;
      })
      .then(() => done());
  });
  it('finds all of the above', function() {
    expect(data).to.be.an('object');
  });
  it('has the right seatsByParty', function(){
    expect(data.seatsByParty).to.eql({
      "Bloc Québécois": 10,
      "Conservative": 99,
      "Green Party": 1,
      "Liberal": 184,
      "NDP-New Democratic Party": 44
    });
  });
  it('has the right proportionOfSeatsByParty', function(){
    expect(data.proportionOfSeatsByParty).to.eql({
      "Liberal": 0.5443786982248521,
      "NDP-New Democratic Party": 0.1301775147928994,
      "Conservative": 0.29289940828402367,
      "Bloc Québécois": 0.029585798816568046,
      "Green Party": 0.0029585798816568047
    });
  });
  it('has the right proportionOfPopularVoteByParty', function(){
    expect(data.proportionOfPopularVoteByParty).to.eql({
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
  it('has the right popularVoteByParty', function(){
    expect(data.popularVoteByParty).to.eql(correctData.partyTotals);
  });
});
