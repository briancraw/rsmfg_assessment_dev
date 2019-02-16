/*
  Copyright (C) 2018, 3DM LLC, All rights reserved
  Unauthorized copying of this file, via any medium is strictly prohibited
  Proprietary and confidential
  Written by Brian Craw <craw.brian@gmail.com>, February 2019

  Revision Comments:
  02/05/2018 - Initial version.
*/

const {getCurrentWindow, globalShortcut} = require('electron').remote;

function captureTime(assessment) {
  switch (assessment) {
    case ASSESSMENTS.A1A:
      if (remainingTime.total <= 0) {
        scores.a1.a1a.tableTime = A1_TIMER;
      } else {
        scores.a1.a1a.tableTime = A1_TIMER - remainingTime.total;
      }
      break;
    case ASSESSMENTS.A1B:
      if (remainingTime.total <= 0) {
        scores.a1.a1b.tableTime = A1_TIMER;
      } else {
        scores.a1.a1b.tableTime = A1_TIMER - remainingTime.total - scores.a1.a1a.tableTime;
      }
      break;
      case ASSESSMENTS.A1:
        if (remainingTime.total <= 0) {
          scores.a1.tableTime = A1_TIMER;
        } else {
          scores.a1.tableTime = scores.a1.a1b.tableTime + scores.a1.a1b.tableTime;
        }
        scores.a1.questionTime = A1_TIMER - remainingTime.total;
       break;
    case ASSESSMENTS.A2:
      if (remainingTime.total <= 0) {
        scores.a2.tableTime = A2_TIMER;
      } else {
        scores.a2.tableTime = A2_TIMER - remainingTime.total;
      }
      break;
    case ASSESSMENTS.A3:
      if (remainingTime.total <= 0) {
        scores.a3.tableTime = A3_TIMER;
      } else {
        scores.a3.tableTime = A3_TIMER - remainingTime.total;
      }
      break;
    default:
  }
} // captureTime

function calculateA1Score() {
  let score = 0;
  let numAnswers = 8;
  if (sessionStorage["BOM"] == bomAnswer) {
    score = score + 5;
  }
  console.log("BOM SCORE: " + score);

  if (sessionStorage["width1"] == width1Answer) {
    if (sessionStorage["width1_fractions"] == width1_fractionsAnswer) {
      score = score + 1;
    }
  }
  console.log("WIDTH1 SCORE: " + score);

  if (sessionStorage["width2"] == width2Answer) {
    if (sessionStorage["width2_fractions"] == width2_fractionsAnswer) {
      score = score + 1;
    }
  }
  console.log("WIDTH2 SCORE: " + score);

  if (sessionStorage["len"] == lenAnswer) {
    if (sessionStorage["len_fractions"] == len_fractionsAnswer) {
      score = score + 1;
    }
  }
  console.log("LEN SCORE: " + score);

  // A1A has 3 available points
  score = score + scores.a1.a1a.tableScore;
  console.log("A1A TABLE SCORE: " + score);

  // A1B has 4 available points
  score = score + scores.a1.a1b.tableScore;
  console.log("A1B TABLE SCORE: " + score);

  let a1TotalTime = scores.a1.a1b.tableTime+scores.a1.a1a.tableTime
  let a1TimeScore = getTimeScore(a1TotalTime);
  console.log ("A1 Time " + a1TotalTime + ", " + a1TimeScore);
  a1TimeScore = (a1TimeScore/100) * A1_TOTAL_TIME_PTS;
  console.log ("A1 Time Score " + a1TimeScore);
  score = score + a1TimeScore;
  console.log("A1 SCORE: " + score);

  return score;
} // calculateA1Score

function calculateA2Score() {
  let score = 0;
  if (sessionStorage["leftPocketCount"] == leftPocketCountAnswer) {
    score = score + 1;
  }
  if (sessionStorage["centerPocketCount"] == centerPocketCountAnswer) {
    score = score + 1;
  }
  if (sessionStorage["rightPocketCount"] == rightPocketCountAnswer) {
    score = score + 1;
  }
  console.log("A2 POCKET SCORE: " + score);
  // A2 has 7 available points
  score = score + scores.a2.tableScore;
  console.log("A2 TABLE SCORE: " + score);
  let a2TimeScore = getTimeScore(scores.a2.tableTime);
  console.log ("A2 Time " + scores.a2.tableTime + ", " +  a2TimeScore);
  a2TimeScore = (a2TimeScore/100) * A2_TOTAL_TIME_PTS;
  console.log ("A2 Time Score " + a2TimeScore);
  score = score + a2TimeScore;
  //score = score + getTimeScore(scores.a2.tableTime);
  console.log("A2 SCORE: " + score);

  return score;
} // calculateA2Score

