var fs = require('fs');

// var parseCSV = (document) => {
//   var lines = document.split('\n')
//   var headers = lines[0].split(',');
//   var results = lines.slice(1).map((line) => line.split(','))
//   var mapped = headers.reduce((pv, header, index) => {
//     var o = {}
//     o[header] = results.map((result) => result[index])
//     return Object.assign(pv, o)
//   }, {})
//   console.log(mapped);
// }


var readFile = (dirname, filename) => new Promise(function(resolve, reject) {
  fs.readFile(dirname + filename, 'utf-8', (err, content) => {
    if (err) {
      reject(err);
      return;
    }
    var _result = {}
    _result[filename] = content;
    resolve(_result)
  });
});

var getFileNames = (dirname) => new Promise(function(resolve, reject) {
  fs.readdir(dirname, (err, filenames) => {
    if(err){
      reject(err);
      return;
    }
    resolve(filenames);
  })
});

var getAllFiles = (dirname) => new Promise(function(resolve, reject) {
  getFileNames(dirname)
    .then((filenames) => Promise.all(filenames.map((filename) => readFile(dirname, filename))))
    .then((values) => values.reduce((pv, cv) => Object.assign(pv, cv), {}))
    .then((final) => console.log(JSON.stringify(final, null, 2)))
    .catch((err) => console.log("ERR:\n", err))
})



getAllFiles('./src/data/byDistrict/')
