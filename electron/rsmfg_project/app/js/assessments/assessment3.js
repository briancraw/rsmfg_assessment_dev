/*
  Copyright (C) 2018, 3DM LLC, All rights reserved
  Unauthorized copying of this file, via any medium is strictly prohibited
  Proprietary and confidential
  Written by Brian Craw <craw.brian@gmail.com>, February 2019

  Revision Comments:
  02/05/2018 - Initial version.
*/

function startAssessment3() {
  resetWCAll();

  createCountdownTimer(A3_TIMER);
  infoHeading.appendChild(document.createElement("HR"));

  let t = createElementAndText("P", "Open the packet labeled \"Work Instruction Assessment 3\" \
                                     located above the Assessment Table and  and follow the given instructions.",
                           "instruction-text", preformContent);
  t.setAttribute("style", "font-size: 22px; font-weight: bold; text-align: center");

  startTableAssessment3();
} // startAssessment3()

function startTableAssessment3() {
  if (NO_TABLE) {
    processState(CMDS.SA3);
  } else {
    sendSerial(CMDS.SA3);
  }
}
