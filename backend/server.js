const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const mysql = require('mysql2/promise');
const path = require('path');

// 初始化app
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 开放本地上传文件访问（修复关键代码）
app.use('/uploads', express.static('uploads/'));

// 数据库连接
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456', // 记得改成你的MySQL密码
  database: 'class_system'
});
global.pool = pool;

// 挂载路由
app.use('/api', require('./routes/index'));

// HTTP服务
const server = app.listen(3000, () => {
  console.log(`后端服务运行在 http://localhost:3000`);
});

// WebSocket服务（实时聊天）
const wss = new WebSocket.Server({ server });
wss.on('connection', (ws) => {
  console.log('新客户端连接');
  ws.on('message', (data) => {
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });
  ws.on('close', () => console.log('客户端断开连接'));
});