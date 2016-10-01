import dbloader from './utils/dbloader';
import fileProcessors from './utils/fileProcessors';
const {insertDocuments} = dbloader();
const {getFileNames, readJsons} = fileProcessors();


getFileNames('./out/')
  .then((filenames) => readJsons('./out/', filenames))
  .then((data) => insertDocuments(data.map((datum) => JSON.parse(datum))))
  .catch((err) => console.log(err))
  .then(() => {
    console.log("done");
  });
