'use strict'

import Indaba from '../src/indaba'
import Filters from '../src/filters'
import { expect, assert } from 'chai'
import _ from 'underscore'

describe('Filter', function () {
  describe('fields', function () {
    this.timeout(3000)
    it('returns requested fields', () => {
      return Indaba.getSnapshotById('54353429986cd7727f7721c6',
                                    Filters().fields(['country', true]))
        .then((res) => {
          assert(res['country'] && Object.keys(res).length === 1,
                 'Expected field not in returned object or more fields present')
        })
    })
  })

  describe('limit', function () {
    this.timeout(3000)
    it('array is of requested length', () => {
      return Indaba.getSnapshots(Filters().limit(1), () => {
        assert(res.length === 1, 'Returned array have incorrect length')
      })
    })
  })

  describe('order', function () {
    this.timeout(3000)
    it("returns object with 'code' field in DESC order", () => {
      return Indaba.getCountries(Filters().order('code DESC').limit(10))
        .then((res) => {
          let previous
          _.forEach(res, (country) => {
            if (!previous) {
              previous = country.code
            } else {
              assert(previous > country.code.charAt(0),
                     'Returned objects not in descending order')
            }
          })
        })
    })
  })

  describe('skip', function () {
    this.timeout(3000)
    it('returns array with skipped objects', () => {
      return Indaba.getCountries(Filters().skip(1).limit(1)).then((res) => {
        assert(res[0].code === 'DO')
      })
    })
  })
})

describe('WHERE filter', function () {
  it('returns valid "equivalence" string', () => {
    const filtersStr = Filters().where(['property', 'value']).toString()
    assert(filtersStr === '?filter[where][property]=value',
           'Returned string is invalid')
  })

  it('returns valid "AND" string', () => {
    const filtersStr = Filters().where(['and',
                                         [
                                           ['property1', 'value1']
                                           , ['property2', 'value2']
                                         ]]).toString()
    assert(filtersStr ===
           '?filter[where][and][0][property1]=value1&filter[where][and][1][property2]=value2',
           'Returned string is invalid')
  })

  it('returns valid "OR" string', () => {
    const filtersStr = Filters().where(['or',
                                         [
                                           ['property1', 'value1']
                                           , ['property2', 'value2']
                                         ]]).toString()
    assert(filtersStr ===
           '?filter[where][or][0][property1]=value1&filter[where][or][1][property2]=value2',
           'Returned string is invalid')
  })

  it('returns valid "between" string', function () {
    const filterStr = Filters().where(['price', 'between', '0', '7']).toString()
    assert(filterStr ===
           '?filter[where][price][between][0]=0&filter[where][price][between][1]=7',
           'Returned string is invalid')
  })

  it('returns valid "between" string', function () {
    const filterStr = Filters()
      .where(['inq', 'price', ['0.99', '99.99', '399.99']])
      .toString()
    assert(filterStr ===
           '?filter[where][price][inq]=0.99&filter[where][price][inq]=99.99&filter[where][price][inq]=399.99',
           'Returned string is invalid')
  })

  it('returns valid "like" string', function () {
    const filterStr = Filters()
      .where(['like', 'code', '^H'])
      .toString()
    assert(filterStr ===
           '?filter[where][code][like]=%5EH',
           'Returned string is invalid')
  })
})