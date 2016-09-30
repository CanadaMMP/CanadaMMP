import fsImport from 'fs';
import mongodb from 'mongodb';
import spinner from 'cli-spinner';

const Spinner = spinner.Spinner;
const spin = new Spinner('processing.. %s');
spin.setSpinnerString('|/-\\');
// hmm, maybe some of this readJSOn stuff belongs in ./readJson.js; and this should only be Mongo stuff
export default ( // ES6 makes mocking/stubbing easy!
  mongoURL = 'mongodb://localhost:27017/test',
  jsonFileDir = './out/',
  collectionName = 'election2015',
  MongoClient = mongodb.MongoClient,
  fs = fsImport) => {

  const getFileNames = () => new Promise(function(resolve, reject) {
    fs.readdir(jsonFileDir, (err, filenames) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(filenames);
    });
  });

  const readJson = (filename) => new Promise((resolve, reject) => {
    fs.readFile(jsonFileDir + filename, 'utf-8', (err, data) => {
      if(err) {
        reject(err);
        throw err;
      }
      resolve(data);
    });
  });

  const readJsons = (filenames) => new Promise((resolve, reject) => {
    Promise.all(filenames.map((filename) => readJson(filename)))
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });

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
    console.log("inserting documents: ", documents);
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
    getFileNames,
    readJson,
    readJsons,
    connectToMongo,
    insertDocuments,
  }
}
