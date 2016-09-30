
getFileNames()
  .then((filenames) => readJsons(filenames))
  .then((data) => insertDocuments(data.map((datum) => JSON.parse(datum))))
  .catch((err) => console.log(err))
