const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/auth');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or malformed' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded; // Attach decoded token payload (e.g., id, username) to request
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
