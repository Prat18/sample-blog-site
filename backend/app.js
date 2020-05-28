const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postShema = require('./models/post')

const constr = "mongodb+srv://prat__18:uW10LmkHoF6oD2xq@cluster0-1zw7b.mongodb.net/Post?retryWrites=true&w=majority"

mongoose.connect(constr)
  .then((res) => {
    console.log("Connection successful!")
  })
  .catch((err) => {
    console.log(err);
  })

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS, PUT");
  next();
})

app.get('/post' ,(req, res, next) => {
  postShema.find()
    .then((result) => {
      console.log(result);
      res.status(201).json({message: "post from server!", posts: result});
    })
});

app.post('/post', (req, res, next) => {
  const Post = new postShema({
    title: req.body.title,
    content: req.body.content
  });
  Post.save()
    .then((result) => {
      console.log("post successfully saved!");
      res.status(200).json({
        message: "post from client has been recieved.",
        postId: result._id
      });
    })
})

app.delete('/post:id', (req, res, next) => {
  postShema.deleteOne({ _id: req.params.id })
    .then((result) => {
      console.log(result);
      res.status(200).json({message: "post deleted!"});
    })
})

module.exports = app;
