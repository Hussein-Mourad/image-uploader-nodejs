let progressBar = document.getElementById("progress-bar");
let dragArea = document.getElementById("dragArea");
let FileInput = document.getElementById("fileInput");
let form = document.querySelector("form");

/* Event listeners */
try {
  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    dragArea.addEventListener(eventName, preventDefaults, false);
  });

  ["dragenter", "dragover"].forEach((eventName) => {
    dragArea.addEventListener(eventName, highlight, false);
  });

  ["dragleave", "drop"].forEach((eventName) => {
    dragArea.addEventListener(eventName, unhighlight, false);
  });

  dragArea.addEventListener("drop", handleDrop, false);
} catch (error) {}

// Helping functions
function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

function highlight(e) {
  dragArea.classList.add("highlight");
}

function unhighlight(e) {
  dragArea.classList.remove("highlight");
}

function handleDrop(e) {
  let files = e.dataTransfer.files;
  FileInput.files = files;
  form.submit();
}

function copy() {
  /* Get the text field */
  var copyText = document.getElementById("link");
  var copyBtn = document.getElementById("copy-btn");

  /* Select the text field */
  copyText.select();
  copyText.setSelectionRange(0, 99999); /* For mobile devices */

  /* Copy the text inside the text field */
  document.execCommand("copy");
  window.getSelection().removeAllRanges(); // removes the selection
  document.getSelection().addRange(document.createRange()); // removes the selection in older browsers

  copyBtn.innerText = "Copied!";
  copyBtn.classList.add("highlight");
}

// Resets button onblur
function focusOut() {
  var copyBtn = document.getElementById("copy-btn");
  copyBtn.innerText = "Copy link";
  copyBtn.classList.remove("highlight");
}