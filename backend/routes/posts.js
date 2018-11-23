const express = require('express');
const multer = require('multer');

const Post = require('./../models/post');
const authenticate = require('./../middleware/authenticate');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if (isValid) {
      error = null;
    }
    cb(error, 'backend/images');
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(' ')
      .join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.get('', async (req, res) => {
  try {
    const pageSize = +req.query.pagesize;
    const pageIndex = +req.query.pageindex;
    let postsQuery = Post.find();

    if (!isNaN(pageSize) && !isNaN(pageIndex)) {
      postsQuery.skip(pageIndex * pageSize);
      postsQuery.limit(pageSize);
    }
    var count = await Post.count();
    var posts = await postsQuery.exec();
    posts = posts.map(p => {
      return { title: p.title, body: p.body, imagePath: p.imagePath, id: p._id, createdBy: p.createdBy };
    });
    res.json({
      count,
      posts
    });
  } catch (err) {
    res.send(400);
  }
});

router.get('/:id', (req, res) => {
  Post.findById(req.params.id).then(data => res.json(data));
});

router.post('', authenticate, multer({ storage: storage }).single('image'), (req, res) => {
  let url = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
  let postObj = {
    title: req.body.title,
    body: req.body.body,
    imagePath: url,
    createdBy: req.userId
  };
  let post = new Post(postObj);

  post.save().then(() => {
    res.send();
  });
});

router.patch('/:id', authenticate, multer({ storage: storage }).single('image'), async (req, res) => {
  try {
    let postObj = {
      title: req.body.title,
      body: req.body.body
    };
    if (req.file) {
      postObj.imagePath = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    }

    let post = await Post.findOneAndUpdate({ _id: req.params.id, createdBy: req.userId }, postObj);
    if (!post) {
      return res.status(401).send();
    }
    return res.send();
  } catch (err) {
    res.send(400);
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    let id = req.params.id;
    let post = await Post.findOneAndDelete({ _id: id, createdBy: req.userId });
    if (!post) {
      return res.status(401).send();
    }
    return res.send();
  } catch (err) {
    res.send(400);
  }
});

module.exports = router;
