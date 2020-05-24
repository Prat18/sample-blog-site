const express = require('express');

const app = express();

app.use((req, res, next) => {
  console.log("This is really really cool!");
  next();
});

app.use((req, res, next) => {
  res.send("Well, hello there!");
});

module.exports = app;
