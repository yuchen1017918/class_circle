const STORAGE_KEYS = { NOTICES: 'classSystem_notices', CURRENT_USER: 'classSystem_currentUser' }
function saveData(key, data) { localStorage.setItem(key, JSON.stringify(data)) }
function getData(key) { return JSON.parse(localStorage.getItem(key)) || [] }
function getCurrentUser() { return getData(STORAGE_KEYS.CURRENT_USER) }
function showToast(msg) { document.getElementById('toast').textContent = msg; document.getElementById('toast').style.display = 'block'; setTimeout(()=>document.getElementById('toast').style.display='none',2000) }
function formatTime(t) { return new Date(t).toLocaleString() }

// 渲染通知列表
function renderNoticeList(sort = 'time') {
    const list = document.getElementById('noticeList')
    let notices = getData(STORAGE_KEYS.NOTICES)
    const user = getCurrentUser()

    // 排序
    if (sort === 'level') {
        notices.sort((a,b) => b.level - a.level)
    } else {
        notices.sort((a,b) => b.time - a.time)
    }

    list.innerHTML = notices.map(item => `
        <div class="card" style="border-left:4px solid ${item.level===2?'var(--danger)':item.level===1?'var(--warning)':'var(--primary)'}">
            <h4>${item.title} ${item.isRead?'':'<span style="color:red">未读</span>'}</h4>
            <p>${item.content}</p>
            <div style="display:flex;justify-content:space-between;margin-top:10px;color:var(--text-light)">
                <span>发布人：${item.publisher}</span>
                <span>${formatTime(item.time)}</span>
            </div>
            <button onclick="readNotice(${item.id})" class="btn" style="width:auto;padding:5px 10px;margin-top:10px">
                ${item.isRead?'标为未读':'标为已读'}
            </button>
        </div>
    `).join('')
}

// 发布通知
function publishNotice() {
    const user = getCurrentUser()
    if (user.role !== 'teacher') return showToast('无权限')
    
    openModal(`
        <h3>发布通知</h3>
        <div class="form-group">
            <label>标题</label>
            <input type="text" id="noticeTitle" required>
        </div>
        <div class="form-group">
            <label>内容</label>
            <textarea id="noticeContent" rows="4" required></textarea>
        </div>
        <div class="form-group">
            <label>重要程度</label>
            <select id="noticeLevel">
                <option value="0">普通</option>
                <option value="1">重要</option>
                <option value="2">紧急</option>
            </select>
        </div>
        <button onclick="submitNotice()" class="btn">发布</button>
    `)
}

// 提交通知
function submitNotice() {
    const title = document.getElementById('noticeTitle').value
    const content = document.getElementById('noticeContent').value
    const level = document.getElementById('noticeLevel').value
    if (!title || !content) return showToast('请填写完整')

    const notices = getData(STORAGE_KEYS.NOTICES)
    const user = getCurrentUser()
    notices.unshift({
        id: Date.now(),
        title, content, level: Number(level),
        publisher: user.name,
        time: Date.now(),
        isRead: false
    })
    saveData(STORAGE_KEYS.NOTICES, notices)
    closeModal()
    renderNoticeList()
    showToast('发布成功')
}

// 标为已读/未读
function readNotice(id) {
    const notices = getData(STORAGE_KEYS.NOTICES)
    const index = notices.findIndex(n => n.id === id)
    notices[index].isRead = !notices[index].isRead
    saveData(STORAGE_KEYS.NOTICES, notices)
    renderNoticeList()
    showToast('操作成功')
}

// 初始化
window.addEventListener('DOMContentLoaded', () => {
    renderNoticeList()
    document.getElementById('publishNoticeBtn').addEventListener('click', publishNotice)
    document.getElementById('noticeSort').addEventListener('change', (e) => renderNoticeList(e.target.value))
})