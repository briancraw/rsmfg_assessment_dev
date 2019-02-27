/*
  Copyright (C) 2018, 3DM LLC, All rights reserved
  Unauthorized copying of this file, via any medium is strictly prohibited
  Proprietary and confidential
  Written by Brian Craw <craw.brian@gmail.com>, February 2019

  Revision Comments:
  02/05/2018 - Initial version.
*/
//const { session }  = require('electron');
const session = require('electron').remote.session;

var currentState = STATES.IDLE;
var nextState = STATES.IDLE;

var a1Timeout = false;
var a2Timeout = false;
var a3Timeout = false;

var scores = {
  a1 : {
    total : 0.0,
    tableScore : 0,
    tableTime : 0,
    questionsScore : 0,
    a1BOMScore : 0,
    a1a1MeasurementScore : 0,
    questionsTime : 0,
    a1a : {
      tableScore : 0,
      tableTime : 0
    },
    a1b : {
      tableScore : 0.0,
      tableTime : 0,
    },
  },
  a2 : {
    total : 0.0,
    tableScore : 0,
    tableTime : 0,
    questionsScore : 0,
    questionsTime : 0,
  },
  a3 : {
    total : 0.0,
    tableScore : 0,
    tableTime : 0,
    questionsScore : 0,
    questionsTime : 0,
  }
} // scores

function parseSerial(data) {
//  console.log("Received: " + data);
  processState(data);
}

const responseRegExp = /(?<cmd>\w+):? ?(?<resp>.*)/;
const tableVersionRegExp = /Starting RSMFG skills assessment test version (?<tableVersionMaj>\d+)\.(?<tableVersionMid>\d+)\.(?<tableVersionMin>\d+)/;
const pwmRegExp = /(?<id>\d+):PWM:(?<val>\w+)/;

function checkForTableUpdate(str) {
    if (match = tableVersionRegExp.exec(str)) {
      let maj = match.groups.tableVersionMaj;
      let mid = match.groups.tableVersionMid;
      let min = match.groups.tableVersionMin;
      currentTableVersion = maj.concat(mid, min);
      if (latestTableVersionMaj > maj) {
        updateTable = true;
      } else if (latestTableVersionMid > mid) {
        updateTable = true;
      } else if (latestTableVersionMin > min) {
        updateTable = true;
      }
      console.log("Current Table Version: " + maj + "." + mid + "." + min);
      console.log("Latest Table Version: " + latestTableVersionMaj + "." + latestTableVersionMid + "." + latestTableVersionMin);

      if (updateTable == true) {
        programTable(portName);
      } else {
        console.log("Table is up to date");
      }
    } // expre match?
} // checkForTableUpdate()

