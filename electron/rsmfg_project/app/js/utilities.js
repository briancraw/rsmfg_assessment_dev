/*
  Copyright (C) 2018, 3DM LLC, All rights reserved
  Unauthorized copying of this file, via any medium is strictly prohibited
  Proprietary and confidential
  Written by Brian Craw <craw.brian@gmail.com>, February 2019

  Revision Comments:
  02/05/2018 - Initial version.
*/

function resetWCAll() {
  topHeading.innerHTML = "";
  infoHeading.innerHTML = "";
  wc.innerHTML = ' <div class="preform-content" id="preform-content"></div> \
                   <div class="form-content" id="form-content">\
                     <div class="form-entry" id="form-entry"></div>\
                     <div class="form-name" id="form-name"></div>\
                   </div>\
                   <div class="postform-content" id="postform-content"></div>';

  preformContent = document.getElementById("preform-content");
  postformContent = document.getElementById("postform-content");
  formName = document.getElementById("form-name");
  formEntry = document.getElementById("form-entry");
  footer.innerHTML = "";
}

function resetWC() {
  wc.innerHTML = ' <div class="preform-content" id="preform-content"></div> \
                   <div class="form-content" id="form-content">\
                     <div class="form-entry" id="form-entry"></div>\
                     <div class="form-name" id="form-name"></div>\
                   </div>\
                   <div class="postform-content" id="postform-content"></div>';

  preformContent = document.getElementById("preform-content");
  postformContent = document.getElementById("postform-content");
  formName = document.getElementById("form-name");
  formEntry = document.getElementById("form-entry");
}

function createElementAndText(elementType, text, className, parent) {
  let textDiv = document.createElement(elementType);
  let t = document.createTextNode(text);
  textDiv.className = className;
  textDiv.appendChild(t);
  parent.appendChild(textDiv);
  return textDiv;
} // createDivAndText

function createButton(callback, text, element) {
  // Create NEXT button
  //let footer = document.getElementById("footer");
  let btnDiv = document.createElement("DIV");
  //nextBtnDiv.setAttribute("id", "next-button-div");
  btnDiv.className = "form-button-div";
  let btn = document.createElement("BUTTON");
  btn.setAttribute("id", text+"_button");
  btn.setAttribute("onclick", callback);
  btn.className = "form-button";
  let t = document.createTextNode(text);
  btn.appendChild(t);
  btnDiv.appendChild(btn);
  element.appendChild(btnDiv);
} // createButton

function createSelectTextElement(text, element) {
  let selectText = document.createElement("DIV");
  let t = document.createTextNode(text);
  //selectText.className = "fill-box-desc-txt";
  selectText.className = "form-text";
  selectText.appendChild(t);
  element.appendChild(selectText);
} // createSelectTextElement

function createFormField(text, element) {
  let formInput = document.createElement("INPUT");
  formInput.setAttribute("type", "text");
  formInput.setAttribute("id", text+"_box");
  //formInput.className = "col-1 selections";
  formInput.className = "form-selections";
  element.appendChild(formInput);
  //element.appendChild(formDiv);

  formInput.addEventListener('change', function (e) {
    //var input = document.getElementById(text+'_box');
    //if (localStorage[text]) {
    //     input.value = localStorage[text];
    //}
    //input.onchange = function () {
    sessionStorage[text] = e.target.value;
    console.log("FormField: " + text + " : " + sessionStorage[text]);
    //console.log("FormField: " + text + " : " + e.target.value);
    //}
  });
}

function createFormEntry(text, element) {
  let formDiv = document.createElement("DIV");
  let formLabel = document.createElement("LABEL");
  //formLabel.className = "form_text"
  formLabel.innerHTML = text+":";
  formDiv.appendChild(formLabel);
  let formInput = document.createElement("INPUT");
  formInput.setAttribute("type", "text");
  formInput.setAttribute("id", text+"_box");
  //formInput.className = "col-1 selections";
  formInput.className = "form_selections";
  formDiv.appendChild(formInput);
  element.appendChild(formDiv);

  formInput.addEventListener('change', function (e) {
    //var input = document.getElementById(text+'_box');
    //if (localStorage[text]) {
    //     input.value = localStorage[text];
    //}
    //input.onchange = function () {
    sessionStorage[text] = e.target.value;
    console.log("SS: " + text + " : " + sessionStorage[text]);
    //}
  });
} // createFormEntry

