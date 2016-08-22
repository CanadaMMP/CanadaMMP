// this probably should be refactored out to multiple files, but we
// can do that as it grows.

import mongodb, { MongoClient } from 'mongodb'


const MONGO_URL = 'mongodb://localhost:27017/test';

const mongoConnect = (fn, ...params) => new Promise((resolve, reject) => {
  MongoClient.connect(MONGO_URL, (err, db) => {
    if (err) {
      return reject(err);
    }
    console.log("Connected to database");
    return fn(db, ...params)
    .then((resolution) => {
      resolve(resolution);
      console.log("Closed connection to database")
      db.close();
    })
    .catch((rejection) => {
      reject(rejection)
      console.log("Closed connection to database")
      db.close();
    })
  })
})

const insertDocuments = (db, documents) => new Promise((resolve, reject) => {
  let collection = db.collection('documents');
  collection.insertMany(documents, (err, result) => {
    if (err) {
      reject(err);
    } else {
      console.log("Inserted 3 documents");
      resolve(result);
    }
  })
})


mongoConnect(insertDocuments, [{candidate: "CLINTON"}, {candidate: "SANDERS"}, {candidate: "O'MALLEY"}])
  .then((response) => {
    console.log("Response from the server");
    console.log(response);
  })
  .catch((rejection) => {
    console.log("Rejection from the server");
    console.log(rejection);
  })
