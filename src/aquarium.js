import _ from 'underscore'

function getTrackerJSON(countries, documents, snapshots, gdriveFiles, gdriveFolders) {
  countries = _.filter(countries, (country) => {
    return country.obi
  })
  countries = _.sortBy(countries, 'country')
  const country_index = _.indexOf(gdriveFiles[0], 'country')
  const path_index = _.indexOf(gdriveFolders[0], 'path')
  const id_index = _.indexOf(gdriveFolders[0], 'id')
  _.each(countries, function (country) {
    const countryGDrive = _.filter(gdriveFiles, (file) => {
      return file[country_index] === country.country
    })
    countryGDrive.unshift(gdriveFiles[0])
    return cleanCountry(country, gdriveFiles)
  })
  documents = _.where(documents, { 'approved': true })
  _.each(countries, function (country) {
    const countryDocs = _.where(documents, { countryCode: country.code })
    const countryGDrive = _.filter(gdriveFiles, (file) => {
      return file[country_index] === country.country
    })
    countryGDrive.unshift(gdriveFiles[0])
    country.documents =
      cleanDocuments(countryDocs, countryGDrive, country.obi.availability);

    let driveCountryId = _.find(gdriveFolders, (folder) => {
      return folder[path_index] === country.country
    })
    if (driveCountryId) {
      country.driveCountryId = driveCountryId[id_index]
    }
  })
  _.each(countries, function (country) {
    const countryShots = _.filter(snapshots, function (d) {
      return d.code === country.code;
    });
    country.snapshots = countryShots;
  });

  return countries
}


function getSearchJSON(files, documents, countries) {
  _.forEach(documents, (document) => {
    document = matchDriveIdByDoc(document, files)

    const country = _.findWhere(countries, { code: document.countryCode })
    if (country.obi) {
      document.state = getDocumentState(document, country.obi.availability)
    } else {
      document.state = getDocumentState(document)
    }
    if (document.state === 'late') {
      document.state = 'Published late'
    } else if (document.state === 'available') {
      document.state = 'Publicly available'
    }

    document.year = String(document.year)

    delete document.uploads
    delete document.id
    delete document.comments
    delete document.available
    delete document.created_at
    delete document.date_published
    delete document.date_received
    delete document.last_modified
    delete document.location
    delete document.location_detail
    delete document.scanned
    delete document.softcopy
    delete document.attachmentId
    delete document.internal
  })

  documents = _.filter(documents, (doc) => {
    return (doc.state === 'Published late' ||
      doc.state === 'Publicly available') &&
      (doc.groupParentId || doc.driveId)
  })

  _.forEach(countries, (country) => {
    country = matchDriveIdByCountry(country, files)
    if (country.obi) {
      if (country.obi.availability) {
        _.each(country.obi.availability, (countryDocuments, year) => {
          _.each(countryDocuments, function (countryDocument, type) {
            let year_fixed = year.split(" ").splice(-1)[0]
            if (countryDocument.driveId || countryDocument.groupParentId) {
              countryDocument.type = type
              countryDocument.year = year_fixed
              countryDocument.countryCode = country.code
              countryDocument.country = country.country
              if (countryDocument.status === 'Available') {
                countryDocument.state = 'Publicly available'
              } else if (countryDocument.status === 'Published Late') {
                countryDocument.state = 'Published late'
              }

              delete countryDocument.status

              const found = _.findWhere(documents, {
                year: countryDocument.year,
                type: countryDocument.type,
                countryCode: countryDocument.countryCode,
              })

              if (!found) {
                documents.push(countryDocument)
              }
            }
          })
        })
      }
    }
  })


  const countryNames = _.uniq(_.pluck(documents, 'country')).sort()
  const documentYears = _.uniq(_.pluck(documents, 'year')).sort()
  const documentTypes = _.uniq(_.pluck(documents, 'type')).sort()
  const documentStates = _.uniq(_.pluck(documents, 'state')).sort()
  return {
    countries: countryNames,
    document_types: documentTypes,
    years: documentYears,
    states: documentStates,
    documents: documents
  }
}

function matchDriveIdByDoc(document, files) {
  const name_index = _.indexOf(files[0], 'name')
  const id_index = _.indexOf(files[0], 'id')
  const parentId_index = _.indexOf(files[0], 'parentId')
  const fiscalYear_index = _.indexOf(files[0], 'fiscalYear')
  const country_index = _.indexOf(files[0], 'country')
  const type_index = _.indexOf(files[0], 'type')
  let matchedUploads = 0, groupParentId

  if (document.uploads) {
    _.forEach(document.uploads, (upload) => {
      const file = _.find(files, (file) => {
        return file[name_index] === upload.name
      })
      if (file) {
        matchedUploads += 1
        document.driveId = file[id_index]
        groupParentId = file[parentId_index]
      }
    })
  } else if (document.filename) {
    const files = _.filter(files, (file) => {
      return ((file[country_index] === document.country) &&
              (file[type_index]) === document.type &&
              matchYears(document.year, file[fiscalYear_index]))
    })
    if (files.length === 1) {
      document.driveId = files[0][id_index]
    } else if (files.length > 1) {
      document.groupParentId = files[0][parentId_index]
    }
  }
  if (matchedUploads > 1) {
    document.groupParentId = groupParentId
  }

  return document
}