function processState(data) {
  let match;
  let d = data.trim();
  console.log(currentState + ": " + d);
  nextState = currentState;

  checkForTableUpdate(d);

  switch (currentState) {
    case STATES.IDLE:
      if (d == CMDS.SA1A) {
        clearResults(scores);
        a1Timeout = false;
        a2Timeout = false;
        a3Timeout = false;
        currentState = STATES.A1A_ACTIVE;
        if (NO_TABLE) {
          processState(CMDS.SA1A);
        } else {
          processState(CMDS.SA1A);
        }
      } else if (d == CMDS.RST) {
        console.log("Assessment Table has been reset");
      }
      break;
    case STATES.A1A_ACTIVE:
      if (d == CMDS.SA1A) {
        if (NO_TABLE) {
          processState("SA1A: 75.0");
        }
      } else if ((match = responseRegExp.exec(d)) && match.groups.cmd == CMDS.SA1A) {
        captureTime(ASSESSMENTS.A1A);
        scores.a1.a1a.tableScore = parseInt(match.groups.resp);
        currentState = STATES.A1B_ACTIVE;
        startTableAssessment1B();
        sendSerial(CMDS.SA1B);
      } else if ((match = responseRegExp.exec(d)) && match.groups.cmd == CMDS.ST1A) {
        // if timeout occurred during A1A then skip A1B table and questions
        // and move on to A2
        captureTime(ASSESSMENTS.A1A);
        captureTime(ASSESSMENTS.A1B);
        scores.a1.a1a.tableScore = parseInt(match.groups.resp);
        //scores.a1.a1a.tableScore = match.groups.resp;
        scores.a1.a1b.tableScore = 0;
        currentState = STATES.A2_ACTIVE;
        startAssessment2();
      }
      break;
    case STATES.A1B_ACTIVE:
      if (d == CMDS.SA1B) {
        if (NO_TABLE) {
          processState("SA1B: 5.0");
        }
        // do nothing. timer is already running
      } else if ((match = responseRegExp.exec(d)) && match.groups.cmd == CMDS.SA1B) {
        clearInterval(timeinterval);
        captureTime(ASSESSMENTS.A1B);
        captureTime(ASSESSMENTS.A1);
        scores.a1.a1b.tableScore = parseInt(match.groups.resp);
        currentState = STATES.A2_ACTIVE;
        startAssessment2();
      } else if ((match = responseRegExp.exec(d)) && match.groups.cmd == CMDS.ST1B) {
        captureTime(ASSESSMENTS.A1B);
        captureTime(ASSESSMENTS.A1);
        scores.a1.a1b.tableScore = parseInt(match.groups.resp);
        currentState = STATES.A2_ACTIVE;
        startAssessment2();
      }
      break;
    case STATES.A2_ACTIVE:
      if (d == CMDS.SA2) {
        if (NO_TABLE) {
          processState("SA2: 100.00");
        }
      } else if ((match = responseRegExp.exec(d)) && match.groups.cmd == CMDS.SA2) {
        clearInterval(timeinterval);
        // process Assessment 2 questions then stop the timer
        captureTime(ASSESSMENTS.A2);
        scores.a2.tableScore = parseInt(match.groups.resp);
        currentState = STATES.A3_ACTIVE;
        startAssessment3();
      } else if ((match = responseRegExp.exec(d)) && match.groups.cmd == CMDS.ST2) {
        captureTime(ASSESSMENTS.A2);
        scores.a2.tableScore = parseInt(match.groups.resp);
        currentState = STATES.A3_ACTIVE;
        startAssessment3();
      }
      break;
    case STATES.A3_ACTIVE:
      if (d == CMDS.SA3) {
        if (NO_TABLE) {
          processState("SA3: 80.01");
        }
      } else if ((match = responseRegExp.exec(d)) && match.groups.cmd == CMDS.SA3) {
        clearInterval(timeinterval);
        captureTime(ASSESSMENTS.A3);
        scores.a3.tableScore = parseInt(match.groups.resp);
        assessmentsComplete();
        currentState = STATES.COMPLETE;
        if (NO_TABLE) {
          processState(CMDS.RST);
        } else {
          sendSerial(CMDS.RST);
        }
      } else if ((match = responseRegExp.exec(d)) && match.groups.cmd == CMDS.ST3) {
        captureTime(ASSESSMENTS.A3);
        // calc total A3 score
        scores.a3.tableScore = parseInt(match.groups.resp);
        assessmentsComplete();
        currentState = STATES.COMPLETE;
        if (NO_TABLE) {
          processState(CMDS.RST);
        } else {
          sendSerial(CMDS.RST);
        }
      }
      /*
      if (match = pwmRegExp.exec(d)) {
        updateA3Status("w"+match.groups.id, match.groups.val);
      }
      */
      break;
    case STATES.COMPLETE:
      if (d == CMDS.RST) {
        currentState = STATES.IDLE;
      }
      break;
    default:
  }
} // processState

function timeoutHandler() {
  console.log("TIMER HAS EXPIRED!");
    switch (currentState) {
      case STATES.IDLE:
        a1Timeout = true;
        sendSerial(CMDS.ST1A);
        break;
      case STATES.A1A_ACTIVE:
        a1Timeout = true;
        sendSerial(CMDS.ST1A);
        break;
      case STATES.A1B_ACTIVE:
        a1Timeout = true;
        sendSerial(CMDS.ST1B);
        break;
      case STATES.A2_ACTIVE:
        a2Timeout = true;
        sendSerial(CMDS.ST2);
        break;
      case STATES.A3_ACTIVE:
        a3Timeout = true;
        sendSerial(CMDS.ST3);
        break;
      default:
    }
} // timeoutHandler

function clearResults(scores) {
  for (const score in scores) {
    if (scores.hasOwnProperty(score)) {
      if (typeof scores[score] === 'object' && scores[score] !== null) {
        clearResults(scores[score]);
      } else {
        scores[score] = 0.0;
      }
    }
  }
} // clearResults
