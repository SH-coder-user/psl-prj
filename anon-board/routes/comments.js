const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

// 특정 게시글 댓글 조회
router.get('/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: '댓글 조회 실패' });
  }
});

// 댓글 작성
router.post('/:postId', async (req, res) => {
  const { content, author } = req.body; // author는 선택사항
  try {
    const comment = new Comment({
      postId: req.params.postId,
      content,
      author: author || '익명'
    });
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: '댓글 작성 실패' });
  }
});

// 댓글 삭제 (간단히 id로 삭제, 인증은 생략)
router.delete('/:commentId', async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.commentId);
    res.json({ message: '댓글 삭제 완료' });
  } catch (err) {
    res.status(500).json({ message: '댓글 삭제 실패' });
  }
});

module.exports = router;
