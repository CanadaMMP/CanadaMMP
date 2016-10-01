import mongodb from 'mongodb';
import spinner from 'cli-spinner';

const Spinner = spinner.Spinner;
const spin = new Spinner('processing.. %s');
spin.setSpinnerString('|/-\\');
// hmm, maybe some of this readJSOn stuff belongs in ./readJson.js; and this should only be Mongo stuff.
export default (
  user,
  pass,
  mongoURL = 'mongodb://localhost:27017/test',
  collectionName = 'election2015',
  MongoClient = mongodb.MongoClient) => {


  const connectToMongo = () => new Promise((resolve, reject) => {
    MongoClient.connect(mongoURL, (err, db) => {
      if(err){
        reject(err);
        return;
      }
      resolve(db);
    });
  });

  const insertDocuments = (documents) => new Promise((resolve, reject) => {
    connectToMongo()
      .then((db) => {
        spin.start();
        db.collection(collectionName)
          .insertMany(documents, (err, result) => {
            if (err){
              reject(err);
              return;
            }
            spin.stop();
            resolve(result);
            db.close();
          });
      });
  });

  return {
    connectToMongo,
    insertDocuments,
  };
};
