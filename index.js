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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    // Convert the JSON data to a string
    const jsonString = JSON.stringify(jsonData, null, 2);
    // Write the JSON data to a file
    fs.writeFileSync(outputFile, jsonString, 'utf-8');
}
// excelToJson('input.xlsx', 'output.json');
const newData = [];
const unMatchedData = [];
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
const keys = readJsonFile('outputKey.json');
// const collegedata = readJsonFile('collegedata.json');
let collegedata;
//exal
const exalData = readJsonFile('output.json');
function getcollege() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch("https://mycollegeindia.as.r.appspot.com/graphql", {
            method: "POST",
            body: JSON.stringify({
                query: `
      query Campuses {
        campuses {
          id
          name
        }
      }
      `
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const { data } = yield response.json();
        collegedata = data;
        return data;
    });
}
function updateCollege(id, name, where) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch("http://localhost:4000/", {
            method: "POST",
            body: JSON.stringify({
                query: `
      mutation UpdateCampuses($where: CampusWhere, $update: CampusUpdateInput) {
          updateCampuses(where: $where, update: $update) {
            campuses {
              name
            }
          }
        }`,
                variables: {
                    "where": {
                        "name": where
                    },
                    "update": {
                        "id": id
                    }
                }
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const { data } = yield response.json();
        console.log(data, 'exam');
        return data;
    });
}
const all = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const data = yield getcollege();
    const collegeData = data === null || data === void 0 ? void 0 : data.campuses;
    let count = 1;
    for (let i = 0; i < exalData.length; i++) {
        const string1 = exalData[i][4];
        for (let j = 0; j < collegeData.length; j++) {
            const string2 = collegeData[j].name;
            const isMatch = fuzzySearch(string1, string2);
            if (isMatch) {
                count++;
                const strr = string1.split(' (Id:');
                const id = strr[1].slice(1, -1);
                console.log(id, 'id', (_a = collegeData[j]) === null || _a === void 0 ? void 0 : _a.name);
                updateCollege(id, string1, (_b = collegeData[j]) === null || _b === void 0 ? void 0 : _b.name);
            }
        }
    }
    console.log(count);
});
all();
// //geting exams
