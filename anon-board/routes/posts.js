const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const authenticateToken = require('../middleware/authMiddleware'); // 인증 미들웨어



// 게시글 목록 조회
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }); // 최신순 정렬
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: '게시글 불러오기 실패' });
  }
});

// 상세 게시글 조회 API
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



const authMiddleware = require('../middleware/auth');
// 게시글 생성
router.post('/', authMiddleware, async (req, res) => {
  const { title, content } = req.body;
  const author = req.user.username; // 토큰에서 추출

  try {
    const post = new Post({ title, content, author });
    const savedPost = await post.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 게시글 수정 - 작성자만 가능
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: '게시글이 없습니다.' });

    // 작성자 검사
    if (post.author !== req.user.username) {
      return res.status(403).json({ message: '수정 권한이 없습니다.' });
    }

    const { title, content } = req.body;
    post.title = title || post.title;
    post.content = content || post.content;

    await post.save();
    res.json({ message: '게시글이 수정되었습니다.', post });
  } catch (err) {
    res.status(500).json({ message: '게시글 수정 실패', error: err.message });
  }
});

// 게시글 삭제 - 작성자만 가능
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: '게시글이 없습니다.' });

    // 작성자 검사
    if (post.author !== req.user.username) {
      return res.status(403).json({ message: '삭제 권한이 없습니다.' });
    }

    await Post.deleteOne({ _id: req.params.id });
    res.json({ message: '게시글이 삭제되었습니다.' });
  } catch (err) {
    res.status(500).json({ message: '게시글 삭제 실패', error: err.message });
  }
});

module.exports = router;
