const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');

const app = express();

mongoose
  .connect('mongodb://localhost/posts')
  .then(() => console.log('Connected to mongodb'))
  .catch(err => console.log('Error while connecting to mongodb'));

app.use(bodyParser.json());
app.use('/images', express.static(path.join('backend/images')));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');

  next();
});

app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);

module.exports = app;
