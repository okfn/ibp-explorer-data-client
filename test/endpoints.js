'use strict'

import _ from 'lodash'
import Indaba from '../src/indaba'
import Filters from '../src/filters'
import { expect, assert } from 'chai'

describe('Countries endpoint', function () {

  describe('checkCountryExists(id)', function () {
    this.timeout(3000)
    let response
    before(() => {
      return Indaba.checkCountryExists('540e4108f76fbc70a6e9a382')
        .then((res) => {
          response = res
        })
    })

    it('returns true with valid id', function () {
      return Indaba.checkCountryExists('540e4108f76fbc70a6e9a382')
        .then((res) => {
          assert(res['exists'])
        })
    })

    it('returns false with invalid id', function () {
      return Indaba.checkCountryExists('f4ls31d').then((res) => {
        assert(!res['exists'])
      })
    })
  })

  describe('getCountryById(id)', function () {
    this.timeout(3000)
    let response
    before(() => {
      return Indaba.getCountryById('540e4108f76fbc70a6e9a382').then((res) => {
        response = res
      })
    })

    it('returned object contains relevant keys', () => {
      assert(response['code'], "Not all returned objects have 'code' field")
      assert(response['country'],
             "Not all returned objects have 'country' field")
    })
  })

  describe('getCountries()', function () {
    this.timeout(3000)
    let response
    before(() => {
      return Indaba.getCountries(Filters().limit(5)).then((res) => {
        response = res
      })
    })

    it('returns array', () => {
      assert.isArray(response, 'Returned object is not an array')
    })

    it('returned object contains relevant keys', () => {
      _.forEach(response, (country) => {
        assert(country['code'], "Not all returned objects have 'code' field")
        assert(country['country'],
               "Not all returned objects have 'country' field")
      })
    })
  })

  describe('getCountryFindOne()', function () {
    this.timeout(3000)
    let response
  })

  describe('getCountriesCount()', function () {
    this.timeout(3000)
    let response
    before(() => {
      return Indaba.getCountriesCount().then((res) => {
        response = res
      })
    })

    it('returns count and count', () => {
      assert(response['count'], 'count key not in response')
    })

    it('count is a positive integer', () => {
      const count = response['count']
      assert(count === parseInt(count, 10) && count > 0,
             'count is a positive integer')
    })
  })

})

describe('Document endpoint', function () {

  describe('checkDocumentExists(id)', function () {
    this.timeout(3000)
    let response

    it('returns true with valid id', function () {
      return Indaba.checkDocumentExists('539887c165f4140200000004')
        .then((res) => {
          assert(res['exists'])
        })
    })

    it('returns false with invalid id', function () {
      return Indaba.checkDocumentExists('f4ls31d').then((res) => {
        assert(!res['exists'])
      })
    })
  })

  describe('getDocumentById(id)', function () {
    this.timeout(3000)
    let response
    before(() => {
      return Indaba.getDocumentById('539887c165f4140200000004').then((res) => {
        response = res
      })
    })

    it('returned object contains relevant keys', () => {
      assert(response['date_published'],
             "Returned object don't have 'date_published' field")
      assert(response['approved'],
             "Returned object have 'approved' field")
    })
  })

  describe('getDocuments()', function () {
    this.timeout(3000)
    let response
    before(() => {
      return Indaba.getDocuments(Filters().limit(5)).then((res) => {
        response = res
      })
    })

    it('returns array', () => {
      assert.isArray(response, 'Returned object is not an array')
    })

    it('returned object contains relevant keys', () => {
      _.forEach(response, (document) => {
        assert(document['country'],
               "Not all returned objects have 'date_published' field")
      })
    })
  })

  describe('getDocumentFindOne()', function () {
    this.timeout(3000)
    let response
  })

  describe('getDocumentsCount()', function () {
    this.timeout(3000)
    let response
    before(() => {
      return Indaba.getDocumentsCount().then((res) => {
        response = res
      })
    })

    it('returns count and count', () => {
      assert(response['count'], 'count key not in response')
    })

    it('count is a positive integer', () => {
      const count = response['count']
      assert(count === parseInt(count, 10) && count > 0,
             'count is a positive integer')
    })
  })

})

