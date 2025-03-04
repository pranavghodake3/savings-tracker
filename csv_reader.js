const csv = require('csv-parser')
const fs = require('fs')
const results = [];

fs.createReadStream('data.csv')
  .pipe(csv(
    {
      headers: false
    }
  ))
  .on('data', (data) => results.push(data))
  .on('end', () => {
    console.log(results);
  });

function readCSV() {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream('data.csv')  // Replace 'your-file.csv' with your CSV file's path
      .pipe(csv())  // Set headers: false to treat all rows as data
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))  // Resolve the promise with parsed data
      .on('error', (err) => reject(err));  // Reject the promise on error
  });
}

async function main() {
  try {
    const data = await readCSV();  // Wait for the CSV data to be parsed
    console.log(data);  // Do something with the parsed CSV data
  } catch (err) {
    console.error('Error reading CSV file:', err);
  }
}

main();
