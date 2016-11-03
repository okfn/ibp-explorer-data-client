import fetch from 'node-fetch'
import Filters from './filters'
import { getTrackerJSON } from './aquarium'
import GDrive from './gdrive'
import IbpS3 from './ibpS3'

class Indaba {

  constructor() {
    let headers = {
      Authorization: process.env.API_TOKEN
      , 'Content-Type': 'application/json'
    }
    this.baseUrl = process.env.API_BASE
    this.optionsGET = {
      method: 'GET'
      , headers: headers
    }
    //TODO implement HEAD requests
    this.optionsHEAD = {
      method: 'HEAD'
      , headers: headers
    }
  }

  // Country endpoints

  /**
   * Check whether a country exists in the data source.
   * Returns json with key 'exists' with value 'true' or 'false'
   * Example: {"exists":true}
   *
   * @param id
   * @returns {Promise}
   */
  checkCountryExists(id) {
    return fetch(`${this.baseUrl}/countries/${id}/exists`, this.optionsGET)
      .then((res) => {
        return res.json()
      })
  }

  /**
   * Find a country by id from the data source.
   * Returns json with all available info if filter is not applied.
   * Available filters: fields and include.
   *
   * @param {String} id
   * @param {Filter} filter
   * @returns {Promise}
   *
   */
  getCountryById(id, filter = Filters()) {
    const filterStr = filter.toString()
    return fetch(`${this.baseUrl}/countries/${id}${filterStr}`, this.optionsGET)
      .then((res) => {
        return res.json()
      })
  }

  /**
   * Find all instances of countries matched by filter from the data source.
   * Returns json with all countries if filter is not applied.
   * Available filters: fields, where, include, order, offset and limit
   *
   * @param {Filter} filter
   * @returns {Promise}
   */
  getCountries(filter = Filters()) {
    const filterStr = filter.toString()
    return fetch(`${this.baseUrl}/countries${filterStr}`, this.optionsGET)
      .then((res) => {
        return res.json()
      })
  }

  /**
   * Find first instance of country matched by filter from the data source.
   * Available filters: fields, where, include, order, offset and limit
   *
   * @param id
   * @param [filter]
   * @returns {Promise}
   */
  getCountryFindOne(id, filter = Filters()) {
    const filterStr = filter.toString()
    return fetch(`${this.baseUrl}/countries/findOne${filterStr}`,
                 this.optionsGET)
      .then((res) => {
        return res.json()
      })
  }

  /**
   * Count instances of country matched by where from the data source.
   * Returns json with key 'count' and value Integer.
   * Available filters: where
   *
   * @param {Filter} filter
   * @returns {Promise}
   */
  getCountriesCount(filter = Filters()) {
    const filterStr = filter.toString()
    return fetch(`${this.baseUrl}/countries/count${filterStr}`,
                 this.optionsGET)
      .then((res) => {
        return res.json()
      })
  }

  // Document endpoints

  /**
   * Check whether a document exists in the data source.
   * Returns json with all available info if filter is not applied.
   * Example: {"exists":false}
   *
   * @param id
   * @returns {Promise.<TResult>}
   */
  checkDocumentExists(id) {
    return fetch(`${this.baseUrl}/documents/${id}/exists`, this.optionsGET)
      .then((res) => {
        return res.json()
      })
  }

  /**
   * Find a document by id from the data source.
   * Returns json with all available info if filter is not applied.
   * Available filters: fields and include.
   *
   * @param {String} id
   * @param {Filter} filter
   * @returns {Promise}
   */
  getDocumentById(id, filter = Filters()) {
    const filterStr = filter.toString()
    return fetch(`${this.baseUrl}/documents/${id}${filterStr}`, this.optionsGET)
      .then((res) => {
        return res.json()
      })
  }

  /**
   * Find all instances of documents matched by filter from the data source.
   * Returns json with all documents if filter is not applied.
   * Available filters: fields, where, include, order, offset and limit
   *
   * @param {Filter} [filter]
   * @returns {Promise}
   */
  getDocuments(filter = Filters()) {
    const filterStr = filter.toString()
    return fetch(`${this.baseUrl}/documents${filterStr}`, this.optionsGET)
      .then((res) => {
        return res.json()
      })
  }

  /**
   * Find first instance of country matched by filter from the data source.
   * Available filters: fields, where, include, order, offset and limit
   *
   * @param id
   * @param [filter]
   * @returns {Promise}
   */
  getDocumentFindOne(id, filter = Filters()) {
    const filterStr = filter.toString()
    return fetch(`${this.baseUrl}/documents/findOne${filterStr}`,
                 this.optionsGET)
      .then((res) => {
        return res.json()
      })
  }

  /**
   * Count instances of documents matched by where from the data source.
   * Returns json with key 'count' and value Integer.
   * Available filters: where
   *
   * @param {Filter} filter
   * @returns {Promise}
   */
  getDocumentsCount(filter = Filters()) {
    const filterStr = filter.toString()
    return fetch(`${this.baseUrl}/documents/count${filterStr}`,
                 this.optionsGET)
      .then((res) => {
        return res.json()
      })
  }

  // Report endpoints

