const express = require('express');
const router = express.Router();
const OSS = require('aliyun-oss');
const config = require('../config');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

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

// 4. 文件上传（OSS）
const client = new OSS(config.OSS);
router.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  const result = await client.put(`files/${Date.now()}-${file.originalname}`, fs.createReadStream(file.path));
  fs.unlinkSync(file.path);
  res.send({ code: 200, url: result.url });
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
router.post('/member/add', async (req, res) => {
  await pool.query('INSERT INTO class_members SET ?', req.body);
  res.send({ code: 200, msg: '添加成功' });
});

// 7. 考勤接口
router.get('/attendance/list', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM attendance ORDER BY create_time DESC');
  res.send({ code: 200, data: rows });
});
router.post('/attendance/add', async (req, res) => {
  await pool.query('INSERT INTO attendance SET ?', req.body);
  res.send({ code: 200, msg: '发布考勤成功' });
});
router.post('/attendance/check', async (req, res) => {
  await pool.query('INSERT INTO attendance_record SET ?', req.body);
  res.send({ code: 200, msg: '打卡成功' });
});

module.exports = router;