import _ from 'underscore'
import drive from '../data/driveDocuments_.json'


function getTrackerJSON(countries, documents, snapshots, gdrive) {
  countries = _.sortBy(countries, 'country')
  const country_index = _.indexOf(gdrive[0], 'country')
  console.log('country_index: ', country_index)
  _.each(countries, cleanCountry)
  documents = _.where(documents,  { 'approved': true })
  _.each(countries, function (country) {
    const countryDocs = _.where(documents, {country: country.country})
    const countryGDrive = _.filter(gdrive, (file) => {
      return file[country_index] === country.country
    })
    countryGDrive.unshift(gdrive[0])
    country.documents = cleanDocuments(countryDocs, countryGDrive);
  })
  _.each(countries, function (country) {
    const countryShots = _.filter(snapshots, function (d) {
      return d.code === country.code;
    });
    country.snapshots = cleanSnapshots(countryShots);
  });

  return countries
}

function cleanCountry(country) {
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

function cleanDocuments(docs, gdriveDocs) {
  docs = _.map(docs, function (doc) {
    var theDoc = {
        state: getDocumentState(doc),
      },
      attributes = [
        'year', 'title', 'type', 'approved',
        'date_published', 'date_received', 'comments', 'uploads'
      ];
    _.each(attributes, function (attribute) {
      if (doc[attribute]) {
        theDoc[attribute] = doc[attribute];
      }
    });
    return theDoc;
  });
  // Turn array of documents into structure like:
  // { 2013: { "In-Year Report": [ ... ], ... }, ... }
  docs = _.groupBy(docs, 'year');
  _.each(docs, function (doc, year) {
    _.each(docs[year], function (doc) {
      delete doc.year;
      if (doc.uploads) {
        const name_index = _.indexOf(gdriveDocs[0], 'name')
        const id_index = _.indexOf(gdriveDocs[0], 'id')
        const path_index = _.indexOf(gdriveDocs[0], 'path')
        const mimeType_index = _.indexOf(gdriveDocs[0], 'mimeType')
        const parentId_index = _.indexOf(gdriveDocs[0], 'parentId')
        _.each(doc.uploads, function (upload) {
          const driveFile = _.filter(gdriveDocs, (file) => {
            return file[name_index] === upload.name
          })
          if (driveFile.length > 1) {
            console.log('More files with same name, using the first one found.')
            console.log(upload.name)
          }
          if (driveFile[0]) {
            upload.driveId = driveFile[0][id_index]
            upload.path = driveFile[0][path_index]
            upload.mime = driveFile[0][mimeType_index]
            upload.parentId = driveFile[0][parentId_index]
          }
        })
      }
    });
    docs[year] = _.groupBy(docs[year], 'type');
  });

  return docs;
}

function cleanSnapshots(snapshots) {
  snapshots = _.map(snapshots, function (snapshot) {
    return {
      'date': snapshot.date,
      'snapshot': snapshot.snapshot
    };
  });

  return snapshots;
}

function getDocumentState(doc) {
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


export default getTrackerJSON