/*
  Copyright (C) 2018, 3DM LLC, All rights reserved
  Unauthorized copying of this file, via any medium is strictly prohibited
  Proprietary and confidential
  Written by Brian Craw <craw.brian@gmail.com>, February 2019

  Revision Comments:
  02/05/2018 - Initial version.
*/

const request = require('request');
var responseObject;

function reportUploadFailed() {
  let alertDiv;
  alertDiv = document.getElementById("uploadMessage");
  topHeading.innerHTML = "";
  if (alertDiv == null) {
    infoHeading.innerHTML = "";
    alertDiv = document.createElement("DIV");
    alertDiv.className = "alert";
    alertDiv.setAttribute("id", "uploadMessage");

    let t = document.createTextNode("A connection with the server could not be established.  The Assessment results were not uploaded."+"\n"+
                                     "Check your network connection and click Retry to try again.");
    alertDiv.appendChild(t);
    infoHeading.appendChild(alertDiv);

    let btnDiv = document.createElement("DIV");
    btnDiv.className = "form-button-div";
    let btn = document.createElement("BUTTON");
    btn.setAttribute("id", "retry_button");
    btn.setAttribute("onclick", "sendResults()");
    btn.setAttribute("style", "margin: 5px");
    btn.className = "form-button";
    t = document.createTextNode("Retry");
    btn.appendChild(t);
    btnDiv.appendChild(btn);

    btn = document.createElement("BUTTON");
    btn.setAttribute("id", "restart_button");
    btn.setAttribute("onclick", "restartAssessment()");
    btn.setAttribute("style", "margin: 5px");
    btn.className = "form-button";
    t = document.createTextNode("Restart");
    btn.appendChild(t);
    btnDiv.appendChild(btn);

    infoHeading.appendChild(btnDiv);
  }
} //reportUploadFailed

function displayUploadSuccessMessage() {
  topHeading.innerHTML = "";
  infoHeading.innerHTML = "";
  let t = createElementAndText("DIV", "Results upload was successful!", "instruction-text", infoHeading);
  t.setAttribute("style", "font-size: 22px; font-weight: bold; text-align: center");

  createButton("restartAssessment()", "Done", wc);

  let hl = document.createElement('BR');
  hl.setAttribute("style", "margin-top: 10px; margin-bottom: 10px");
  wc.appendChild(hl);
} // displayUploadSuccessMessage

function tryAtMost(retryCount, promise) {
	promise = promise||new Promise();

	// try doing the important thing
  sendResultsToQualtrics()
  .then(function(r) {
    successful = true;
    displayUploadSuccessMessage();
    console.log("Uploaded results on retry attempt #" + retryCount);
    //retryCount = count;
    promise.resolve(successful);
  })
  .catch(function(r) {
    successful = false;
    reportUploadFailed();
    console.log("Failed to upload on retry attempt #" + retryCount);
    setTimeout(function() {
      tryAtMost(retryCount - 1, promise);
    }, 2000);
    })
  }

/*
	if(successful) {
		promise.resolve(result);
	} else if (maxRetries > 0) {
		// Try again if we haven't reached maxRetries yet
		setTimeout(function() {
			tryAtMost(otherArgs, maxRetries - 1, promise);
		}, retryInterval);
	} else {
		promise.reject(error);
	}

}
*/

function retryUpload(count) {
  let retryCount;
  let successful = false;

  let p = Promise.resolve();
  for (retryCount = 0; retryCount < count; retryCount++) {
    p = p.then(_ => new Promise(resolve =>
      setTimeout(function() {
        sendResultsToQualtrics()
        .then(function(r) {
          successful = true;
          displayUploadSuccessMessage();
          console.log("Uploaded results on retry attempt #" + retryCount);
        })
        .catch(function(r) {
          successful = false;
          reportUploadFailed();
          console.log("Failed to upload on retry attempt #" + retryCount);
        })
      }, 5000)
  ));
    if (successful == true) {break;}
  }
} // retryUpload

function sendResults() {
  let successful = false;
  setTimeout(function() {
  sendResultsToQualtrics()
    .then(function(r) {
      successful = true;
      displayUploadSuccessMessage();
      return true;
    })
    .catch(function(r) {
      reportUploadFailed();
      console.log("Upload error response: " + r);
      if (successful == false) {
        retryUpload(3);
      }
    })
  }, 10000)
} // sendResults()

function sendResultsToQualtrics() {

  return new Promise(function(resolve, reject) {
  var sessionId;
  let apiToken = "JIhVfX3JOiEV0ZX6J4YOmzvdH2P2IErW99Oz1sEp";
  let surveyId = "SV_9nOLL07nZ2JBdKR";
  let baseUrl = "https://employbridge.az1.qualtrics.com/API/v3/surveys/" + surveyId + "/sessions";
  //baseUrl = "http://httpstat.us/404";
  let successful = false;

  let headers = {
    "x-api-token": apiToken,
    "Content-Type": "application/json"
  };

  let data = {
    "language": "EN",
    "embeddedData": {
      "First":sessionStorage[firstName],
      "Last":sessionStorage[lastName],
      "SSN":sessionStorage[ssn],
      "EmployeeNumber":sessionStorage[employeeNum],
      "AssemblyScore":scores.a1.total.toString(),
      "InspectionScore":scores.a2.total.toString(),
      "TroubleshootingScore":scores.a3.total.toString(),
      "BranchNumber":sessionStorage[branch]
    }
  };

  let createSessionParams = {
    headers: headers,
    uri: baseUrl,
    json: true,
    body: JSON.stringify(data),
    method: 'POST'
  };

  fetch(baseUrl, createSessionParams)
  // create user session
  .then(function(r) {
    console.log("create r.status: " + r.status);
    if (r.status == 201) {
      return r.json();
    }
  })
  .then(function(r) {
      sessionId = r.result.sessionId;
      console.log("Session ID: " + sessionId);

      baseUrl = "https://employbridge.az1.qualtrics.com/API/v3/surveys/" + surveyId + "/sessions/" + sessionId;

      data = {
        "advance": true,
      };

      let updateSessionParams = {
        headers: headers,
        uri: baseUrl,
        json: true,
        body: JSON.stringify(data),
        method: 'POST'
      };

      return fetch(baseUrl, updateSessionParams);
  })
  .then(function (r) {
    console.log("update r.status: " + r.status);

    if (r.status == 200) {
      console.log("Update Session request was successful");

      let result = r.json().then(function(r) {console.log("Update Session Result: "+ JSON.stringify(r));});
      resolve(result);
    } else if (r.status == 404) {
      reject(reason);
    }
  })
  .catch(function(e) {
    let reason = "There was an error with the upload: " + e;
    // store results to a local file
/*
    storeResultsLocally({
      "First":sessionStorage[firstName],
      "Last":sessionStorage[lastName],
      "SSN":sessionStorage[ssn],
      "EmployeeNumber":sessionStorage[employeeNum],
      "AssemblyScore":scores.a1.total.toString(),
      "InspectionScore":scores.a2.total.toString(),
      "TroubleshootingScore":scores.a3.total.toString()
    });
*/
    reject(reason);
  });
});
} //sendResultsToQualtrics
