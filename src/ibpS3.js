'use strict'

import aws from 'aws-sdk'
import { getDocumentState } from './aquarium'
import deepmerge from 'deepmerge'
import _ from 'underscore'

const options = {
  region: process.env.AWS_REGION,
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

  function updateSnapshots(documents) {
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
            currentSnapshots.concat(generateSnapshot(documents)))
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

  function generateSnapshot(documents) {
    let snapshot = [],
      countrySnap = {},
      countryDocs,
      date = new Date().toISOString()

    const countries = _.uniq(_.pluck(documents, 'country'))

    _.forEach(countries, (country) => {
      countryDocs = _.where(documents, { country: country })
      _.forEach(countryDocs, (doc) => {
        if (!_.isEmpty(countrySnap)) {
          countrySnap.snapshot =
            deepmerge(countrySnap.snapshot,
                      getDocumentDetails(doc),
                      { arrayMerge: concatMerge })
        } else {
          countrySnap = {
            code: doc.countryCode,
            date: date,
            snapshot: getDocumentDetails(doc)
          }
        }
      })
      snapshot.push(countrySnap)
      countrySnap = {}
    })

    return snapshot
  }

  function setSnapshot(snapshot) {
    let response
    snapshot = JSON.stringify(snapshot)
    return new Promise((resolve, reject) => {
      let setSnapshot = S3.putObject({
                                       Key: params.Key,
                                       Body: snapshot
                                     }).promise()

      setSnapshot.then((res) => {
        response =
          JSON.stringify(res) +
          "\n------------------------------------------------" +
          "\nSnapshot successfuly saved!" +
          "\nSnapshot is located in " + options.params.Bucket + "/" + params.Key

        resolve(response)
      }).catch((err) => {
        response =
          JSON.stringify(err) +
          "\n------------------------------------------------" +
          "\nError occurred during saving the snapshot. See the log above."

        reject(response)
      })
    })
  }

  function concatMerge(destinationArray, sourceArray) {
    return destinationArray.concat(sourceArray)
  }

  function getDocumentDetails(doc) {
    return {
      [doc.year]: {
        [doc.type]: [
          {
            title: doc.title,
            date_published: doc.date_published,
            state: getDocumentState(doc)
          }
        ]
      }
    }
  }

  return {
    getSnapshots: getSnapshots,
    updateSnapshots: updateSnapshots,
    setSnapshot: setSnapshot
  }
}

export default new IbpS3()
