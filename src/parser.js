import fs from 'fs';

const parseCSV = (document) => {
    let lines = document.split('\n')
    let headers = lines[0].split(',');
    let results = lines.slice(1).map((line) => line.split(','))
    return results.map((result) => {
        let data = {}
        for (let n = 0; n < result.length; n++) {
            data[headers[n]] = result[n];
        }
        return data;
    })
}

const readFile = (dirname, filename) => new Promise(function(resolve, reject) {
    fs.readFile(dirname + filename, 'utf-8', (err, content) => {
        if (err) {
            reject(err);
            return;
        }
        resolve({
            filename: filename,
            content: content,
        })
    });
});
const writeFile = ({filename, content}) => new Promise(function(resolve, reject) {
    fs.appendFile("./out/" + filename + ".json", JSON.stringify(
        parseCSV(content), null, 2), (err) => {
        if (err) {
            reject(err);
        } else {
            resolve(true);
        }
    })
});

const readNWrite = ({dirname, filename}) => new Promise(function(resolve, reject) {
    readFile(dirname, filename)
      .then(({filename, content}) => writeFile({filename, content}))
      .then(resolve).catch((x) => reject(x))
});

const getFileNames = (dirname) => new Promise(function(resolve, reject) {
    fs.readdir(dirname, (err, filenames) => {
        if (err) {
            reject(err);
            return;
        }
        resolve(filenames);
    })
});

const stagger = (arrayOfArgs, thenable) => new Promise(function(resolve, reject) {
    if (arrayOfArgs.length <= 0) {
        resolve(true)
        return;
    }
    let file = arrayOfArgs.shift();
    thenable(file).then((successEh) => {
        if (!successEh) {
            reject("Error: File did not successfully write");
        } else {
            stagger(arrayOfArgs, thenable).then(() => resolve())
        }
    })
});

const getAllFiles = (dirname) => new Promise(function(resolve, reject) {
    getFileNames(dirname)
      .then((filenames) => stagger(filenames.map((filename) => ({dirname, filename})), readNWrite))
      .then((x) => console.log(x)).catch((e) => console.log("e:", e))
})
const writeOutput = (stuffToWrite) => new Promise(function(resolve, reject) {
    fs.appendFile('output.txt', JSON.stringify(stuffToWrite, null, 2), (
        err) => {
        if (err) {
            reject(err);
        } else {
            resolve(true)
        }
    })
});


getAllFiles('./src/data/byDistrict/')
