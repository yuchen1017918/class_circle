const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const config = require('./config');
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// 初始化app
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 数据库连接
const pool = mysql.createPool(config.DB);
global.pool = pool;

// 挂载路由
app.use('/api', require('./routes/index'));

// HTTP服务
const server = app.listen(config.PORT, () => {
  console.log(`后端服务运行在 http://localhost:${config.PORT}`);
});

// WebSocket服务（实时聊天）
const wss = new WebSocket.Server({ server });
wss.on('connection', (ws) => {
  console.log('新客户端连接');
  ws.on('message', (data) => {
    // 广播消息给所有客户端
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });
  ws.on('close', () => console.log('客户端断开连接'));
});