function matchDriveIdByCountry(country, files) {
  const name_index = _.indexOf(files[0], 'name')
  const id_index = _.indexOf(files[0], 'id')
  const parentId_index = _.indexOf(files[0], 'parentId')
  const fiscalYear_index = _.indexOf(files[0], 'fiscalYear')
  const country_index = _.indexOf(files[0], 'country')
  const type_index = _.indexOf(files[0], 'type')
  // Keys after "December 2016" will always be "{Month} {Year}"
  const matchWordYear = /[a-zA-Z]+\s\d+/g

  if (country.obi) {
    if (country.obi.availability) {
      _.each(country.obi.availability, function (documents, year) {
        if (year === '2016' || matchWordYear.exec(year)){
          let year_fixed = year.split(" ").splice(-1)[0]
          _.each(documents, function (document, documentType) {
            const filesFound = _.filter(files, (file) => {
              return ((file[country_index] === country.country) &&
                     (file[type_index]) === documentType &&
                     matchYears(year_fixed, file[fiscalYear_index]))
            })
            if (filesFound.length === 1) {
              document.driveId = filesFound[0][id_index]
              document.title = filesFound[0][name_index]
            } else if (filesFound.length > 1) {
              document.groupParentId = filesFound[0][parentId_index]
              document.title = filesFound[0][name_index]
            }
          })
        }
      })
    }
  }

  return country
}

function matchYears(docYear, gdriveYear) {
  /*
  Determine whether docYear matches, or is in the range of, gdriveYear.

  e.g. If docYear is 2016, the following gdriveYear will return true:
  2016
  2015-2016
  2015-2017
  2016-2017
  */
  if (docYear + '' === gdriveYear) {
    return true
  } else if (gdriveYear.split('-').length > 1) {
    const yearRangeLeft = parseInt(gdriveYear.split('-')[0])
    const yearRangeRight = parseInt(gdriveYear.split('-')[1])
    docYear = parseInt(docYear)
    if ((yearRangeLeft <= docYear) && (docYear <= yearRangeRight)) {
      return true
    }
  } else if (docYear.split('-').length > 1) {
    const yearRangeLeft = parseInt(docYear.split('-')[0])
    const yearRangeRight = parseInt(docYear.split('-')[1])
    gdriveYear = parseInt(gdriveYear)
    if ((yearRangeLeft <= gdriveYear) && (gdriveYear <= yearRangeRight)) {
      return true
    }
  } else if (docYear.split('/').length > 1) {
    const yearRangeLeft = parseInt(docYear.split('/')[0])
    const yearRangeRight = parseInt(docYear.split('/')[1])
    gdriveYear = parseInt(gdriveYear)
    if ((yearRangeLeft <= gdriveYear) && (gdriveYear <= yearRangeRight)) {
      return true
    }
  } else {
    return false
  }
}

function cleanCountry(country, gdriveDocs) {
  if (!country) {
    return country;
  }
  delete country._id;
  if (country.obi_scores) {
    country.obi_scores = _.sortBy(country.obi_scores, 'year');
    country.obi_scores = _.map(country.obi_scores, function (obi_score) {
      if (obi_score.year) {
        obi_score.year = Number(obi_score.year);
      }
      return obi_score;
    });
  }

  country = matchDriveIdByCountry(country, gdriveDocs)

  return country;
}

function cleanSites(sites) {
  return _.map(sites, function (site) {
    var theSite = {
      title: site.title,
      type: site.type,
      search_dates: site.search_dates
    };
    if (site.url) {
      theSite.url = site.url;
    }
    return theSite;
  });
}

function cleanDocuments(docs, gdriveDocs, availability) {
  var theDoc,
      docYear,
      datePublished

  docs = _.map(docs, function (doc) {
    theDoc = {
      state: getDocumentState(doc, availability)
    }
    var attributes = [
      'year', 'type', 'approved', 'comments', 'date_published',
      'date_received', 'uploads'
    ];
    _.each(attributes, function (attribute) {
      if (doc[attribute] != null) {
        theDoc[attribute] = doc[attribute];
      }
    });
    if (doc.filename) {
      theDoc.title = doc.filename
    } else {
      theDoc.title = doc.title
    }

    // doc.year can be a string or integer
    if (!isNaN(doc.year) || !isNaN(Number(doc.year))) {
      docYear = doc.year + ''
      if (availability[docYear]) {
          datePublished = availability[docYear][doc.type]['datePublished']
          if (datePublished) {
            if (datePublished) {
                theDoc.date_published = datePublished
            }
        }
      }
    }

    if (theDoc.state) {
        if (theDoc.state.toLowerCase() === 'internal' ||
            theDoc.state.toLowerCase() === 'not produced') {
            delete theDoc.date_published
        }
    }

    return theDoc;
  });
  // Turn array of documents into structure like:
  // { 2013: { "In-Year Report": [ ... ], ... }, ... }
  docs = _.groupBy(docs, 'year');
  _.each(docs, function (doc, year) {
    _.each(docs[year], function (doc) {
      delete doc.year;
      doc = matchDriveIdByDoc(doc, gdriveDocs)
    });
    docs[year] = _.groupBy(docs[year], 'type');
  });

  return docs;
}

function getDocumentState(doc, availability) {
  if (availability) {
    if (isNaN(doc.year) || !availability[doc.year + '']) {
      return getDocumentStateFromDocument(doc)
    } else {
      if (typeof availability[doc.year + ''][doc.type] === 'string') {
        return availability[doc.year + ''][doc.type]
      } else {
        return availability[doc.year + ''][doc.type]['status']
      }
    }
  } else {
    return getDocumentStateFromDocument(doc)
  }
}

function getDocumentStateFromDocument(doc) {
  if (doc.available && !doc.internal && doc.date_published) {
    return 'available';
  }
  if (!doc.available && doc.internal && !doc.date_published) {
    return 'internal';
  }
  if (!doc.available && !doc.internal && doc.date_published) {
    return 'late';
  }

  return 'not produced';
}

export {
  getTrackerJSON,
  getSearchJSON,
  getDocumentState
}
