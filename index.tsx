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

async function getcollege() {
  const response = await fetch("https://mycollegeindia.as.r.appspot.com/graphql", {
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

  return data;
}



async function updateCollege(id: string, name: string, where: string) {
  const response = await fetch("http://localhost:4000/", {
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

  const { data } = await response.json();
  console.log(data, 'exam')
  return data;

}


const all = async () => {
  const data = await getcollege()
  const collegeData = data?.campuses
  let count = 1

  for (let i = 0; i < exalData.length; i++) {
    const string1 = exalData[i][4];
    for (let j = 0; j < collegeData.length; j++) {

      const string2 = collegeData[j].name;
      const isMatch = fuzzySearch(string1, string2);
      if (isMatch) {
        count++
        const strr = string1.split(' (Id:')
        const id = strr[1].slice(1, -1)
        console.log(id, 'id', collegeData[j]?.name)
        updateCollege(id, string1, collegeData[j]?.name)

      }
    }
  }

  console.log(count)



}

all()





























// //geting exams












