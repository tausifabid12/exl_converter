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
  // Convert the JSON data to a string
  const jsonString = JSON.stringify(jsonData, null, 2);

  // Write the JSON data to a file
  fs.writeFileSync(outputFile, jsonString, 'utf-8');
}

// excelToJson('input.xlsx', 'output.json');


const newData = []
const unMatchedData = []


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

const keys = readJsonFile('outputKey.json');
// const collegedata = readJsonFile('collegedata.json');
let collegedata: any





//exal
const exalData = readJsonFile('output.json');
const exalDataLength = exalData.length

async function getcollege() {
  const response = await fetch("http://localhost:4000/", {
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

  const { data } = await response.json();
  collegedata = data
  console.log(data, 'this i sdata')
  return data;
}

const UpdateCollege = async () => {
  const data = await getcollege()
  const collegeData = data?.campuses
  console.log(collegeData, 'collegeData', data)
}

UpdateCollege()




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
async function updateCollege(id: string, name: string, where: string) {
  const response = await fetch("http://localhost:4000/", {
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

  const { data } = await response.json();
  console.log(data, 'exam')
  return data;

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


