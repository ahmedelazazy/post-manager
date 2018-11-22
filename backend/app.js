const express = require('express');
const bodyParser = require('body-parser');

const app = express();

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
  let post = req.body.post;
  console.log(post);
  res.status(201).json({ message: 'data saved successfully' });
});

app.get('/api/posts', (req, res) => {
  const posts = [
    { id: 'nlk3nn32', title: 'Post 1', body: 'Post 1 desc' },
    { id: 'nlk3nn3222', title: 'Post 2', body: 'Post 2 desc' },
    { id: 'nlk3nn3332', title: 'Post 3', body: 'Post 3 desc' }
  ];
  res.json(posts);
});

module.exports = app;
