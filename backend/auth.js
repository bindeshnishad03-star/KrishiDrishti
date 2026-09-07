const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'krishidrishti_secret_jwt_key_2026';
const JWT_EXPIRES_IN = '7d';

function createToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

module.exports = {
  JWT_SECRET,
  createToken,
  verifyToken
};
