require("dotenv").config();
const express = require("express");
const favicon = require("express-favicon");
const path = require("path");
const tracer = require("tracer").console();
const app = express();
const db = require("quick.db");
const fs = require("fs");

app.use(favicon(__dirname + "/client/build/favicon.ico"));
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, "client/build")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

app.post("/save", (req, res) => {
  let data = req.body;
  db.set(data.namespace, data.data);
  res.send({ status: "saved" });
});

app.get("/load", async (req, res) => {
  let data = {
    parts: db.get("parts"),
    projects: db.get("projects"),
    wishes: db.get("wishes"),
    counters: await JSON.parse(
      fs.readFileSync(path.join(__dirname, "counters.json"))
    ),
    locations: await JSON.parse(
      fs.readFileSync(path.join(__dirname, "locations.json"))
    )
  };
  res.json(data);
});

app.get("/load", (req, res) => {
  let data = {
    parts: db.get("parts"),
    projects: db.get("projects"),
    wishes: db.get("wishes")
  };
  res.json(data);
});

app.listen(process.env.PORT || 8001, () =>
  tracer.log(`Listening on port ${process.env.PORT || 8001}`)
);
