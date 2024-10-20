const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, '00000', { expiresIn: '24h' });
};

module.exports = { generateToken };
