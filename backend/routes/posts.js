const express = require('express');
const multer = require('multer');

const Post = require('./../models/post');

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

router.get('', (req, res) => {
  Post.find().then(data => res.json(data));
});

router.get('/:id', (req, res) => {
  Post.findById(req.params.id).then(data => res.json(data));
});

router.post('', multer({ storage: storage }).single('image'), (req, res) => {
  let url = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
  let postObj = {
    title: req.body.title,
    body: req.body.body,
    imagePath: url
  };
  let post = new Post(postObj);

  post.save().then(() => {
    res.send();
  });
});

router.patch('/:id', multer({ storage: storage }).single('image'), (req, res) => {
  let postObj = {
    title: req.body.title,
    body: req.body.body
  };
  if (req.file) {
    postObj.imagePath = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
  }

  Post.findByIdAndUpdate({ _id: req.params.id }, postObj).then(() => res.send());
});

router.delete('/:id', (req, res) => {
  let id = req.params.id;
  Post.deleteOne({ _id: id }).then(() => res.send());
});

module.exports = router;
