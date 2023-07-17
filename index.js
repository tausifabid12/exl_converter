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
const exalDataLength = exalData.length;
function getcollege() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch("http://127.0.0.1:4000/", {
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
        console.log(data, 'this i sdata');
        return data;
    });
}
const UpdateCollege = () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield getcollege();
    const collegeData = data === null || data === void 0 ? void 0 : data.campuses;
    console.log(collegeData, 'collegeData');
});
UpdateCollege();
// for (let i = 0; i < exalData.length; i++) {
//   const string1 = exalData[i][4];
//   for (let j = 0; j < collegedata.length; j++) {
//     const string2 = collegedata[j].name;
//     const isMatch = fuzzySearch(string1, string2);
//     if (isMatch) {
//       const strr = string1.split(' (Id:')
//       const id = strr[1].slice(1, -1)
//       updateCollege(id, string1, collegedata[j]?.name)
//       const updattedData = { ...collegedata[j], name: string1, id: id }
//       newData.push(updattedData)
//     }
//     else {
//       unMatchedData.push(collegedata[j]?.name)
//     }
//   }
// }
// console.log(newData, newData.length, 'newData')
// console.log(unMatchedData, unMatchedData.length, 'unMatchedData')
// const mergedArray = [...newData, ...collegedata];
// const uniqueArray = mergedArray.filter(
//   (item, index, self) =>
//     index ===
//     self.findIndex(
//       (t) => t.link === item.link && t.name === item.name
//     )
// );
// console.log(uniqueArray.length, 'uniqueArray');
// //geting exams
function updateCollege(id, name, where) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch("http://localhost:4000/", {
            method: "POST",
            body: JSON.stringify({
                query: `mutation UpdateCampuses($update: CampusUpdateInput) {
        updateCampuses(update: $update) {
          campuses {
            is_main
            name
          }
        }
      }`,
                variables: {
                    update: {
                        id: id,
                        name: name
                    },
                    where: {
                        name: where
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
// async function update3(id: string, name: string, where: string) {
//   const response = await fetch("http://localhost:4000/", {
//     method: "POST",
//     body: JSON.stringify({
//       query: `mutation UpdateCampuses($where: CampusWhere, $update: CampusUpdateInput) {
//         updateCampuses(where: $where, update: $update) {
//           campuses {
//             name
//             id
//           }
//         }
//       }`,
//       variables: {
//         where: {
//           collegeHas: {
//             name: null
//           }
//         },
//         update: {
//           name: null
//         }
//       }
//     }),
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
//   const { data } = await response.json();
//   console.log(data, 'exam')
//   return data;
// }
// const UpdateCollege = async () => {
//   const data = await getcollege()
//   const collegeData = data?.campuses
//   console.log(collegeData, 'collegeData')
// }
// UpdateCollege()
// getExams()
// Usage example
// const string1 = 'Aalim Muhammed Salegh College of Engineering,Chennai';
// const string2 = 'Aalim Muhammed Salegh 3243  Engineering ';
// const isMatch = fuzzySearch(string1, string2);
// console.log(`Match found: ${isMatch}`);
