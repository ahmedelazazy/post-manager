const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./../models/user');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    var hashed = await bcrypt.hash(req.body.password, 10);
    const user = new User({ email: req.body.email, password: hashed });
    await user.save();
    res.send();
  } catch (err) {
    res.status(400).send();
  }
});

router.post('/login', async (req, res) => {
  try {
    var user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send();
    }
    var isValidPass = await bcrypt.compare(req.body.password, user.password);
    if (!isValidPass) {
      return res.status(400).send();
    }

    var token = jwt.sign({ email: user.email, id: user._id }, 'secret_string', { expiresIn: '1h' });
    res.json({ token, expiry: 3600, userId: user._id });
  } catch (err) {
    res.status(400).send();
  }
});

module.exports = router;
