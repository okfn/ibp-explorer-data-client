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
* **SERVICE_TOKEN** - Google Service JSON token. You can do ``export SERVICE_TOKEN=`cat <path_to_credentials.json>` ``
* **DRIVE_ROOT** - ID of the root where the documents should be searched

#### Populating Google Drive Stylesheet

You can populate the stylesheet by running `npm run populate`. You will be prompted to enter the stylesheet id.
If you want to populate the spreadsheet programmatically you can set the **STYLESHEET_ID** environment variable.