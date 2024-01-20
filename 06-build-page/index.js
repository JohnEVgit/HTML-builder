const fs = require('node:fs');
const path = require('node:path');
const fsPromises = fs.promises;

const projectDistPass = path.join(__dirname, 'project-dist');
const mainComponentsPass = path.join(__dirname, 'components');
const mainStylePass = path.join(__dirname, 'styles');

const mainAssetsPass = path.join(__dirname, 'assets');
const copyAssetsPass = path.join(__dirname, 'project-dist', 'assets');

const makeHtmlDist = () => {
  const templateFile = path.join(__dirname, 'template.html');
  const htmlStream = fs.createReadStream(templateFile, 'utf-8');
  let htmlTemlateData = '';

  htmlStream.on('data', (chunk) => (htmlTemlateData += chunk));

  htmlStream.on('end', () => {
    fsPromises
      .readdir(mainComponentsPass, { withFileTypes: true })
      .then((filenames) => {
        for (let filename of filenames) {
          const filePass = path.join(__dirname, 'components', filename.name);
          const componentsStream = fs.createReadStream(filePass, 'utf-8');

          const extName = path.extname(filename.name);
          const fileName = filename.name.replace(extName, '');

          if (filename.isFile() && extName === '.html') {
            componentsStream.on('data', (chunk) => {
              htmlTemlateData = htmlTemlateData.replace(
                `{{${fileName}}}`,
                chunk,
              );
            });
          }

          componentsStream.on('end', () => {
            const fileBundle = path.join(
              __dirname,
              'project-dist',
              'index.html',
            );
            fs.writeFile(fileBundle, htmlTemlateData, () => {});
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

const makeStylesDist = () => {
  fsPromises
    .readdir(mainStylePass, { withFileTypes: true })
    .then((filenames) => {
      let stylesData = '';

      for (let filename of filenames) {
        const filePass = path.join(__dirname, 'styles', filename.name);
        const stylesStream = fs.createReadStream(filePass, 'utf-8');

        const extName = path.extname(filename.name);

        if (filename.isFile() && extName === '.css') {
          stylesStream.on('data', (chunk) => (stylesData += chunk));
        }

        stylesStream.on('end', () => {
          const fileBundle = path.join(__dirname, 'project-dist', 'style.css');
          fs.writeFile(fileBundle, stylesData, () => {});
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const makeAssetsDist = (mainPass, copyPass) => {
  fsPromises
    .mkdir(copyPass, { recursive: true })
    .then(() => {
      fsPromises
        .readdir(mainPass, { withFileTypes: true })
        .then((filenames) => {
          for (let filename of filenames) {
            const mainDirFile = path.join(mainPass, filename.name);
            const copyDirFile = path.join(copyPass, filename.name);

            if (filename.isFile()) {
              fsPromises.copyFile(mainDirFile, copyDirFile);
            } else {
              makeAssetsDist(mainDirFile, copyDirFile);
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

fsPromises
  .rm(projectDistPass, { recursive: true, force: true })
  .then(() => {
    fsPromises
      .mkdir(projectDistPass, { recursive: true })
      .then(() => {
        makeHtmlDist();
        makeStylesDist();
        makeAssetsDist(mainAssetsPass, copyAssetsPass);
      })
      .catch((err) => {
        console.log(err);
      });
  })
  .catch((err) => {
    console.log(err);
  });
