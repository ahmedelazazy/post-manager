const mongoose = require('mongoose');

const postScheme = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  imagePath: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }
});

module.exports = mongoose.model('Post', postScheme);
