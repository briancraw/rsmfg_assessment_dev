/*
  Copyright (C) 2018, 3DM LLC, All rights reserved
  Unauthorized copying of this file, via any medium is strictly prohibited
  Proprietary and confidential
  Written by Brian Craw <craw.brian@gmail.com>, February 2019

  Revision Comments:
  02/05/2018 - Initial version.
*/

function assessment1StartPage() {
  resetWCAll();

  let ol = document.createElement("OL");
  let l = document.createElement("LI");
  let t = createElementAndText("P", "This test consists of three timed skill assessments.", "instruction-text", l)
  t.setAttribute("style", "line-height: 2");
  let aul = document.createElement("UL");
  aul.setAttribute("style", "text-align: left");
  t = createElementAndText("LI", "Assessment 1 is 10 minutes", "instructions-text", aul);
  t = createElementAndText("LI", "Assessment 2 is 10 minutes", "instructions-text", aul);
  t = createElementAndText("LI", "Assessment 3 is 10 minutes", "instructions-text", aul);
  l.appendChild(aul);
  ol.appendChild(l);
  l = document.createElement("LI");
  t = createElementAndText("P", 'Detailed instructions are contained in the packets labeled \
                                 "Work Instruction Assessment 1, 2, or 3" attached to the Assessment Table.',
                                 "instruction-text", l)
  t.setAttribute("style", "line-height: 2");
  ol.appendChild(l);
  l = document.createElement("LI");
  t = createElementAndText("P", "Click START below to begin Assessment 1.", "instruction-text", l)
  t.setAttribute("style", "line-height: 2");
  ol.appendChild(l);
  wc.appendChild(ol);

  t = createElementAndText("P", "Click the START button when you are ready", "instruction-text", wc)
  t.setAttribute("style", "font-size: 20px; font-weight: bold; line-height: 2; color:red; text-align:center");
  createButton("startAssessment1()", "START", wc);
} // assessment1StartPage

function startAssessment1() {
  resetWCAll();

  createCountdownTimer(A1_TIMER);
  processState(CMDS.SA1A);

  let t = createElementAndText("P", "Open the packet labeled \"Work Instruction Assessment 1\" \
                                 located above the Assessment Table and follow the given instructions.",
                           "instruction-text", infoHeading);
  t.setAttribute("style", "font-size: 22px; font-weight: bold; text-align: center");
  infoHeading.appendChild(document.createElement("HR"));

  assessment1Questions();
} // startAssessment1

function assessment1Questions() {
  resetWC();
  t = createElementAndText("P", "Review the Bill of Materials, determine the total cost of materials,\
                                     enter it in the box, and click NEXT to proceed to the next question.",
                               "instruction-text", preformContent);
  t.setAttribute("style", "font-size: 18px");
  preformContent.appendChild(document.createElement("BR"));
  BOMQuestion();
} // assessment1Questions

function BOMQuestion() {
  /*
  let table = document.createElement("TABLE");
  let rows = 7;
  let cols = 4;
  let r, c;
  let tr, td, th, type;

  table.innerHTML = '\
      <tr>\
        <th id="r0" colspan=4 class="theader-row">BILL OF MATERIALS - PART NUMBER 1689</th>\
      </tr>\
      <tr>\
        <th>ITEM</th>\
        <th>QUANTITY</th>\
        <th>DESCRIPTION</th>\
        <th>COST/EACH</th>\
      </tr>\
      <tr><td>1</td><td>2</td><td>WHITE PUZZLE BLOCK 8"</td><td>$1.50</td></tr>\
      <tr><td>2</td><td>1</td><td>WHITE PUZZLE BLOCK 6"</td><td>$0.75</td></tr>\
      <tr><td>3</td><td>2</td><td>3/8" X 4" BOLT</td><td>$0.35</td></tr>\
      <tr><td>4</td><td>2</td><td>3/8" X 1.5" WASHER</td><td>$0.15</td></tr>\
      <tr><td>5</td><td>2</td><td>3/8" X .875" WASHER</td><td>$0.03</td></tr>\
      <tr><td>6</td><td>2</td><td>3/8" NUT</td><td>$0.05</td></tr>'

  table.setAttribute("align", "center");
  table.setAttribute("text-align", "center");

  preformContent.appendChild(table);
  preformContent.appendChild(document.createElement("BR"));
*/
  createSelectTextElement("Total Material Cost($)  ", formName);
  createFormField("BOM", formEntry);

  wc.appendChild(document.createElement("BR"));
  createButton("measurementQuestion()", "NEXT", wc);
} // BOMQuestions

