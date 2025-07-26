const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

function authMiddleware(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: '인증 필요' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // userId, username 포함
    next();
  } catch (err) {
    res.status(401).json({ message: '토큰이 유효하지 않습니다.' });
  }
}

module.exports = authMiddleware;
