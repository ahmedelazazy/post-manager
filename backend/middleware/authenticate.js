const jwt = require('jsonwebtoken');

var authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    var decodedToken = jwt.verify(token, 'secret_string');
    req.userId = decodedToken.id;
    return next();
  } catch (err) {
    res.status(401).send();
  }
};

module.exports = authenticate;
