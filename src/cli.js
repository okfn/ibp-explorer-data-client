'use strict'

import {} from 'dotenv/config'
import Indaba from './indaba'
import IbpS3 from './ibpS3'
import GDrive from './gdrive'
import readline from 'readline'
import fs from 'fs'

const dataFolder = '../data'
const firstArgument = process.argv[2]
const secondArgument = process.argv[3]

if (firstArgument === 'upload-base-snapshots') {
  const rl = readline.createInterface({
                                        input: process.stdin,
                                        output: process.stdout
                                      });
  let question =
    "This will overwrite any current snapshots with the" +
    "\ncontents of Indaba snapshots endpoint which was last updated" +
    "\non September 2015." +
    "\n\nAre you sure you want to continue? (yes/No): "

  rl.question(question, (answer) => {
    if (answer === 'yes') {
      Indaba.getSnapshots().then((snapshots) => {
        IbpS3.setSnapshot(snapshots).then((res) => {
          console.log(res)
        }).catch((err) => {
          console.log(err)
        })
      }).catch((err) => {
        console.log(err)
      })
    } else {
      console.log("Exiting.")
    }
    rl.close()
  })
} else if (process.argv[2] === 'update-snapshots') {
  let documents = Indaba.getDocuments()
  let countries = Indaba.getCountries()

  Promise.all([documents, countries]).then((res) => {
    IbpS3.updateSnapshots(res[0], res[1]).then((res) => {
      console.log(res)
    }).catch((err) => {
      console.log(err)
    })
  }).catch((err) => {
    console.log(err)
  })
} else if (firstArgument === 'get-all-data') {
  if (!fs.existsSync(dataFolder)) {
    fs.mkdirSync(dataFolder)
  }

  let docs = Indaba.getDocuments()
  let countries = Indaba.getCountries()
  let snapshots = IbpS3.getSnapshots()
  let gdrive = GDrive.getSpreadsheet(process.env.SPREADSHEET_ID)
  let search = Indaba.getSearchJSON()

  Promise.all([docs, countries, snapshots, gdrive, search]).then((res) => {
    fs.writeFileSync(__dirname + '/../data/documents.json',
                     JSON.stringify(res[0]))
    console.log('Documents downloaded and saved in data folder')
    fs.writeFileSync(__dirname + '/../data/countries.json',
                     JSON.stringify(res[1]))
    console.log('Countries downloaded and saved in data folder')
    fs.writeFileSync(__dirname + '/../data/snapshots.json',
                     JSON.stringify(res[2]))
    console.log('Snapshots downloaded and saved in data folder')
    fs.writeFileSync(__dirname + '/../data/gdrive.json',
                     JSON.stringify(res[3].values))
    console.log('Spreadsheet downloaded and saved in data folder')
    fs.writeFileSync(__dirname + '/../data/search.json', JSON.stringify(res[4]))
    console.log('Search JSON downloaded and saved in data folder')
  }).catch((err) => {
    console.log(err)
  })
} else if (firstArgument === 'populate-gdrive-spreadsheet') {
  if (process.env.SPREADSHEET_ID) {
    GDrive.populateSpreadSheet(process.env.SPREADSHEET_ID)
  } else if (secondArgument) {
    GDrive.populateSpreadSheet(secondArgument)
  } else {
    const rl = readline.createInterface({
                                          input: process.stdin,
                                          output: process.stdout
                                        });
    rl.question('Enter stylesheet id: ', (spreadsheetId) => {
      GDrive.populateSpreadSheet(spreadsheetId)
      rl.close()
    })
  }
} else if (firstArgument === 'generate-search-json') {
  Indaba.getSearchJSON().then((res) => {
    console.log(JSON.stringify(res))
  }).catch((err) => {
    console.log(err)
  })
}
