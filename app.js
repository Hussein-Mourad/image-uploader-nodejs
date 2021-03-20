const createError = require("http-errors");
const express = require("express");
const path = require("path");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const multiparty = require("multiparty");
const { v4: uuidv4 } = require("uuid");
const { stringify } = require("querystring");
var dotenv = require("dotenv").config();

var UPLOAD_PATH = path.resolve(__dirname, "..", process.env.IMG_STORAGE);

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res, next) {
  res.render("index", {
    title: "Image Uploader",
    img_field: process.env.IMG_FIELD,
  });
});

app.post("/upload", function (req, res, next) {
  var form = new multiparty.Form();
  form.maxFilesSize = 15728640;
  var image;
  // const filename = uuidv4();
  // console.log(form);
  form.on("error", () => {
    console.log("error");
  });
  form.on("close", function () {
    res.send(
      `<p>Uploaded ${image.filename} as (${(image.size / 1024) | 0} KB)</p>`
    );
  });

  // listen on part event for image file
  form.on("part", function (part) {
    if (!part.filename) return;
    if (part.name !== "image") return part.resume();
    image = {};
    image.filename = part.filename;
    image.size = 0;
    part.on("data", function (buf) {
      image.size += buf.length;
    });
  });

  // parse the form
  form.parse(req);
});

// app.get("/img/", function (req, res, next) {res.send("hi")});

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
