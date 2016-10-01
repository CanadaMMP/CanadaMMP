import mongodb from 'mongodb';

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

  const getEveryRecord = () => new Promise((resolve, reject) => {
    connectToMongo()
      .then((db) => {
        db.collection('election2015').find({}).toArray((err, docs) => {
          if (err) {
            db.close();
            reject(err);
          }
          db.close();
          resolve(docs);
        });
      });
  });

  return {
    connectToMongo,
    getEveryRecord,
  };
};
