require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const commentRouter = require('./routes/comments')

const postRoutes = require('./routes/posts');  // ✅ 추가
const app = express();

// 미들웨어
app.use(cors({
  origin: 'http://localhost:3000', // 프론트 주소에 맞게 수정
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api/comments', commentRouter);

// 정적 파일 서비스 (가장 먼저 등록)
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB 연결
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected!'))
.catch(err => console.error(err));

// API 라우터 등록
const postsRouter = require('./routes/posts');
const authRouter = require('./routes/auth');
app.use('/api/posts', postsRouter);
app.use('/api/auth', authRouter);

// 기본 루트 라우터는 삭제하거나, 필요하면 다음처럼 수정 가능
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

