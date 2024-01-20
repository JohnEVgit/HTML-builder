const fs = require('node:fs');
const path = require('node:path');
const fsPromises = fs.promises;

const mainDir = path.join(__dirname, 'files');
const copyDir = path.join(__dirname, 'files-copy');

fsPromises
  .mkdir(copyDir, { recursive: true })
  .then(function () {
    fsPromises
      .readdir(copyDir)
      .then((filenames) => {
        for (let filename of filenames) {
          const copyDirFile = path.join(__dirname, 'files-copy', filename);

          fsPromises.unlink(copyDirFile);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    fsPromises
      .readdir(mainDir)
      .then((filenames) => {
        for (let filename of filenames) {
          const mainDirFile = path.join(__dirname, 'files', filename);
          const copyDirFile = path.join(__dirname, 'files-copy', filename);

          fsPromises.copyFile(mainDirFile, copyDirFile);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  })
  .catch((err) => {
    console.log(err);
  });
