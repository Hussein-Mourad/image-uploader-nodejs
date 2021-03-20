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
  console.log(files, FileInput.files);
  // let formData = new FormData(form);
  // formData.set(image, files[0]);
  // console.log(form)
  form.submit();
  // uploadFile(files[0]);
  // previewFile(files[0]);
  // files.forEach(uploadFile);
}

function uploadFile(file) {
  let url = "http://localhost:3000/upload";
  let formData = new FormData();

  formData.append(image, file);
  console.log(formData.get("image"));

  fetch(url, {
    method: "POST",
    body: formData,
  })
    .then((req) => {
      console.log(req);
      return req.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.error(err);
    });
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
