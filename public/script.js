let progressBar = document.getElementById("progress-bar");
let dragArea = document.getElementById("dragArea");
let image = document.getElementsByName("image");
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
  let files = e.dataTransfer.files;
  handleFiles(files);
}

function handleFiles(files) {
  // var formData = new FormData(form);
  // formData.set("image", files[0]);
  // formData.set("close", true);
  // console.log(files[0]);
  // image.value = files[0];
  console.log(form);

  // form.submit();

  // previewFile(files[0]);
  // files.forEach(uploadFile);
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
