const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Post = require('./models/post');

const app = express();

mongoose
  .connect('mongodb://localhost/posts')
  .then(() => console.log('Connected to mongodb'))
  .catch(err => console.log('Error while connecting to mongodb'));

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );

  next();
});

app.post('/api/posts', (req, res) => {
  let post = new Post(req.body.post);
  post.save().then(post => {
    res.send();
  });
});

app.get('/api/posts', (req, res) => {
  Post.find().then(data => res.json(data));
});

app.delete('/api/posts/:id', (req, res) => {
  let id = req.params.id;
  Post.deleteOne({ _id: id }).then(() => res.send());
});

module.exports = app;
