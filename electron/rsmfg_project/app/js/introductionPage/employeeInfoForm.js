/*
  Copyright (C) 2018, 3DM LLC, All rights reserved
  Unauthorized copying of this file, via any medium is strictly prohibited
  Proprietary and confidential
  Written by Brian Craw <craw.brian@gmail.com>, February 2019

  Revision Comments:
  02/05/2018 - Initial version.
*/

function employeeInfoForm() {
  sessionStorage[firstName] = "";
  sessionStorage[lastName] = "";
  sessionStorage[ssn] = "";
  sessionStorage[date] = "";
  sessionStorage[employeeNum] = "";
  sessionStorage[branch] = "";

  formName.innerHTML = "";
  formEntry.innerHTML = "";

  createSelectTextElement(firstName+":", formName);
  createFormField(firstName, formEntry);
  createSelectTextElement(lastName+":", formName);
  createFormField(lastName, formEntry);
  createSelectTextElement(ssn+":", formName);
  createFormField(ssn, formEntry);
  createSelectTextElement(date+":", formName);
  createFormField(date, formEntry);
  createSelectTextElement(employeeNum+":", formName);
  createFormField(employeeNum, formEntry);
  createSelectTextElement(branch+":", formName);
  createFormField(branch, formEntry);
} // employeeInfoForm

function validateEntries() {
  let form_incomplete = false;
  let form_invalid = false;
  let dateRegExp = /^(\d?\d)\/(\d?\d)\/(\d\d\d\d)$/;
  let ssnRegExp = /^(\d){4}$/;
  let nameRegExp = /^[a-zA-z]+$/;
  let branchRegExp = /^\d{5}$/;
  let t;

  infoHeading.innerHTML = "";

  // validate each entry
  if (isBlank(sessionStorage[firstName])) {
    console.log("FIRST NAME BLANK " + sessionStorage[firstName]);
    form_incomplete = true;
    sessionStorage[firstName] = "";
    let e = document.getElementById(firstName+"_selectText");
  } else if (!nameRegExp.test(sessionStorage[firstName])) {
    form_invalid = true;
    t = createElementAndText("P", "The First Name field must consist of only letters", "instruction-text", infoHeading);
    t.setAttribute("style", "color:red; text-align:center");
    document.getElementById("window-content").style.backgroundColor = "lightgray";
  }

  if (isBlank(sessionStorage[lastName])) {
    console.log("LAST NAME BLANK " + sessionStorage[lastName]);
    form_incomplete = true;
    sessionStorage[lastName] = "";
  } else if (!nameRegExp.test(sessionStorage[lastName])) {
    form_invalid = true;
    t = createElementAndText("P", "The Last Name field must consist of only letters", "instruction-text", infoHeading);
    t.setAttribute("style", "color:red; text-align:center");
    document.getElementById("window-content").style.backgroundColor = "lightgray";
  }

  if (isBlank(sessionStorage[ssn])) {
    console.log("SSN BLANK " + sessionStorage[ssn]);
    form_incomplete = true;
    sessionStorage[ssn] = "";
  } else if (!ssnRegExp.test(sessionStorage[ssn])) {
    form_invalid = true;
    t = createElementAndText("P", "SSN must be a 4 digit number", "instruction-text", infoHeading);
    t.setAttribute("style", "color:red; text-align:center");
    document.getElementById("window-content").style.backgroundColor = "lightgray";
  }

  if (isBlank(sessionStorage[date])) {
    console.log("DATE BLANK" + sessionStorage[date]);
    form_incomplete = true;
    sessionStorage[date] = "";
  } else if (!dateRegExp.test(sessionStorage[date])) {
    form_invalid = true;
    t = createElementAndText("P", "Date must be in the format MM/DD/YYYY", "instruction-text", infoHeading);
    t.setAttribute("style", "color:red; text-align:center");
    document.getElementById("window-content").style.backgroundColor = "lightgray";
  }

  if (isBlank(sessionStorage[employeeNum])) {
    console.log("EMP NUM BLANK " + sessionStorage[employeeNum]);
    form_incomplete = true;
  }

  if (isBlank(sessionStorage[branch])) {
    form_incomplete = true;
    sessionStorage[branch] = "";
  } else if (!branchRegExp.test(sessionStorage[branch])) {
    form_invalid = true;
    t = createElementAndText("P", "Branch must be a 5 digit number", "instruction-text", infoHeading);
    t.setAttribute("style", "color:red; text-align:center");
    document.getElementById("window-content").style.backgroundColor = "lightgray";
  }

  if (form_incomplete) {
    t = createElementAndText("P", "All entries must be complete before proceeding", "instruction-text", infoHeading);
    t.setAttribute("style", "color:red; text-align:center");
    document.getElementById("window-content").style.backgroundColor = "lightgray";
  } else if (!form_invalid){
    infoHeading.style.color = "black";
    document.getElementById("window-content").style.backgroundColor = "";
    confirmTableLayoutPage();
  }
} // validateEntries
