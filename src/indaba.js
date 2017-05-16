import fetch from 'node-fetch'
import Filters from './filters'
import { getTrackerJSON, getSearchJSON } from './aquarium'
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

  updateTokenIfChanged() {
    const token = process.env.API_TOKEN
    if (token !== this.optionsGET.headers.Authorization) {
      this.optionsGET.headers.Authorization = token
      this.optionsHEAD.headers.Authorization = token
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
    this.updateTokenIfChanged()
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
    this.updateTokenIfChanged()
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
    this.updateTokenIfChanged()
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
    this.updateTokenIfChanged()
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
    this.updateTokenIfChanged()
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
    this.updateTokenIfChanged()
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
    this.updateTokenIfChanged()
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
    this.updateTokenIfChanged()
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
    this.updateTokenIfChanged()
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
    this.updateTokenIfChanged()
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
    this.updateTokenIfChanged()
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
    this.updateTokenIfChanged()
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
    this.updateTokenIfChanged()
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
    this.updateTokenIfChanged()
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
    this.updateTokenIfChanged()
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
    this.updateTokenIfChanged()
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
    this.updateTokenIfChanged()
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
    this.updateTokenIfChanged()
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
    this.updateTokenIfChanged()
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
    this.updateTokenIfChanged()
    const filterStr = filter.toString()
    return fetch(`${this.baseUrl}/reports/count${filterStr}`,
                 this.optionsGET)
      .then((res) => {
        return res.json()
      })
  }

  getTrackerJSON() {
    this.updateTokenIfChanged()
    let countries = this.getCountries()
    let documents = this.getDocuments()
    let snapshots = IbpS3.getSnapshots()
    let gdriveFiles = GDrive.getSpreadsheet(process.env.SPREADSHEET_ID, 'files')
    let gdriveFolders = GDrive.getSpreadsheet(process.env.SPREADSHEET_ID,
                                              'folders')

    return Promise.all(
      [countries, documents, snapshots, gdriveFiles, gdriveFolders])
      .then(values => {
        return getTrackerJSON(values[0], values[1], values[2], values[3].values,
                              values[4].values)
      })
  }

  /**
   * Get array list of folder paths and their Google Drive Ids
   *
   * @returns {Promise}
   */
  getGDriveFolders() {
    return GDrive.getSpreadsheet(process.env.SPREADSHEET_ID, 'folders')
  }

  getSearchJSON() {
    this.updateTokenIfChanged()
    let files = GDrive.getSpreadsheet(process.env.SPREADSHEET_ID, 'files')
    let documents = this.getDocuments()
    let countries = this.getCountries()

    return Promise.all([files, documents, countries]).then((values) => {
      return getSearchJSON(values[0].values, values[1], values[2])
    })
  }
}

export default new Indaba()
