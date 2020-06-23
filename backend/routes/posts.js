const express = require("express");
const multer = require("multer");
const postShema = require("../models/post");
const checkAuth = require("../middleware/check-auth");

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
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

router.get("", (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = postShema.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then((result) => {
      fetchedPosts = result;
      return postShema.count();
    })
    .then((count) => {
      res.status(201).json({
        message: "post from server!",
        posts: fetchedPosts,
        maxPosts: count,
      });
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
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const Post = new postShema({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,
      creator: req.userData.userId,
    });
    Post.save().then((createdPost) => {
      console.log("post successfully saved!");
      res.status(200).json({
        message: "post from client has been recieved.",
        post: {
          id: createdPost._id,
          title: createdPost.title,
          content: createdPost.content,
          imagePath: createdPost.imagePath,
        },
      });
    });
  }
);

router.put(
  "/:id",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    const post = new postShema({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      creator: req.userData.userId
    });
    postShema
      .updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
      .then((result) => {
        if (result.nModified > 0)
          res.status(200).json({ message: "post updated!" });
        else res.status(401).json({ message: "not authorize!" });
      });
  }
);

router.delete("/:id", checkAuth, (req, res, next) => {
  postShema
    .deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then((result) => {
      if (result.n > 0)
        res.status(200).json({ message: "post deleted!" });
      else res.status(401).json({ message: "not authorize!" });
    });
});

module.exports = router;
