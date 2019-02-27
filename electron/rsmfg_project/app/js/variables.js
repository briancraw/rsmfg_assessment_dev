/*
  Copyright (C) 2018, 3DM LLC, All rights reserved
  Unauthorized copying of this file, via any medium is strictly prohibited
  Proprietary and confidential
  Written by Brian Craw <craw.brian@gmail.com>, February 2019

  Revision Comments:
  02/05/2018 - Initial version.
*/
/*
const electron = require("electron");
const {autoUpdater} = require("electron-updater");
const path = require("path");
const url = require("url");
*/
//var TABLE_CONNECTED = false;
var NO_TABLE = false;
var currentTableVersion = "";
const latestTableVersionMaj = "1";
const latestTableVersionMid = "0";
const latestTableVersionMin = "2";
var updateTable = false;

var SERIAL_DEBUG = false;

var MINUTE = 60000; // 1 minute;
//var A1_TIMER = 20000;
//var A2_TIMER = 20000;;
//var A3_TIMER = 5000;
var A1_TIMER = 10*MINUTE;
var A2_TIMER = 10*MINUTE;
var A3_TIMER = 10*MINUTE;

const ASSESSMENTS = {
  A1: "A1",
  A1A: "A1A",
  A1B: "A1B",
  A2 : "A2",
  A3 : "A3",
};

const CMDS = {
  SA1A: "SA1A",
  SA1B: "SA1B",
  SA2: "SA2",
  SA3: "SA3",
  ST1A: "ST1A",
  ST1B: "ST1B",
  ST2: "ST2",
  ST3: "ST3",
  GR1A: "GR1A",
  GR1B: "GR1B",
  GR2: "GR2",
  GR3: "GR3",
  RS1A: "RS1A",
  RS1B: "RS1B",
  RS2: "RS2",
  RS3: "RS3",
  GFW: "GFW",
  RST: "RST",
};

const STATES = {IDLE       : "IDLE",
                A1A_START  : "A1A_START",
                A1A_ACTIVE : "A1A_ACTIVE",
                A1B_DONE   : "A1A_DONE",
                A1B_START  : "A1B_START",
                A1B_ACTIVE : "A1B_ACTIVE",
                A1B_DONE   : "A1B_DONE",
                A2_START   : "A2_START",
                A2_ACTIVE  : "A2_ACTIVE",
                A2_DONE    : "A2_DONE",
                A3_START   : "A3_START",
                A3_ACTIVE  : "A3_ACTIVE",
                A3_DONE    : "A3_DONE",
                COMPLETE   : "COMPLETE"
              };

var timeinterval;
var remainingTime = {
  'total': 0,
  'minutes': 0,
  'seconds': 0
};
//var waiting = true;

//localStorage["tableUpdated"] = false;

var firstName = 'First Name';
var lastName = 'Last Name';
var ssn = 'Last 4 digits of SSN';
var date = 'Date (MM/DD/YYYY)';
var employeeNum = 'Employee Number';
var branch = "Branch Number";

sessionStorage[firstName] = "";
sessionStorage[lastName] = "";
sessionStorage[ssn] = "";
sessionStorage[date] = "";
sessionStorage[employeeNum] = "";
sessionStorage[branch] = "";

sessionStorage["BOM"] = "";
sessionStorage["len"] = "";
sessionStorage["len_fraction"] = "";
sessionStorage["width1"] = "";
sessionStorage["width1_fractions"] = "";
sessionStorage["width2"] = "";
sessionStorage["width2_fractions"] = "";

const bomAnswer = "4.91";
const width1Answer = "2";
const width1_fractionsAnswer = "1/4";
const width2Answer = "2"
const width2_fractionsAnswer = "1/2";
const lenAnswer = "6";
const len_fractionsAnswer = "";

sessionStorage["leftPocketCount"] = "";
sessionStorage["centerPocketCount"] = "";
sessionStorage["rightPocketCount"] = "";
const leftPocketCountAnswer = "7";
const centerPocketCountAnswer = "3";
const rightPocketCountAnswer = "2";

const A1A_TOTAL_AVAIL_PTS = 8;
const A1B_TOTAL_AVAIL_PTS = 7;
const A1_TOTAL_ASSESS_PTS = 15;
const A1_TOTAL_TIME_PTS = 5;
const A2_TOTAL_ASSESS_PTS = 10;
const A2_TOTAL_TIME_PTS  = 3.33;
const A3_TOTAL_ASSESS_PTS = 9;
const A3_TOTAL_TIME_PTS = 3;

var topHeading = document.getElementById("top-heading");
var infoHeading = document.getElementById("info-heading");
var wc = document.getElementById("window-content");
var preformContent = document.getElementById("preform-content");
var postformContent = document.getElementById("postform-content");
var formName = document.getElementById("form-name");
var formEntry = document.getElementById("form-entry");
var footer = document.getElementById("footer");
