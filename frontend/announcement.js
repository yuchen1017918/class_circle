const STORAGE_KEYS = { ANNOUNCES: 'classSystem_announces', CURRENT_USER: 'classSystem_currentUser' }
function saveData(key, data) { localStorage.setItem(key, JSON.stringify(data)) }
function getData(key) { return JSON.parse(localStorage.getItem(key)) || [] }
function getCurrentUser() { return getData(STORAGE_KEYS.CURRENT_USER) }
function showToast(msg) { document.getElementById('toast').textContent=msg;document.getElementById('toast').style.display='block';setTimeout(()=>document.getElementById('toast').style.display='none',2000) }
function formatTime(t) { return new Date(t).toLocaleString() }

// 渲染公告列表
function renderAnnounceList() {
    const list = document.getElementById('announceList')
    let announces = getData(STORAGE_KEYS.ANNOUNCES)
    announces.sort((a,b) => b.top ? -1 : b.time - a.time)

    list.innerHTML = announces.map(item => `
        <div class="card" style="${item.top?'border:2px solid var(--primary)':''}">
            <h4>${item.title} ${item.top?'<span style="color:var(--primary)">置顶</span>':''}</h4>
            <p>${item.content}</p>
            <div style="display:flex;justify-content:space-between;margin-top:10px;color:var(--text-light)">
                <span>发布人：${item.publisher}</span>
                <span>${formatTime(item.time)}</span>
            </div>
        </div>
    `).join('') || '<p>暂无公告</p>'
}

// 发布公告
function publishAnnounce() {
    const user = getCurrentUser()
    if (user.role !== 'teacher') return showToast('无权限')
    
    openModal(`
        <h3>发布公告</h3>
        <div class="form-group">
            <label>标题</label><input type="text" id="annTitle" required>
        </div>
        <div class="form-group">
            <label>内容</label><textarea id="annContent" rows="4" required></textarea>
        </div>
        <div class="form-group">
            <label><input type="checkbox" id="annTop"> 置顶公告</label>
        </div>
        <button onclick="submitAnnounce()" class="btn">发布</button>
    `)
}

// 提交公告
function submitAnnounce() {
    const title = document.getElementById('annTitle').value
    const content = document.getElementById('annContent').value
    const top = document.getElementById('annTop').checked
    if (!title || !content) return showToast('请填写完整')

    const announces = getData(STORAGE_KEYS.ANNOUNCES)
    const user = getCurrentUser()
    announces.unshift({id:Date.now(), title, content, top, publisher:user.name, time:Date.now()})
    saveData(STORAGE_KEYS.ANNOUNCES, announces)
    closeModal()
    renderAnnounceList()
    showToast('发布成功')
}

// 初始化
window.addEventListener('DOMContentLoaded', () => {
    renderAnnounceList()
    document.getElementById('publishAnnounceBtn').addEventListener('click', publishAnnounce)
})