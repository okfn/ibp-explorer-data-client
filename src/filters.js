'use strict';
import _ from 'underscore'

//TODO user rest-parameters on all filters

let Filter = function () {

  let filters = ''

  function concatChar() {
    if (filters === '') {
      filters = '?'
    } else {
      filters = `${filters}&`
    }
  }

  function arrayify(arr, len) {
    if (arr.length === len && _.isString(arr[0]) && _.isString(arr[1])) {
      return [arr]
    }
    return arr
  }

  /**
   * Add fields filter. Pass ...['property', <true|false>] as arguments.
   *
   * @param {Array} properties
   * @returns {this}
   */
  let fields = function (...properties) {
    //properties = arrayify(properties, 2)
    //properties = [properties]
    let show
    _.forEach(properties, (arr) => {
      if (arr.length === 2) {
        if (arr[1] === true) {
          show = 'true'
        }
        else if (arr[1] === false) {
          show = 'false'
        }
        else {
          console.error
          (`Invalid value ${arr[1]} as fields filter argument. 
          Fields filter must be either true or false.`)
          return
        }
        concatChar()
        arr[0] = encodeURIComponent(arr[0])
        filters = `${filters}filter[fields][${arr[0]}]=${show}`
      } else {
        console.error
        (`Invalid number of elements in fields filter argument ${arr}.
        Fields filter arguments must be array with two elements.`)
      }
    })
    return this
  }

  /**
   * Add include filter.
   *
   * @param {String} relatedModel
   * @param {String} propertyName
   * @returns {this}
   */
  let include = function (relatedModel, propertyName) {
    concatChar()
    relatedModel = encodeURIComponent(relatedModel)
    propertyName = encodeURIComponent(propertyName)
    filters = `${filters}filter[include][${relatedModel}]=${propertyName}`
    return this
  }

  /**
   * Add limit filter.
   *
   * @param {Number} n
   * @returns {Object} this
   */
  let limit = function (n) {
    concatChar()
    //TODO check if valid positive integer
    filters = `${filters}filter[limit]=${n}`
    return this
  }

  /**
   * Add 'order' filter/s
   *
   * @param properties
   */
  let order = function (...properties) {
    _.forEach(properties, (property, index) => {
      concatChar()
      filters =
        `${filters}filter[order][${index}]=${encodeURIComponent(property)}`
    })
    return this
  }

  let skip = function (n) {
    concatChar()
    filters = `${filters}filter[skip]=${n}`
    return this
  }

  //NOTE this is stub implementation.
  /**
   *
   * Equivalence [property, value]
   * AND/OR [and, [<conditions>]]
   *
   *
   * @param properties
   * @returns {where}
   */
    //TODO investigate all place where encodeURIComponent is needed
  let where = function (...properties) {

      function equivalence(array) {
        concatChar()
        filters = `${filters}filter[where][${array[0]}]=${array[1]}`
      }

      function between(array) {
        concatChar()
        filters =
          `${filters}filter[where][${array[0]}][between][0]=${array[2]}&filter[where][${array[0]}][between][1]=${array[3]}`
      }

      function logicOperators(array) {
        function basicBlock(condition) {
          if (condition.length === 2) {
            return `[${condition[0]}]=${condition[1]}`
          } else if (condition.length === 3) {
            return `[${condition[0]}][${condition[1]}]=${condition[2]}`
          }
        }

        _.forEach(array[1], (elem, index) => {
          concatChar()
          filters =
            `${filters}filter[where][${array[0]}][${index}]${basicBlock(elem)}`
        })
      }

      function inq(array) {
        _.forEach(array[2], (value) => {
          concatChar()
          filters =
            `${filters}filter[where][${array[1]}][inq]=${encodeURIComponent(
              value)}`
        })
      }

      function likenlike(array) {
        concatChar()
        filters =
          `${filters}filter[where][${array[1]}][${array[0]}]=${encodeURIComponent(
            array[2])}`
      }

      function near(array) {
        concatChar()
        filters =
          `${filters}filter[where][${array[1]}][${array[0]}]=${encodeURIComponent(
            array[2])}`
      }

      function findFilters(array, filterStr) {
        if (array[0] === 'or' || array[0] === 'and') {
          logicOperators(array)
        } else if (array[1] === 'between') {
          between(array)
        } else if (array[0] === 'inq') {
          inq(array)
        } else if (array[0] === 'like' || array[0] === 'nlike') {
          likenlike(array)
        } else if (!Array.isArray(array[1])) {
          equivalence(array)
        } else {
          likenlike(array)
        }
      }

      findFilters(properties[0])
      return this
    }

  /**
   * Returns a string with the applied filters
   * @returns {string}
   */
  let toString = function () {
    return filters
  }

  return {
    fields: fields
    , include: include
    , limit: limit
    , order: order
    , skip: skip
    , where: where
    , toString: toString
  }
}

export default Filter