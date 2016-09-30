import readJson from './utils/readJson';
import fs from 'fs';
const {
  getAllFiles
} = readJson();

const inputDir = './data/byDistrict/';
const outputDir = './out/';

const makeOutput = () => new Promise(function(resolve, reject) {
  fs.exists(outputDir, (existsEh) => {
    if(existsEh){
      resolve();
      return;
    }
    fs.mkdir(outputDir, (err) => {
      if(err){
        reject(err);
        return;
      }
      resolve();
    });
  });
});

makeOutput()
  .then(() => getAllFiles(inputDir, outputDir));
