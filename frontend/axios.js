const baseURL = 'http://localhost:3000/api';

// 封装GET请求
async function get(url) {
  const res = await fetch(baseURL + url);
  return await res.json();
}

// 封装POST请求
async function post(url, data) {
  const res = await fetch(baseURL + url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await res.json();
}

// 文件上传
async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(baseURL + '/upload', {
    method: 'POST',
    body: formData
  });
  return await res.json();
}

// WebSocket连接
function connectWS() {
  return new WebSocket('ws://localhost:3000');
}