/*
  Copyright (C) 2018, 3DM LLC, All rights reserved
  Unauthorized copying of this file, via any medium is strictly prohibited
  Proprietary and confidential
  Written by Brian Craw <craw.brian@gmail.com>, February 2019

  Revision Comments:
  02/05/2018 - Initial version.
*/

function introductionPage() {
  resetWCAll();

  let t = createElementAndText("DIV", "Welcome to the ResourceMFG Practical Assessment!",
                               "", topHeading);
  t = createElementAndText("DIV", "To get started please fill out the information below and click the NEXT button.",
                        "instruction-text", preformContent);
  t.setAttribute("style", "text-align:center");
  br = document.createElement("BR");
  preformContent.appendChild(br);

  employeeInfoForm();

  createButton("validateEntries()", "NEXT", footer);
} // introductionPage

function alertNoCertify() {
  let alertDiv = document.createElement("DIV");
  alertDiv.className = "alert";
  let alertSpan = document.createElement("SPAN");
  alertSpan.className = "closebtn";
  alertSpan.setAttribute("onclick", "this.parentElement.style.display='none';");
  alertSpan.innerHTML = "&times;";
  alertDiv.appendChild(alertSpan);
  let t = document.createTextNode("The Assessment is not valid until the certification is accepted!");
  alertDiv.appendChild(t);
  alertDiv.setAttribute("style", "font-size: 20px; font-weight: bold");
  infoHeading.appendChild(alertDiv);
} // alertNoCertify
