"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const xlsx = __importStar(require("xlsx"));
// Function to convert Excel file to JSON
function excelToJson(inputFile, outputFile) {
    // Read the Excel file
    const workbook = xlsx.readFile(inputFile);
    // Select the first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    console.log('converting');
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
function readJsonFile(filePath) {
    // Read the JSON file
    const fileData = fs.readFileSync(filePath, 'utf-8');
    // Parse the JSON data
    const jsonData = JSON.parse(fileData);
    return jsonData;
}
function fuzzySearch(string1, string2) {
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
console.log('JSON data:', keys);
const collegedata = readJsonFile('collegedata.json');
const CollegeName = (_a = collegedata[0]) === null || _a === void 0 ? void 0 : _a.name;
try {
    const jsonData = readJsonFile('output.json');
    console.log('JSON data:', jsonData[2][4]);
}
catch (error) {
    console.error('Error reading JSON file:', error);
}
// Usage example
// const string1 = 'Aalim Muhammed Salegh College of Engineering,Chennai';
// const string2 = 'Aalim Muhammed Salegh 3243  Engineering ';
// const isMatch = fuzzySearch(string1, string2);
// console.log(`Match found: ${isMatch}`);
