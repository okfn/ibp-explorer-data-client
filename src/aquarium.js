import _ from 'underscore'

function getTrackerJSON(countries, documents, snapshots) {
  countries = _.sortBy(countries, 'country')
  _.each(countries, cleanCountry)
  documents = _.where(documents,  { 'approved': true })
  _.each(countries, function (country) {
    const countryDocs = _.where(documents, {country: country.country})
    country.documents = cleanDocuments(countryDocs);
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

function cleanDocuments(docs) {
  docs = _.map(docs, function (doc) {
    var theDoc = {
        state: getDocumentState(doc),
      },
      attributes = [
        'year', 'title', 'type', 'approved',
        'date_published', 'date_received', 'comments'
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