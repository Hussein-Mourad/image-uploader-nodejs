const createError = require("http-errors");
const express = require("express");
const path = require("path");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const multiparty = require("multiparty");
const { v4: uuidv4 } = require("uuid");
const { stringify } = require("querystring");
const dotenv = require("dotenv").config();

const UPLOAD_PATH = path.join(__dirname, process.env.IMG_STORAGE);

const MAX_FILES = process.env.MAX_FILES;

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
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
    link: "gfhgfdhgfhfghgfhgfhghghgfgfhfghngfhgfhgfhgfhgfhgfhgf",
  });
});

app.post("/upload", function (req, res, next) {
  var form = new multiparty.Form({
    maxFilesSize: 10 * 1024 * 1024,
    uploadDir: UPLOAD_PATH,
  }); //10 MB
  var image;

  form.on("error", () => {
    console.log("error");
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
  form.parse(req, function (err, fields, files) {
    const filename = files.image[0].path.replace(UPLOAD_PATH, "");
    console.log(path.join(req.headers.host, "img/" + filename));
    res.render("results", {
      title: "Image Uploader | Results",
      link: path.join(req.headers.host, "img/" + filename),
      filename: "/" + filename,
    });
    // res.send(id);
    // res.writeHead(200, { "content-type": "text/plain" });
    // res.write("received upload:\n\n");
    // res.end(util.inspect({ fields: fields, files: files }));
  });
});

app.get("/img/:id", function (req, res, next) {
  const id = req.params.id;
  const filePath = path.join(UPLOAD_PATH, id);
  console.log(filePath);
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
