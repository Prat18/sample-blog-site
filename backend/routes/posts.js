const express = require("express");
const multer = require("multer");
const postShema = require("../models/post");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    console.log(file.mimetype);
    console.log("name " + name);
    console.log("extension " + ext);
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

router.get("", (req, res, next) => {
  postShema.find().then((result) => {
    res.status(201).json({ message: "post from server!", posts: result });
  });
});

router.get("/:id", (req, res, next) => {
  postShema.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "post not found!" });
    }
  });
});

router.post(
  "",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + '://' + req.get("host");
    const Post = new postShema({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename
    });
    Post.save().then((createdPost) => {
      console.log("post successfully saved!");
      console.log(createdPost);
      res.status(200).json({
        message: "post from client has been recieved.",
        post: {
          id: createdPost._id,
          title: createdPost.title,
          content: createdPost.content,
          imagePath: createdPost.imagePath
        }
      });
    });
  }
);

router.put("/:id",multer({ storage: storage }).single("image"), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new postShema({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  });
  postShema.updateOne({ _id: req.params.id }, post).then((result) => {
    console.log(result);
    res.status(200).json({ message: "Update successful!", imagePath: "null" });
  });
});

router.delete("/:id", (req, res, next) => {
  postShema.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({ message: "post deleted!" });
  });
});

module.exports = router;
