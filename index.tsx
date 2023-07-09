import * as fs from 'fs';
import * as xlsx from 'xlsx';


// Function to convert Excel file to JSON
function excelToJson(inputFile: string, outputFile: string) {
  // Read the Excel file
  const workbook = xlsx.readFile(inputFile);

  // Select the first sheet
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  console.log('converting')
  // Convert the sheet to JSON format


  // Convert the sheet to JSON format
  const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
  console.log(jsonData);

  // Convert the JSON data to a string
  const jsonString = JSON.stringify(jsonData, null, 2);

  // Write the JSON data to a file
  fs.writeFileSync(outputFile, jsonString, 'utf-8');
}

// excelToJson('input.xlsx', 'output.json');



// Function to read JSON file
function readJsonFile(filePath: string): any {
  // Read the JSON file
  const fileData = fs.readFileSync(filePath, 'utf-8');

  // Parse the JSON data
  const jsonData = JSON.parse(fileData);

  return jsonData;
}


function fuzzySearch(string1: string, string2: string): boolean {
  let currentIndex = 0;
  const string2Length = string2.length;

  for (let i = 0; i < string1.length; i++) {
    if (string1[i].toLowerCase() === string2[currentIndex].toLowerCase()) {
      currentIndex++;
      if (currentIndex === string2Length) {
        return true;
      }
    }
  }

  return false;
}




// try {
//   const jsonData = readJsonFile('collegedata.json');
//   console.log('JSON data:', jsonData[0].name);

// } catch (error) {
//   console.error('Error reading JSON file:', error);
// }

const keys = readJsonFile('outputKey.json');
const collegedata = readJsonFile('collegedata.json');
const CollegeName = collegedata[0]?.name

//exal
const exalData = readJsonFile('output.json');
const collegeLength = collegedata.length
const exalDataLength = exalData.length

for (let i = 0; i < exalDataLength; i++) {
  // Usage example
  const string1 = exalData[i][0];
  const string2 = CollegeName;

  const isMatch = fuzzySearch(string1, string2);
  console.log(`Match found: ${isMatch}`);
  console.log(`Match found: ${exalData[i][0]}`, i);

}









// Usage example
// const string1 = 'Aalim Muhammed Salegh College of Engineering,Chennai';
// const string2 = 'Aalim Muhammed Salegh 3243  Engineering ';

// const isMatch = fuzzySearch(string1, string2);
// console.log(`Match found: ${isMatch}`);


