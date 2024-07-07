const express = require("express");
const data = require("./data/notes");
const dotenv = require("dotenv");
const app = express();
dotenv.config(); // to use the .env file
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/notes/t/:tt", (req, res) => {
  const n = data.find((tt) => tt.title === decodeURIComponent(req.params.tt));
  res.json(n);
  console.log("hel");
});
app.get("/api/notes/:id", (req, res) => {
  const n = data.find((n) => n._id === req.params.id);
  res.json(n);
  console.log("hel");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
