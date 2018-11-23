const mongoose = require('mongoose');

const postScheme = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  imagePath: { type: String, required: true }
});

module.exports = mongoose.model('Post', postScheme);
