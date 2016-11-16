'use strict'

import {} from 'dotenv/config'
import Indaba from './../src/indaba'
import { expect, assert } from 'chai'
import _ from 'underscore'


describe('Get compiled JSON for the tracker', function () {
  let response

  before(function () {
    this.timeout(30000)
    return Indaba.getTrackerJSON().then((res) => {
      'use strict';
      response = res
    })
  })

  it('contains documents array', function () {
    assert(response[0].documents, 'No documents array')
  })

  it('contains snapshots array', function () {
    assert(response[0].snapshots, 'No snapshots array')
  })
})

describe('Get compiled Search JSON for the explorer', function () {
  let response

  before(function () {
    this.timeout(30000)
    return Indaba.getSearchJSON().then((res) => {
      'use strict';
      response = res
    })
  })

  it('contains countries array', function () {
    assert(response.countries, 'Missing countries array')
  })

  it('contains document_types array', function () {
    assert(response.document_types, 'Missing document_types array')
  })

  it('contains years array', function () {
    assert(response.years, 'Missing years array')
  })

  it('contains states array', function () {
    assert(response.states, 'Missing states array')
  })

  it('contains documents array', function () {
    assert(response.documents, 'Missing documents array')
  })

  it('all documents contain driveId', function () {
    _.forEach(response.documents, function (search) {
      assert(search.driveId, 'Missing driveId')
    })
  })

})
