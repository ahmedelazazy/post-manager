const express = require('express');
const router = express.Router();

const Post = require('./../models/post');

router.get('', (req, res) => {
  Post.find().then(data => res.json(data));
});

router.get('/:id', (req, res) => {
  Post.findById(req.params.id).then(data => res.json(data));
});

router.post('', (req, res) => {
  let post = new Post(req.body.post);
  post.save().then(post => {
    res.send();
  });
});

router.patch('/:id', (req, res) => {
  Post.findByIdAndUpdate({ _id: req.params.id }, req.body).then(() =>
    res.send()
  );
});

router.delete('/:id', (req, res) => {
  let id = req.params.id;
  Post.deleteOne({ _id: id }).then(() => res.send());
});

module.exports = router;
