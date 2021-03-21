let progressBar = document.getElementById("progress-bar");
let dragArea = document.getElementById("dragArea");
let FileInput = document.getElementById("fileInput");
let form = document.querySelector("form");

/* Event listeners */

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
  // const dT = new DataTransfer();
  // dT.items.add(e.dataTransfer.files[0]);
  let files = e.dataTransfer.files;
  FileInput.files = files;
  handleFiles(files);
}

function handleFiles(files) {
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
  window.getSelection().removeAllRanges();
  document.getSelection().addRange(document.createRange());

  copyBtn.innerText = "Copied!";
  copyBtn.classList.add("highlight");
  setTimeout(() => {
    copyBtn.innerText = "Copy link";
    copyBtn.classList.remove("highlight");
    copyText.style.userSelect = "text";
  }, 1000);
}

// function previewFile(file) {
//   let reader = new FileReader();
//   reader.readAsDataURL(file);
//   reader.onloadend = function () {
//     let img = document.createElement("img");
//     img.src = reader.result;
//     document.getElementById("gallery").appendChild(img);
//   };
// }

// function initializeProgress(numfiles) {
//   progressBar.value = 0;
// }

// function progressDone() {
//   filesDone++;
//   progressBar.value = (filesDone / filesToDo) * 100;
// }
