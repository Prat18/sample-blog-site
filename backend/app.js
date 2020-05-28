const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS, PUT");
  next();
})

app.get('/post' ,(req, res, next) => {
  posts = [
    {id: "12345", title: "black hole", content: "project black"},
    {id: "12346", title: "white hole", content: "project white"},
    {id: "12347", title: "crimson hole", content: "project crimson"}
  ]
  res.status(201).json({message: "post from server!", posts});
});

app.post('/post', (req, res, next) => {
  const post = req.body;
  console.log(post);
  res.status(200).json({message: "post from client has been recieved."});
})

module.exports = app;
