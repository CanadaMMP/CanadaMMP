import fs from 'fs';
import mongodb from 'mongodb';
import spinner from 'cli-spinner';

const Spinner = spinner.Spinner;
const spin = new Spinner('processing.. %s');
spin.setSpinnerString('|/-\\');


const MongoClient = mongodb.MongoClient;

const MONGO_URL = 'mongodb://localhost:27017/test'
var ProgressBar = require('progress');

var bar = new ProgressBar(':bar', { total: 10 });
var timer = setInterval(function () {
  bar.tick();
  if (bar.complete) {
    console.log('\ncomplete\n');
    clearInterval(timer);
  }
}, 100);


export const getFileNames = () => new Promise(function(resolve, reject) {
  fs.readdir('./out/', (err, filenames) => {
    if (err) {
      reject(err);
      return;
    }
    resolve(filenames);
  });
});

export const readJson = (filename) => new Promise((resolve, reject) => {
  fs.readFile('./out/' + filename, 'utf-8', (err, data) => {
    if(err) {
      reject(err);
      throw err;
    }
    resolve(data);
  });
});

export const readJsons = (filenames) => new Promise((resolve, reject) => {
  Promise.all(filenames.map((filename) => readJson(filename)))
    .then((data) => resolve(data))
    .catch((err) => reject(err));
});

const connectToMongo = () => new Promise((resolve, reject) => {
  MongoClient.connect(MONGO_URL, (err, db) => {
    if(err){
      reject(err);
      return;
    }
    console.log("Connected correctly to server");
    resolve(db);
  });
});

const insertDocuments = (documents) => new Promise((resolve, reject) => {
  const TEST_COLLECTION = 'test';
  console.log("inserting documents: ", documents);
  connectToMongo()
    .then((db) => {
      console.log("starting")
      spin.start();
      db.collection(TEST_COLLECTION)
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

// getFileNames()
//   .then((filenames) => readJsons(filenames))
//   .then((data) => console.log(data[0]))

getFileNames()
  .then((filenames) => readJsons(filenames))
  .then((data) => insertDocuments(data.map((datum) => JSON.parse(datum))))
  .then((results) => console.log(results))
  .catch((err) => console.log(err))
  .then(() => console.log("All done."));
