const fs = require('node:fs');
const path = require('node:path');
const { stdin, stdout } = process;

const textFile = path.join(__dirname, 'text.txt');
const output = fs.createWriteStream(textFile);

stdout.write('Калі ласка, увядзіце тэкст:\n');

stdin.on('data', (data) => {
  const dataStringified = data.toString().trim();

  if (dataStringified === 'exit') {
    process.exit();
  } else {
    output.write(data);
  }
});

process.on('SIGINT', () => process.exit());

process.on('exit', () =>
  stdout.write(
    '«Рабі нечаканае, рабі, як не бывае, рабі, як не робіць ніхто, — і тады пераможаш» - Уладзімір Караткевіч',
  ),
);
