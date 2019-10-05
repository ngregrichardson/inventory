require("dotenv").config();
const express = require("express");
const favicon = require("express-favicon");
const path = require("path");
const tracer = require("tracer").console();
const app = express();

app.use(favicon(__dirname + "/client/build/favicon.ico"));
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, "client/build")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

app.listen(process.env.PORT || 3001, () =>
  tracer.log(`Listening on port ${process.env.PORT || 3001}`)
);
