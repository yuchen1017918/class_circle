const STORAGE_KEYS = { CHATS: 'classSystem_chats', CURRENT_USER: 'classSystem_currentUser' }
function saveData(key, data) { localStorage.setItem(key, JSON.stringify(data)) }
function getData(key) { return JSON.parse(localStorage.getItem(key)) || [] }
function getCurrentUser() { return getData(STORAGE_KEYS.CURRENT_USER) }
function formatTime(t) { return new Date(t).toLocaleTimeString() }

// 渲染聊天记录
function renderChat() {
    const container = document.getElementById('chatMessages')
    const chats = getData(STORAGE_KEYS.CHATS)
    const user = getCurrentUser()

    container.innerHTML = chats.map(msg => `
        <div class="message ${msg.senderId === user.userNo ? 'self' : 'other'}">
            <div class="msg-content">${msg.content}</div>
            <div class="msg-time">${msg.sender} · ${formatTime(msg.time)}</div>
        </div>
    `).join('')
    container.scrollTop = container.scrollHeight
}

// 发送消息
function sendMessage() {
    const input = document.getElementById('msgInput')
    const content = input.value.trim()
    if (!content) return

    const user = getCurrentUser()
    const chats = getData(STORAGE_KEYS.CHATS)
    chats.push({
        id: Date.now(),
        content,
        sender: user.name,
        senderId: user.userNo,
        time: Date.now()
    })
    saveData(STORAGE_KEYS.CHATS, chats)
    input.value = ''
    renderChat()
}

// 表情选择
function insertEmoji() {
    const emojis = ['😊', '😂', '👍', '❤️', '🎉', '🤔', '😭', '😡']
    const input = document.getElementById('msgInput')
    input.value += emojis[Math.floor(Math.random()*emojis.length)]
}

// 初始化
window.addEventListener('DOMContentLoaded', () => {
    renderChat()
    document.getElementById('sendBtn').addEventListener('click', sendMessage)
    document.getElementById('emojiBtn').addEventListener('click', insertEmoji)
    document.getElementById('msgInput').addEventListener('keypress', (e) => e.key === 'Enter' && sendMessage())
})