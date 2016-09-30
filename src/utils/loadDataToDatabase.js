import fs from 'fs';

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
  fs.readFile('./out/' + filename, (err, data) => {
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

getFileNames()
  .then((filenames) => readJsons(filenames))
  .then((data) => console.log(typeof(data[0])))
  .catch((err) => console.log(err))
  .then(() => console.log("All done."));