describe('Report endpoint', function () {

  describe('checkReportExists(id)', function () {
    this.timeout(3000)

    it('returns true with valid id', function () {
      return Indaba.checkReportExists('53b72952de7d1a0200000001')
        .then((res) => {
          assert(res['exists'])
        })
    })

    it('returns false with invalid id', function () {
      return Indaba.checkReportExists('f4ls31d').then((res) => {
        assert(!res['exists'])
      })
    })
  })

  describe('getReportById(id)', function () {
    this.timeout(3000)
    let response
    before(() => {
      return Indaba.getReportById('53b72952de7d1a0200000001').then((res) => {
        response = res
      })
    })

    it('returned object contains relevant keys', () => {
      assert(response['content'],
             "Returned object don't have 'content' field")
    })
  })

  describe('getReports()', function () {
    this.timeout(3000)
    let response
    before(() => {
      return Indaba.getReports(Filters().limit(5)).then((res) => {
        response = res
      })
    })

    it('returns array', () => {
      assert.isArray(response, 'Returned object is not an array')
    })

    it('returned object contains relevant keys', () => {
      _.forEach(response, (report) => {
        assert(report['content'],
               "Not all returned objects have 'content' field")
      })
    })
  })

  describe('getReportFindOne()', function () {
    this.timeout(3000)
    let response
  })

  describe('getReportsCount()', function () {
    this.timeout(3000)
    let response
    before(() => {
      return Indaba.getReportsCount().then((res) => {
        response = res
      })
    })

    it('returns count and count', () => {
      assert(response['count'], 'count key not in response')
    })

    it('count is a positive integer', () => {
      const count = response['count']
      assert(count === parseInt(count, 10) && count > 0,
             'count is a positive integer')
    })
  })

})

describe('Snapshot endpoint', function () {

  describe('checkSnapshotExists(id)', function () {
    this.timeout(3000)

    it('returns true with valid id', function () {
      return Indaba.checkSnapshotExists('54353429986cd7727f7721c6')
        .then((res) => {
          assert(res['exists'])
        })
    })

    it('returns false with invalid id', function () {
      return Indaba.checkSnapshotExists('f4ls31d').then((res) => {
        assert(!res['exists'])
      })
    })
  })

  describe('getSnapshotById(id)', function () {
    this.timeout(3000)
    let response
    before(() => {
      return Indaba.getSnapshotById('54353429986cd7727f7721c6').then((res) => {
        response = res
      })
    })

    it('returned object contains relevant keys', () => {
      assert(response['snapshot'],
             "Returned object don't have 'content' field")
    })
  })

  describe('getSnapshots()', function () {
    this.timeout(3000)
    let response
    before(() => {
      return Indaba.getSnapshots(Filters().limit(5)).then((res) => {
        response = res
      })
    })

    it('returns array', () => {
      assert.isArray(response, 'Returned object is not an array')
    })

    it('returned object contains relevant keys', () => {
      _.forEach(response, (report) => {
        assert(report['snapshot'],
               "Not all returned objects have 'content' field")
      })
    })
  })

  describe('getReportFindOne()', function () {
    this.timeout(3000)
    let response
  })

  describe('getSnapshotsCount()', function () {
    this.timeout(3000)
    let response
    before(() => {
      return Indaba.getSnapshotsCount().then((res) => {
        response = res
      })
    })

    it('returns count and count', () => {
      assert(response['count'], 'count key not in response')
    })

    it('count is a positive integer', () => {
      const count = response['count']
      assert(count === parseInt(count, 10) && count > 0,
             'count is a positive integer')
    })
  })

})