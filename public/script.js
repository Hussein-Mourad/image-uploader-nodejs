let dragArea = document.getElementById("dragArea");
let FileInput = document.getElementById("fileInput");
let form = document.querySelector("form");
let progressBar = document.getElementById("progress-bar");
let loading = document.querySelector("#loading");
let error = document.querySelector("#error");

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

// Gets the files when dropped and handles the request
function handleDrop(e) {
  let files = e.dataTransfer.files;
  FileInput.files = files;
  handleSubmit(files);
}

// Send the request
function handleSubmit(files) {
  // Show loading screen
  loading.style.display = "flex";
  form.style.display = "none";

  var xhr = new XMLHttpRequest();
  var formData = new FormData();
  xhr.open("POST", "/upload", true);

  // Add following event listener
  xhr.upload.addEventListener("progress", function (e) {
    progressBar.value = (e.loaded / e.total) * 100 || 0;
  });

  xhr.addEventListener("readystatechange", function (e) {
    if (xhr.readyState == 4 && xhr.status == 200) {
      location.assign("/results");
    } else if (xhr.readyState == 4 && xhr.status != 200) {
      loading.style.display = "none";
      error.style.display = "flex";
      error.innerText = e.currentTarget.responseText;
    }
  });

  formData.append("image", files[0]);
  xhr.send(formData);
}

// Copies the text of the input field
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
