'use strict'

import aws from 'aws-sdk'
import _ from 'underscore'

const options = {
  apiVersion: '2006-03-01',
  params: {
    Bucket: process.env.AWS_BUCKET
  }
}

const params = {
  Key: 'ibp-snapshots'
}

let IbpS3 = function () {

  const S3 = new aws.S3(options)

  function updateSnapshots(countries, name, year) {
    let response
    return new Promise((resolve, reject) => {
      getSnapshots().then((currentSnapshots) => {
        const date = new Date().toISOString()
        const backupKey = `ibp-snapshots-backup-${date}`
        let backupCurrent = S3.copyObject({
                                            CopySource: `${options.params.Bucket}/${params.Key}`,
                                            Key: backupKey,
                                          }).promise()

        backupCurrent.then((res) => {
          response =
            JSON.stringify(res) +
            "\n------------------------------------------------" +
            "\nBacking up old snapshots successful!" +
            "\nBackup is located in " + options.params.Bucket + "/" +
            backupKey +
            "\nContinuing updating the snapshots" +
            "\n------------------------------------------------\n"

          console.log(response)

          const newSnapshot = JSON.stringify(
            currentSnapshots.concat(generateSnapshot(countries, name, year, date)))
          let uploadNew = S3.putObject({
                                         Key: params.Key,
                                         Body: newSnapshot
                                       }).promise()
          uploadNew.then((res) => {
            response =
              JSON.stringify(res) +
              "\n------------------------------------------------" +
              "\nSnapshots updated!"

            resolve(response)
          }).catch((err) => {
            response =
              JSON.stringify(err) +
              "\n------------------------------------------------" +
              "\nError occurred during uploading the new snapshot. See the log above."

            reject(response)
          })
        }).catch((err) => {
          response =
            JSON.stringify(err) +
            "\n------------------------------------------------" +
            "\nError occurred during backing up. See the log above."

          reject(response)
        })
      }).catch((err) => {
        response =
          JSON.stringify(err) +
          "\n------------------------------------------------" +
          "\nError occurred during fetching snapshots. See the log above."

        reject(response)
      })
    })
  }

  function getSnapshots() {
    return new Promise((resolve, reject) => {
      let currentSnapshot = S3.getObject({
                                           Key: params.Key,
                                           ResponseContentType: 'application/json'
                                         }).promise()

      currentSnapshot.then((data) => {
        resolve(JSON.parse(data.Body.toString()))
      }).catch((err) => {
        reject(err)
      })
    })
  }

  function generateSnapshot(countries, name, year, date) {
    let snapshot = []
      , countrySnap = {}

    _.forEach(countries, country => {
      try {
        if (!country.obi.availability[year]) {
          console.log(`${country.country} doesn't contain OBI Availability for ${year}`)
          return
        }

        countrySnap = {
          code: country.code
          , date: date
          , name: name
          , snapshot: country.obi.availability[year]
        }

        snapshot.push(countrySnap)
      } catch(err) {
        console.log(`${country.country} doesn't contain OBI Availability for ${year}`)
      }
    })

    return snapshot
  }

  function setSnapshot(countries, name, year) {
    let response
    const date = new Date().toISOString()
        , snapshot = generateSnapshot(countries, name, year, date)

    return new Promise((resolve, reject) => {
      let setSnapshot = S3.putObject({
                                       Key: params.Key
                                     , Body: JSON.stringify(snapshot)
                                     }).promise()
      setSnapshot.then(res => {
        response =
          JSON.stringify(res) +
          "\n------------------------------------------------" +
          "\nSnapshot successfuly saved!" +
          "\nSnapshot is located in " + options.params.Bucket + "/" + params.Key

        resolve(response)
      }).catch(err => {
        response =
          JSON.stringify(err) +
          "\n------------------------------------------------" +
          "\nError occurred during saving the snapshot. See the log above."

        reject(response)
      })
    })
  }

  return {
    getSnapshots: getSnapshots,
    updateSnapshots: updateSnapshots,
    setSnapshot: setSnapshot
  }
}

export default new IbpS3()