/*
function updateBranchSelectMenu(state) {
  let selections = document.getElementById("Branch_select");
  if (locations.hasOwnProperty(state)) {
    let options = [];//locations[state];
    let len = locations[state].length;
    for (let i = 0; i < len; i++) {
      options.push("<option value="+locations[state][i]+" class=select-options>"+locations[state][i]+"</option>");
    }
    selections.innerHTML = options.join();
    sessionStorage["Branch"] = selections.value;
    } else {
    console.log("ERROR: "+state+" is not a valid selection!");
  }
} // updateBranchSelectMenu
*/

function createSelectMenu(text, list, element) {
  let selections = document.createElement("SELECT");
  selections.className = "form-selections";
  selections.setAttribute("id", text+"_select");      // Create a <button> element
  let arrayLength = list.length;
  for (let i = 0; i < arrayLength; i++) {
    let l = document.createElement("OPTION");
    l.setAttribute("value", list[i]);
    l.className = "select-options";
    l.innerHTML = list[i];
    selections.appendChild(l);
  }
  element.appendChild(selections);
  sessionStorage[text] = selections.value;

//  document.addEventListener('DOMContentLoaded', function () {
  selections.addEventListener('change', function () {
    var input = document.getElementById(text+'_select');
    sessionStorage[text] = this.value;
    console.log("SelectMentu: " + text + " : " + sessionStorage[text]);

    if (sessionStorage[text]) {
      input.value = sessionStorage[text];
    }
    input.onchange = function () {
      sessionStorage[text] = this.value;
      /*
      if (text == "State") {
        updateBranchSelectMenu(this.value);
      }
      */
    }
  });
} // createSelectMenu

function isBlank(str) {
  return (!str || /^\s*$/.test(str));
} // isBlank

function reportNotConnected() {
  let alertDiv;
  alertDiv = document.getElementById("alertMessage");
  if (alertDiv == null) {
    wc.innerHTML = "";
    alertDiv = document.createElement("DIV");
    alertDiv.className = "alert";
    alertDiv.setAttribute("id", "alertMessage");

    let t = document.createTextNode("No Assessment Table detected. Any collected Assessment data may be invalid."+"\n"+
                                     "Please connect the USB cable from the table and click Restart to restart the application.");
    alertDiv.appendChild(t);
    wc.appendChild(alertDiv);

    let btnDiv = document.createElement("DIV");
    btnDiv.className = "form-button-div";
    let btn = document.createElement("BUTTON");
    btn.setAttribute("id", "alert_restart_button");
    btn.setAttribute("onclick", "restartAssessment()");
    btn.setAttribute("style", "margin: 5px");
    btn.className = "form-button";
    t = document.createTextNode("Restart");
    btn.appendChild(t);
    btnDiv.appendChild(btn);
    wc.appendChild(btnDiv);
    //topHeading.style.visibility = "hidden";
    //wc.style.visibility = "hidden";
    //footer.style.visibility = "hidden";
    footer.innerHTML = "";
  } else {
    //alertDiv.remove();
    //alertDiv.innerHTML = "";
    //alertDiv.setAttribute("style", "display=show");
  }
} //reportNotConnected

function clearNotConnected() {
  let alertDiv = document.getElementById("alertMessage");
  if (alertDiv != null) {
    alertDiv.remove();
  }
  let alertButtonDiv = document.getElementById("alert_restart_button");
  if (alertButtonDiv != null) {
    alertButtonDiv.remove();
  }
  topHeading.style.visibility = "visible";
  wc.style.visibility = "visible";
  footer.style.visibility = "visible";
} // clearNotConnected()

function clearNotUploaded() {
  let alertDiv = document.getElementById("alertMessage");
  if (alertDiv != null) {
    alertDiv.remove();
  }
  let alertButtonDiv = document.getElementById("alert_restart_button");
  if (alertButtonDiv != null) {
    alertButtonDiv.remove();
  }
  topHeading.style.visibility = "visible";
  wc.style.visibility = "visible";
  footer.style.visibility = "visible";
} // clearNotConnected()

var {ipcRenderer, remote} = require('electron');

ipcRenderer.on('showVersion', (event, arg) => {
  var { dialog } = require('electron').remote;
  var path = require('path');
  var appVersion = require('electron').remote.app.getVersion();

  const dialogOpts = {
     type: 'info',
    // buttons: ['Restart', 'Later'],
     title: 'RSMF Assessment Application',
     message: "Version: " + appVersion,
     //icon: path.join("app", "img", "icon_full.ico"),
     //detail: 'A new version has been downloaded. Restart the application to apply the updates.'
   };
   dialog.showMessageBox(null, dialogOpts, (response) => {});
});
