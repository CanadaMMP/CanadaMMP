import mongodb from 'mongodb';

const MongoClient = mongodb.MongoClient;

const mongoURL = 'mongodb://localhost:27017/testDatabase';

const mongoInsertMany = (conn, collection, data) => new Promise((resolve, reject) => {
  let coll = db.collection(collection);
  coll.insertMany(data, (err, result) => {
    if(err) {
      reject(err);
    } else {
      resolve(result);
    }
  })
})

const sendToDatabase = (text, username, password) => new Promise((resolve, reject) => {
  MongoClient.connect(mongoURL, (err, conn) => {
    mongoInsertMany(conn, 'login', [{text, username, password}])
      .then((result) => resolve(result))
      .catch((err) => reject(err))
      .finally(() => db.close())
    })
})
