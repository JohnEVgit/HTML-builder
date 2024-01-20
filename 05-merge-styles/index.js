const fs = require('node:fs');
const path = require('node:path');
const fsPromises = fs.promises;

const mainPass = path.join(__dirname, 'styles');

fsPromises
  .readdir(mainPass, { withFileTypes: true })
  .then((filenames) => {
    let data = '';

    for (let filename of filenames) {
      const filePass = path.join(__dirname, 'styles', filename.name);
      const stream = fs.createReadStream(filePass, 'utf-8');

      const extName = path.extname(filename.name);

      if (filename.isFile() && extName === '.css') {
        stream.on('data', (chunk) => (data += chunk));
      }

      stream.on('end', () => {
        const fileBundle = path.join(__dirname, 'project-dist', 'bundle.css');
        fs.writeFile(fileBundle, data, () => {});
      });
    }
  })
  .catch((err) => {
    console.log(err);
  });
