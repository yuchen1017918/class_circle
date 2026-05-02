// 连接WebSocket
let ws;
function initWS() {
  ws = connectWS();
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    renderChatMsg(msg);
  };
}

// 发送消息（实时广播）
function sendMessage() {
  const input = document.getElementById('msgInput');
  const content = input.value.trim();
  if (!content) return;
  
  const user = JSON.parse(localStorage.getItem('user'));
  const msg = {
    content, sender: user.name, senderNo: user.user_no, time: new Date().toLocaleString()
  };
  
  // 存数据库 + 实时发送
  post('/chat/add', msg);
  ws.send(JSON.stringify(msg));
  input.value = '';
}