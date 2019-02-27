/*
  Copyright (C) 2018, 3DM LLC, All rights reserved
  Unauthorized copying of this file, via any medium is strictly prohibited
  Proprietary and confidential
  Written by Brian Craw <craw.brian@gmail.com>, February 2019

  Revision Comments:
  02/05/2018 - Initial version.
*/

function reportDownloadInProgress() {
  let notifDiv;
  notifDiv = document.getElementById("notifMessage");
  if (notifDiv == null) {
    infoHeading.innerHTML = "";
    notifDiv = document.createElement("DIV");
    notifDiv.className = "notification";
    notifDiv.setAttribute("id", "notifMessage");
    let msg = "A new version of the Application is being downloaded." + "\n" + "Upon completion the Application will automatically restart." + "\n" + "Please do not close the Application.";
    let t = document.createTextNode(msg);
    notifDiv.appendChild(t);
    infoHeading.appendChild(notifDiv);
  }
} //reportDownloadInProgress

// wait for an updateReady message
ipcRenderer.on('updateAvailable', function(event, text) {
  reportDownloadInProgress();
});

ipcRenderer.on('programTable', function(event, text) {
  port.close(programTable(portName));
});

ipcRenderer.on('closeSerial', function(event, text) {
  port.close(programTable(portName));
});

connectToTable();

if (SERIAL_DEBUG == true) {
  serialDebugBox("Serial CMD");
} else {
  introductionPage();
}