function calculateA3Score() {
  let score = 0;

  // A3 has 9 available points
  score = score + scores.a3.tableScore;
  console.log("A3 TABLE SCORE: " + score);
  let a3TimeScore = getTimeScore(scores.a3.tableTime);
  console.log ("A3 Time " + scores.a3.tableTime + ", " +  a3TimeScore);
  a3TimeScore = (a3TimeScore/100) * A3_TOTAL_TIME_PTS;
  console.log ("A3 Time Score " + a3TimeScore);
  score = score + a3TimeScore;
  console.log("A3 SCORE: " + score);

  return score;
} // calculateA3Score

function getTimeScore(val) {
  if (val < MINUTE*3) { // 3 minutes
    return 100;
  } else if (val < MINUTE*6) { // 6 minutes
    return 50;
  } else if (val < MINUTE*9) { // 9 minutes
    return 33.33;
  } else if (val < MINUTE*10) { // 10 minutes
    return 10;
  } else {
    return 0;
  }
} // getTimeScore

function calculateScores() {
  // A1 Total
  scores.a1.total = (calculateA1Score()/(A1_TOTAL_ASSESS_PTS + A1_TOTAL_TIME_PTS))*100;
  scores.a2.total = (calculateA2Score()/(A2_TOTAL_ASSESS_PTS + A2_TOTAL_TIME_PTS))*100;
  scores.a3.total = (calculateA3Score()/(A3_TOTAL_ASSESS_PTS + A3_TOTAL_TIME_PTS))*100;

  console.log ("A1.TOTAL: " + scores.a1.total);
  console.log ("A2.TOTAL: " + scores.a2.total);
  console.log ("A3.TOTAL: " + scores.a3.total);
  console.log("SCORES: " + JSON.stringify(scores));
} // calculateScores

function displayScores() {
  resetWCAll();

  displayUploadInProgress();

  let t = createElementAndText("DIV", "Assessment Test Complete!", "instruction-text", wc);
  t.setAttribute("style", "font-size: 22px; font-weight: bold; text-align: center");
  let hl = document.createElement('BR');
  hl.setAttribute("style", "margin-top: 10px; margin-bottom: 10px");
  wc.appendChild(hl);

  t = createElementAndText("DIV", "Below are your scores.", "instruction-text", wc);
  t.setAttribute("style", "font-size: 22px; font-weight: bold; text-align: center");
  hl = document.createElement('BR');
  hl.setAttribute("style", "margin-top: 10px; margin-bottom: 10px");
  wc.appendChild(hl);

  t = createElementAndText("DIV" ,"Assessment 1:  " + scores.a1.total.toFixed(2) + "%", "instruction-text", wc);
  t.setAttribute("style", "font-size: 22px; font-weight: bold; text-align: center");
  t = createElementAndText("DIV" ,"Assessment 2:  " + scores.a2.total.toFixed(2) + "%", "instruction-text", wc);
  t.setAttribute("style", "font-size: 22px; font-weight: bold; text-align: center");
  t = createElementAndText("DIV" ,"Assessment 3:  " + scores.a3.total.toFixed(2) + "%", "instruction-text", wc);
  t.setAttribute("style", "font-size: 22px; font-weight: bold; text-align: center");
} // displayScores

function displayUploadInProgress() {
    let t = createElementAndText("DIV", "Results upload in progress...", "instruction-text", topHeading);
    t.setAttribute("style", "font-size: 24px; font-weight: bold; text-align: center");
}

function assessmentsComplete() {
  //resetWCAll();
  calculateScores();
  sendResults();
  displayScores();
} // assessmentsCompleted

var reload = ()=>{
  getCurrentWindow().reload()
}

function restartAssessment() {
  reload();
}
