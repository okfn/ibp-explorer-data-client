import Indaba from './../src/indaba'
import { expect, assert } from 'chai'

describe('Get compiled JSON for the tracker', function () {
  let response

  before(function () {
    this.timeout(8000)
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