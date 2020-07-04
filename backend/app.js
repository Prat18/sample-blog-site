const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');
const constr = "mongodb+srv://prat__18:" + process.env.MONGO_ATLAS_PW + "@cluster0-1zw7b.mongodb.net/Post?retryWrites=true&w=majority"

mongoose.connect(constr, {useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => {
    console.log("Connection successful!")
  })
  .catch((err) => {
    console.log(err);
  })

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS, PUT");
  next();
})

app.use("/post/", postsRoutes);
app.use("/user/", userRoutes);

module.exports = app;
