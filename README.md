# ibp-explorer data client
[![Build Status](https://travis-ci.org/okfn/ibp-explorer-data-client.svg?branch=master)](https://travis-ci.org/okfn/ibp-explorer-data-client)
[![Coverage Status](https://coveralls.io/repos/github/okfn/ibp-explorer-data-client/badge.svg?branch=master)](https://coveralls.io/github/okfn/ibp-explorer-data-client?branch=master)
[![Issues](https://img.shields.io/badge/issue-tracker-orange.svg)](https://github.com/okfn/ibp-explorer-data-client/issues)

A Javascript client for data client needed by ibp-explorer. Works with Indaba API, S3 and Google Drive and Spreadsheets to set or get data.


### Dependencies

- node
- npm

### Installation

`git clone https://github.com/okfn/ibp-explorer-data-client.git`


## Environment variables

In order to use ibp-explorer-data-client the following environment variables need to be set:

* For calls to Indaba API
  * **API_BASE** - Base URL for the API
  * **API_TOKEN** - Access token for the API
* Google Drive files/folders 
  * **SERVICE_CREDENTIALS** - Google Service JSON token. You can do ``export SERVICE_CREDENTIALS=`cat <path_to_credentials.json>` ``
  * **DRIVE_ROOT_ID** - Which gdrive folder serves as root when searching for documents
* AWS S3 storage
  * **AWS_ACCESS_KEY_ID** - Your access key
  * **AWS_SECRET_ACCESS_KEY** - Your secret access key
  * **AWS_REGION** - Region where the bucket is
  * **AWS_BUCKET** - Name of the bucket where to store snapshots

The Indaba `API_TOKEN` is time-limited. When this lib is used by the separate ibp-explorer library, a valid token is refreshed and obtained automatically. See the note below on [how to obtain a token for testing](#running-tests) this library outside of its use with ibp-explorer.


#### Budget Document Library Links

Budget Documents are archived in a Google Drive directory, and a Google Sheets document acts as a catalogue to map the location of these documents with their relevant country/dataset. This catalogue is used to create the correct links in the Document Availability section of the Explorer. 

You can populate the spreadsheet by running:

`npm run populate-gdrive-spreadsheet`

These environment variables need to be set to populate a spreadsheet:

* **DRIVE_ROOT_ID** - ID of the root directory in Google Drive where the documents are archived
* **SPREADSHEET_ID** - ID of the spreadsheet where the found documents are catalogued 


#### Creating a snapshot

Snapshot is the current state of the available documents that is used for displaying historical information about a country. They are stored on S3.

To upload the initial (old) snapshots available from the API run `npm run upload-base-snapshots`

To create a snapshot from the current state of available documents run `npm run update-snapshots`


#### Running tests

Tests are run with `npm test`. A valid Indaba API token will need to be added to the test environment for tests to pass. One way to obtain a valid token is to echo out the `process.env.API_TOKEN` when running the `getTrackerJSON` method from the ibp-explorer codebase (this is clearly not a great procedure, but if you want to test, that's how to get a valid token). Once obtained, this can be added to the .env file for local testing, and to the Travis environment. The token is time-limited and will eventually expire.