  /**
   * Check whether a report exists in the data source.
   * Example: {"exists":false}
   *
   * @param id
   * @returns {Promise.<TResult>}
   */
  checkReportExists(id) {
    return fetch(`${this.baseUrl}/reports/${id}/exists`, this.optionsGET)
      .then((res) => {
        return res.json()
      })
  }

  /**
   * Find a report by id from the data source.
   * Returns json with all available info if filter is not applied.
   * Available filters: fields and include.
   *
   * @param {String} id
   * @param {Filter} filter
   * @returns {Promise}
   */
  //TODO check available filters
  getReportById(id, filter = Filters()) {
    const filterStr = filter.toString()
    return fetch(`${this.baseUrl}/reports/${id}${filterStr}`, this.optionsGET)
      .then((res) => {
        return res.json()
      })
  }

  /**
   * Find all instances of reports matched by filter from the data source.
   * Returns json with all reports if filter is not applied.
   * Available filters: fields, where, include, order, offset and limit
   *
   * @param {Filter} [filter]
   * @returns {Promise}
   */
  //TODO check available filters
  getReports(filter = Filters()) {
    const filterStr = filter.toString()
    return fetch(`${this.baseUrl}/reports${filterStr}`, this.optionsGET)
      .then((res) => {
        return res.json()
      })
  }

  /**
   * Find first instance of report matched by filter from the data source.
   * Available filters: fields, where, include, order, offset and limit
   *
   * @param id
   * @param [filter]
   * @returns {Promise}
   */
  getReportFindOne(id, filter = Filters()) {
    const filterStr = filter.toString()
    return fetch(`${this.baseUrl}/reports/findOne${filterStr}`,
                 this.optionsGET)
      .then((res) => {
        return res.json()
      })
  }

  /**
   * Count instances of reports matched by where from the data source.
   * Returns json with key 'count' and value Integer.
   * Available filters: where
   *
   * @param {Filter} filter
   * @returns {Promise}
   */
  getReportsCount(filter = Filters()) {
    const filterStr = filter.toString()
    return fetch(`${this.baseUrl}/reports/count${filterStr}`,
                 this.optionsGET)
      .then((res) => {
        return res.json()
      })
  }

  // Snapshot endpoints

  /**
   * Check whether a snapshot exists in the data source.
   * Example: {"exists":false}
   *
   * @param id
   * @returns {Promise.<TResult>}
   */
  checkSnapshotExists(id) {
    return fetch(`${this.baseUrl}/snapshots/${id}/exists`, this.optionsGET)
      .then((res) => {
        return res.json()
      })
  }

  /**
   * Find a snapshot by id from the data source.
   * Returns json with all available info if filter is not applied.
   * Available filters: fields and include.
   *
   * @param {String} id
   * @param {Filter} filter
   * @returns {Promise}
   */
  //TODO check available filters
  getSnapshotById(id, filter = Filters()) {
    const filterStr = filter.toString()
    return fetch(`${this.baseUrl}/snapshots/${id}${filterStr}`, this.optionsGET)
      .then((res) => {
        return res.json()
      })
  }

  /**
   * Find all instances of snapshots matched by filter from the data source.
   * Returns json with all snapshots if filter is not applied.
   * Available filters: fields, where, include, order, offset and limit
   *
   * @param {Filter} [filter]
   * @returns {Promise}
   */
  //TODO check available filters
  getSnapshots(filter = Filters()) {
    const filterStr = filter.toString()
    return fetch(`${this.baseUrl}/snapshots${filterStr}`, this.optionsGET)
      .then((res) => {
        return res.json()
      })
  }

  /**
   * Find first instance of snapshot matched by filter from the data source.
   * Available filters: fields, where, include, order, offset and limit
   *
   * @param id
   * @param [filter]
   * @returns {Promise}
   */
  getSnapshotFindOne(id, filter = Filters()) {
    filterStr = filter.toString()
    return fetch(`${this.baseUrl}/reports/findOne${filterStr}`,
                 this.optionsGET)
      .then((res) => {
        return res.json()
      })
  }

  /**
   * Count instances of snapshots matched by where from the data source.
   * Returns json with key 'count' and value Integer.
   * Available filters: where
   *
   * @param {Filter} filter
   * @returns {Promise}
   */
  getSnapshotsCount(filter = Filters()) {
    const filterStr = filter.toString()
    return fetch(`${this.baseUrl}/reports/count${filterStr}`,
                 this.optionsGET)
      .then((res) => {
        return res.json()
      })
  }

  getTrackerJSON() {
    let countries = this.getCountries()
    let documents = this.getDocuments()
    let snapshots = IbpS3.getSnapshots()
    let gdrive = GDrive.getSpreadsheet(process.env.STYLESHEET_ID)

    return Promise.all([countries, documents, snapshots, gdrive]).then(values => {
      return getTrackerJSON(values[0], values[1], values[2], values[3].values)
    })
  }

  /**
   * Get array list of folder paths and their Google Drive Ids
   *
   * @returns {Promise}
   */
  getGDriveFolders() {
    return GDrive.getSpreadsheet(process.env.STYLESHEET_ID, 'folders')
  }
}

export default new Indaba()