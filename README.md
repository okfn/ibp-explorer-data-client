# open-budget-indaba-client
[![Build Status](https://travis-ci.org/okfn/open-budget-indaba-client.svg?branch=master)](https://travis-ci.org/okfn/open-budget-indaba-client)
[![Coverage Status](https://coveralls.io/repos/github/okfn/open-budget-indaba-client/badge.svg?branch=master)](https://coveralls.io/github/okfn/open-budget-indaba-client?branch=master)
[![Issues](https://img.shields.io/badge/issue-tracker-orange.svg)](https://github.com/okfn/open-budget-survey/issues)

A Javascript client for the Indaba API


### Dependencies

- node
- npm

### Installation

`git clone https://github.com/keitaroinc/open-budget-indaba-client.git`


## Environment variables

In order to use open-budget-indaba-client the following environment variables need to be set:

* **API_BASE** - Base URL for the API
* **API_TOKEN** - Access token for the API
* **SERVICE_CREDENTIALS** - Google Service JSON token. You can do ``export SERVICE_CREDENTIALS=`cat <path_to_credentials.json>` ``


#### Populating Google Drive Stylesheet

You can populate the stylesheet by running `npm run populate`. 
These environment variables need to be set to populate a stylesheet:


* **DRIVE_ROOT** - ID of the root where the documents should be searched
* **STYLESHEET_ID** - ID of the stylesheet where the found documents should be written
* **PROMISES_NUMBER** - Number of promises (parallel requests) made to google when traversing the tree. This is optional, default is 3.
