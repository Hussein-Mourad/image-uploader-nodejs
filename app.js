const dotenv = require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const multiparty = require("multiparty");
const compression = require("compression");
const UPLOAD_PATH = path.join(__dirname, process.env.IMG_STORAGE);
const MAX_FILES = process.env.MAX_FILES;
var filename;

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middlewares
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression({ level: 4 })); //Compress all routes
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "uploads")));

app.get("/", function (req, res, next) {
  fs.readdir(UPLOAD_PATH, (err, files) => {
    if (files.length > MAX_FILES) {
      for (file of files) {
        fs.unlink(path.join(UPLOAD_PATH, file), (err) => {
          if (err) throw err;
        });
      }
    }
  });

  res.render("index", {
    title: "Image Uploader",
    img_field: process.env.IMG_FIELD,
  });
});

app.post("/upload", function (req, res, next) {
  var form = new multiparty.Form({
    maxFilesSize: 10 * 1024 * 1024,
    uploadDir: UPLOAD_PATH,
  }); //10 MB

  form.on("error", () => {
    console.log("error");
    createError(400);
  });

  // parse the form
  form.parse(req, function (err, fields, files) {
    filename = files.image[0].path.replace(UPLOAD_PATH, "");
    res.redirect("/uploading");
  });
});

app.get("/uploading", function (req, res, next) {
  res.render("uploading", {
    title: "Image Uploader | uploading...",
  });
});

app.get("/results", function (req, res, next) {
  res.render("results", {
    title: "Image Uploader | Results",
    link: path.join(req.headers.host, "img/" + filename),
    filename: "/" + filename,
  });
});

app.get("/img/:id", function (req, res, next) {
  const id = req.params.id;
  const filePath = path.join(UPLOAD_PATH, id);
  res.sendFile(filePath);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
