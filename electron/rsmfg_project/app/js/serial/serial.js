/*
  Copyright (C) 2018, 3DM LLC, All rights reserved
  Unauthorized copying of this file, via any medium is strictly prohibited
  Proprietary and confidential
  Written by Brian Craw <craw.brian@gmail.com>, February 2019

  Revision Comments:
  02/05/2018 - Initial version.
*/

var {ipcRenderer, remote} = require('electron');
var rdyForResults = false;

var port;
var portName = null;

var SerialPort = require('serialport');
var parsers = SerialPort.parsers;

function connectToTable() {
  connectToTablePromise()
    .then(function(r) {
      clearNotConnected();
      console.log("Connected to Assessment Table Port " + portName);
    //  TABLE_CONNECTED = true;
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
    })
    .catch(function (r) {
      console.log(r.message);
      reportNotConnected();
    });
} // connectToTable()

function connectToTablePromise(baud = 9600) {
    return new Promise(function(resolve, reject) {
      //let portName = null;
      SerialPort.list(function (err, ports) {
        ports.forEach(function(port) {
          console.log("Port " + port.comName + ", Vendor " + port.vendorId + ", Manufacturer " + port.manufacturer);
          if ((port.vendorId == '2341') || (typeof port.manufacturer !== 'undefined' && port.manufacturer.includes("Arduino LLC"))) {
            portName = port.comName;
          }
        });

        if (portName != null) {
          console.log("Connecting to " + portName);
          port = new SerialPort(portName, {
            baudRate: baud
          });
          const parser = new parsers.Readline({ delimiter: '\n' });

          parser.on('data', parseSerial);
          port.pipe(parser);

          port.on("open", showPortOpen);
          port.on("close", showPortClose);
          port.on('error', showError);

          let serialInfo = {connected: true, portName: portName, ports: ports};
          resolve(serialInfo);
        } else {
          let reason = new Error("Failed to Connect!");
          reject(reason);
        }
      });
    });
} // connectToTablePromise()

function closePortPromise() {
  return new Promise(function (resolve, reject) {
    port.close();
    resolve(true);
  });
} // closePortPromise()

function programTable(portName) {
  closePortPromise()
  .then(
    programTablePromise(portName)
   .then(function(r) {
      console.log("Table reprogrammed.  Reloading...")
      reload();
    })
    .catch(function (r) {
      console.log(r.message);
    })
  );
} //programTable()

function programTablePromise(portName) {
  return new Promise(function (resolve, reject) {
    let {execFile} = require('child_process');
    let path = require("path");
  //  let hexfile = path.join(__dirname, '../', 'build', 'rsmfg_blink.ino.hex');
    //let hexfile = path.join(__dirname, '../', 'build', 'rsmfg_blink_fast.ino.hex');
    let appFolder = path.resolve(process.execPath, '..');
    cwd = path.join(appFolder, 'build');
    let hexfile = path.join(cwd, 'rsmfg.ino.hex');
    let avrdudeCmd = path.join(cwd, 'avrdude.exe');
    let avrConf = path.join(cwd, 'avrdude.conf');
    let avrConfOpt = "-C"+avrConf;
    let flashOpt = "-Uflash:w:"+hexfile+":i";
    let portOpt = "";

    if (portName != "") {
      portOpt = "-P"+portName;
      console.log("Programming Table...");
      const child = execFile(avrdudeCmd, ['-v', '-patmega2560', '-cwiring', portOpt,  '-b115200', '-D', flashOpt, avrConfOpt], (err, stdout, stderr) => {
        if (err) {
          reject(err);
          console.log(err);
        }
        console.log(stdout.toString());
        resolve(true);
      });
    }
  }); // promise
} // programTable

ipcRenderer.on('connectToAssessmentTable', (event, arg) => {
  connectToTable();
});

function sendSerial(command) {
  console.log("Sending "+command);
  port.write(command + '\r');
}

function showPortClose() {
  console.log("USB Connection Lost: ");
  //TABLE_CONNECTED = false;
  reportNotConnected();
}

function showError(error) {
  console.log("Serial port error: " + error);
}

function showPortOpen() {
  console.log("USB Port Succesfully Opened");
}

function serialDebugBox(text) {
  let formDiv = document.createElement("DIV");
  let formLabel = document.createElement("LABEL");
  formLabel.className = "fill-box-desc-txt"
  formLabel.innerHTML = text+":";
  formDiv.appendChild(formLabel);
  let formInput = document.createElement("INPUT");
  formInput.setAttribute("type", "text");
  formInput.setAttribute("id", text+"_box");
  formInput.className = "selections";
  formDiv.appendChild(formInput);
  wc.appendChild(formDiv);

  formInput.addEventListener('change', function (e) {
    sendSerial(e.target.value);
  });
}
