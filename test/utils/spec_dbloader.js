import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;
import dbloader from '../../src/utils/dbloader';
const loader = dbloader("unit", "test", undefined, "unittests");
const {
  connectToMongo,
  insertDocuments,
} = loader;


describe('Database Tests', function() {

  describe('connectToMongo()', function() {
    it('connects to the mongo database', function(done) {
      expect(connectToMongo("mongodb://unit:test@localhost:27017?authMechanism=DEFAULT&authSource=db").then((db) => Object.keys(db))).to.eventually.eql([
        'domain',
        '_events',
        '_eventsCount',
        "_maxListeners",
        "s",
        "serverConfig",
        "bufferMaxEntries",
        "databaseName",
      ]).notify(done);
    });
  });

  describe('insertDocuments()', function(){
    it('should insert a document', function(done){
      expect(insertDocuments([{foo: "bar"}, {baz: "bang"}])
        .then((result) => result.insertedCount)).to.eventually.equal(2).notify(done);
    });
  });
});
