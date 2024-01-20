const fs = require('node:fs');
const path = require('node:path');

const mainPass = path.join(__dirname, 'secret-folder');

fs.promises
  .readdir(mainPass)
  .then((filenames) => {
    for (let filename of filenames) {
      const filePass = path.join(__dirname, 'secret-folder', filename);
      const fileName = filename.split('.')[0];
      const extName = path.extname(filename).slice(1);

      fs.stat(filePass, (err, stats) => {
        if (!stats.isDirectory()) {
          const fileSize = stats.size / 1000;

          console.log(`${fileName} - ${extName} - ${fileSize}kb`);
        }
      });
    }
  })

  .catch((err) => {
    console.log(err);
  });
