const postShema = require("../models/post");

exports.createPost = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const Post = new postShema({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId,
  });
  Post.save()
  .then((createdPost) => {
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
  })
  .catch((error) => {
    res.status(500).json({
      message: "Creating a post failed!"
    })
  });
};

exports.updatePost = (req, res, next) => {
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
      if (result.n > 0)
        res.status(200).json({ message: "post updated!" });
      else res.status(401).json({ message: "not authorize!" });
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't update the post!"
      })
    });
};

exports.deletePost =  (req, res, next) => {
  postShema
    .deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then((result) => {
      if (result.n > 0)
        res.status(200).json({ message: "post deleted!" });
      else res.status(401).json({ message: "not authorize!" });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching posts failed!"
      })
    });
};

exports.getPosts = (req, res, next) => {
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
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching posts failed!"
      })
    });
};

exports.getPost =  (req, res, next) => {
  postShema.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "post not found!" });
    }
  })
  .catch((error) => {
    res.status(500).json({
      message: "Fetching post failed!"
    })
  });;
};
