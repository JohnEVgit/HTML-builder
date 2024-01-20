const fs = require('node:fs');
const path = require('node:path');
const { stdout } = process;

const textFile = path.join(__dirname, 'text.txt');
const stream = fs.createReadStream(textFile, 'utf-8');

let data = '';

stream.on('data', (chunk) => (data += chunk));
stream.on('end', () => stdout.write(data));
stream.on('error', (error) => console.log('Error', error.message));
