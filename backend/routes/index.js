const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');

// 1. 登录接口
router.post('/login', async (req, res) => {
  const { userNo, password } = req.body;
  const [rows] = await pool.query('SELECT * FROM users WHERE user_no=? AND password=?', [userNo, password]);
  rows.length ? res.send({ code: 200, data: rows[0] }) : res.send({ code: 400, msg: '账号密码错误' });
});

// 2. 通知接口
router.get('/notice/list', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM notices ORDER BY create_time DESC');
  res.send({ code: 200, data: rows });
});
router.post('/notice/add', async (req, res) => {
  const { title, content, level, publisher } = req.body;
  await pool.query('INSERT INTO notices (title,content,level,publisher) VALUES (?,?,?,?)', [title, content, level, publisher]);
  res.send({ code: 200, msg: '发布成功' });
});

// 3. 聊天接口
router.get('/chat/list', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM chats ORDER BY create_time ASC');
  res.send({ code: 200, data: rows });
});
router.post('/chat/add', async (req, res) => {
  const { content, sender, senderNo } = req.body;
  await pool.query('INSERT INTO chats (content,sender,sender_no) VALUES (?,?,?)', [content, sender, senderNo]);
  res.send({ code: 200 });
});

// 4. 本地文件上传（修复版，无OSS、无报错）
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!fs.existsSync('uploads/')) fs.mkdirSync('uploads/');
    const fileUrl = `http://localhost:3000/uploads/${file.filename}`;
    res.send({ code: 200, url: fileUrl });
  } catch (error) {
    res.send({ code: 500, msg: '上传失败' });
  }
});

// 5. 资料接口
router.get('/material/list', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM materials ORDER BY create_time DESC');
  res.send({ code: 200, data: rows });
});
router.post('/material/add', async (req, res) => {
  const { title, cate, desc, fileUrl } = req.body;
  await pool.query('INSERT INTO materials (title,cate,`desc`,file_url) VALUES (?,?,?,?)', [title, cate, desc, fileUrl]);
  res.send({ code: 200, msg: '上传成功' });
});

// 6. 班级成员接口
router.get('/member/list', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM class_members');
  res.send({ code: 200, data: rows });
});

// 7. 考勤接口
router.get('/attendance/list', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM attendance ORDER BY create_time DESC');
  res.send({ code: 200, data: rows });
});

module.exports = router;