'use strict'

import aws from 'aws-sdk'
import { getDocumentState } from './aquarium'
import deepmerge from 'deepmerge'
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

  function updateSnapshots(documents, countries) {
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
            currentSnapshots.concat(generateSnapshot(documents, countries)))
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

  function generateSnapshot(documents, countries) {
    let snapshot = [],
      countrySnap = {},
      countryDocs,
      countryObj,
      date = new Date().toISOString()

    const countryNames = _.uniq(_.pluck(documents, 'countryCode')).sort()

    _.forEach(countryNames, (country) => {
      countryDocs = _.where(documents, { countryCode: country })
      countryObj = _.where(countries, { code: country })[0]

      _.forEach(countryDocs, (doc) => {
        if (!_.isEmpty(countrySnap)) {
          countrySnap.snapshot =
            deepmerge(countrySnap.snapshot,
                      getDocumentDetails(doc, countryObj),
                      { arrayMerge: concatMerge })
        } else {
          countrySnap = {
            code: doc.countryCode,
            date: date,
            snapshot: getDocumentDetails(doc, countryObj)
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

  function getDocumentDetails(doc, countryObj) {
    if (countryObj.obi) {
      return {
        [doc.year]: {
          [doc.type]: [
            {
              title: doc.title || doc.filename,
              state: getDocumentState(doc, countryObj.obi.availability)
            }
          ]
        }
      }
    } else {
      return {
        [doc.year]: {
          [doc.type]: [
            {
              title: doc.title || doc.filename,
              state: getDocumentState(doc)
            }
          ]
        }
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
