const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// 회원가입
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: '이미 존재하는 사용자입니다.' });

    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: '회원가입 완료' });
  } catch (err) {
    res.status(500).json({ message: '서버 오류' });
  }
});

// 로그인
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: '사용자를 찾을 수 없습니다.' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: '비밀번호가 틀렸습니다.' });

    const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

    // 토큰 쿠키에 저장 (httpOnly, secure 옵션은 필요에 따라 설정)
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 3600000, // 1시간
      sameSite: 'lax',
    });

    res.json({ message: '로그인 성공', token });
  } catch (err) {
    res.status(500).json({ message: '서버 오류' });
  }
});

// 로그아웃
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: '로그아웃 완료' });
});

module.exports = router;
