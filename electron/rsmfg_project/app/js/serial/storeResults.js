/*
  Copyright (C) 2018, 3DM LLC, All rights reserved
  Unauthorized copying of this file, via any medium is strictly prohibited
  Proprietary and confidential
  Written by Brian Craw <craw.brian@gmail.com>, February 2019

  Revision Comments:
  02/08/2019 - Initial version.
*/

const electron = require('electron');
const path = require('path');
const fs = require('fs');

class Store {
  constructor(opts) {
    // Renderer process has to get `app` module via `remote`, whereas the main process can get it directly
    // app.getPath('userData') will return a string of the user's app data directory path.
    const userDataPath = (electron.app || electron.remote.app).getPath('userData');
    // We'll use the `configName` property to set the file name and path.join to bring it all together as a string
    this.path = path.join(userDataPath, opts.configName + '.json');

    this.data = parseDataFile(this.path, opts.defaults);
  }

  // This will just return the property on the `data` object
  get(key) {
    return this.data[key];
  }

  // ...and this will set it
  set(key, val) {
    this.data[key] = val;
    // Wait, I thought using the node.js' synchronous APIs was bad form?
    // We're not writing a server so there's not nearly the same IO demand on the process
    // Also if we used an async API and our app was quit before the asynchronous write had a chance to complete,
    // we might lose that data. Note that in a real app, we would try/catch this.
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }

  clear() {
    fs.writeFileSync(this.path, '');
  }
}

function parseDataFile(filePath, defaults) {
  // We'll try/catch it in case the file doesn't exist yet, which will be the case on the first application run.
  // `fs.readFileSync` will return a JSON string which we then parse into a Javascript object
  try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch(error) {
    // if there was some kind of error, return the passed in defaults instead.
    return defaults;
  }
}

// expose the class
//module.exports = Store;

// First instantiate the class
const store = new Store({
  // We'll call our data file 'user-preferences'
  configName: 'assessment_results_data',
  defaults: {
    "results": []
    /*
    "results": [{
    // 800x600 is the default size of our window
    //windowBounds: { width: 800, height: 600 }
        "First": "Minnie",
        "Last": "",
        SSN: "123456789",
        EmployeeNumber: "123456",
        AssemblyScore: "0.0",
        InspectionScore: "0.0",
        TroubleshootingScore: "0.0"
  }]
*/
  }
});

function storeResultsLocally(resultsNew) {
  let results = store.get('results');
  console.log("RESULTS1: " + JSON.stringify(results));
    //let resultsNew = {};
  results.push(resultsNew);
  store.set('results', results);
  results = store.get('results');
  console.log("RESULTS2: " + JSON.stringify(results));

/*
  if (JSON.stringify(results) === "") {
    resultsNew = {
      First: "BrianNew",
      Last: "Craw"
    };
    console.log("FIRST ENTRY");
  } else {
    let resultsNew = {
      First: "Brian",
      Last: "Craw"
    };
  }
  clearLocalResults();
  results = store.get('results');
  console.log("AFTER CLEAR RESULTS2: " + JSON.stringify(results));
  */
} // storeResultsLocally

function clearLocalResults() {
  store.clear();
} // clearLocalResults()

function uploadLocalResults() {

} // uploadLocalResults()