function measurementQuestion() {
  console.log("measurementQuestion");
  resetWC();
  infoHeading.innerHTML = "";
  let t = createElementAndText("P", "Continue to follow the instructions from the packet labeled \"Work Instruction Assessment 1\" step #1.",
                           "instruction-text", infoHeading);
  t.setAttribute("style", "font-size: 22px; font-weight: bold; text-align: center");
  infoHeading.appendChild(document.createElement("HR"));

  preformContent.innerHTML = '<p class="instruction-text">Enter the length and two width measurements from step #1 below.  \
                                 The drop-down box is used to select the measurement to the nearest one \
                                 eigth of an inch.<br>For example: If the measurement were 5 7/8 inches then 5 would \
                                 be entered into the first box and 7/8 would be selected from the drop-down.</p>';

  let fractions = ["", "1/8", "1/4", "3/8", "1/2", "5/8", "3/4", "7/8"];

  createSelectTextElement("Length = ", formName);
  let inputDiv = document.createElement("DIV");
  createFormField("len", inputDiv);
  formEntry.appendChild(inputDiv);
  let ff = document.getElementById('len_box');
  ff.setAttribute("style", "width:50px; display: inline");
  createSelectMenu("len_fractions", fractions, inputDiv);
  ff = document.getElementById('len_fractions_select');
  ff.setAttribute("style", "display: inline");
  t = document.createTextNode(" inches");
  inputDiv.appendChild(t);

  createSelectTextElement("Width 1 = ", formName);
  inputDiv = document.createElement("DIV");
  createFormField("width1", inputDiv);
  formEntry.appendChild(inputDiv);
  ff = document.getElementById('width1_box');
  ff.setAttribute("style", "width:50px;  display:inline");
  createSelectMenu("width1_fractions", fractions, inputDiv);
  ff = document.getElementById('width1_fractions_select');
  ff.setAttribute("style", "display:inline");
  t = document.createTextNode(" inches");
  inputDiv.appendChild(t);

  createSelectTextElement("Width 2  = ", formName);
  inputDiv = document.createElement("DIV");
  createFormField("width2", inputDiv);
  formEntry.appendChild(inputDiv);
  ff = document.getElementById('width2_box');
  ff.setAttribute("style", "width:50px; display:inline");
  createSelectMenu("width2_fractions", fractions, inputDiv);
  ff = document.getElementById('width2_fractions_select');
  ff.setAttribute("style", "display: inline");
  t = document.createTextNode(" inches");
  inputDiv.appendChild(t);

  wc.appendChild(document.createElement("BR"));

  createButton('startTableAssessment1A()', "NEXT", wc);
} //measurementQuestion

function startTableAssessment1A() {
  resetWC();

  infoHeading.innerHTML = "";
  infoHeading.appendChild(document.createElement("HR"));
  let t = createElementAndText("P", "Continue to follow the instructions from the packet labeled \"Work Instruction Assessment 1\" step #2.",
                           "instruction-text", infoHeading);
  t.setAttribute("style", "font-size: 22px; font-weight: bold; text-align: center");

  if (NO_TABLE) {
    processState(CMDS.SA1A);
  } else {
    sendSerial(CMDS.SA1A);
  }
} // startTableAssessment1A()

function startTableAssessment1B() {
  resetWC();

  infoHeading.innerHTML = '';
  infoHeading.appendChild(document.createElement("HR"));
  let t = createElementAndText("P", "Continue to follow the instructions from the packet labeled \"Work Instruction Assessment 1\" step #3.",
                               "instruction-text", infoHeading);
  t.setAttribute("style", "font-size: 22px; font-weight: bold; text-align: center");
} // startTableAssessment1B()
