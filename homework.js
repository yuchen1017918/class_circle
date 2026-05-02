const STORAGE_KEYS = { HOMEWORKS: 'classSystem_homeworks', CURRENT_USER: 'classSystem_currentUser' }
function saveData(key, data) { localStorage.setItem(key, JSON.stringify(data)) }
function getData(key) { return JSON.parse(localStorage.getItem(key)) || [] }
function getCurrentUser() { return getData(STORAGE_KEYS.CURRENT_USER) }
function showToast(msg) { document.getElementById('toast').textContent=msg;document.getElementById('toast').style.display='block';setTimeout(()=>document.getElementById('toast').style.display='none',2000) }
function formatTime(t) { return new Date(t).toLocaleString() }

// 渲染作业列表
function renderHomeworkList(status = 'pending') {
    const list = document.getElementById('homeworkList')
    const homeworks = getData(STORAGE_KEYS.HOMEWORKS)
    const user = getCurrentUser()
    const now = Date.now()

    let filterList = homeworks.map(h => {
        if (user.role === 'student') {
            const sub = h.submitList?.find(s => s.userNo === user.userNo)
            h.userStatus = sub ? sub.status : (now > h.deadline ? 'overdue' : 'pending')
        }
        return h
    })

    if (status !== 'all') filterList = filterList.filter(h => h.userStatus === status)
    filterList.sort((a,b) => a.deadline - b.deadline)

    list.innerHTML = filterList.map(item => `
        <div class="card">
            <h4>${item.title}</h4>
            <p>${item.content}</p>
            <p>截止时间：${formatTime(item.deadline)}</p>
            <p style="color:${item.userStatus==='overdue'?'red':item.userStatus==='corrected'?'green':'var(--text-light)'}">
                状态：${{pending:'待提交',submitted:'已提交',corrected:'已批改',overdue:'逾期未交'}[item.userStatus]}
            </p>
            ${user.role === 'student' && item.userStatus !== 'corrected' ? 
                `<button onclick="submitHomework(${item.id})" class="btn" style="width:auto;padding:5px 10px;margin-top:10px">提交作业</button>` : ''}
        </div>
    `).join('') || '<p>暂无作业</p>'
}

// 发布作业
function publishHomework() {
    const user = getCurrentUser()
    if (user.role !== 'teacher') return showToast('无权限')
    
    openModal(`
        <h3>发布作业</h3>
        <div class="form-group">
            <label>标题</label><input type="text" id="hwTitle" required>
        </div>
        <div class="form-group">
            <label>内容</label><textarea id="hwContent" rows="4" required></textarea>
        </div>
        <div class="form-group">
            <label>截止时间</label><input type="datetime-local" id="hwDeadline" required>
        </div>
        <button onclick="submitHomework()" class="btn">发布</button>
    `)
}

// 提交作业（学生）
function submitHomework(id) {
    openModal(`
        <h3>提交作业</h3>
        <div class="form-group">
            <label>作业内容</label><textarea id="subContent" rows="4"></textarea>
        </div>
        <button onclick="saveSubmit(${id})" class="btn">提交</button>
    `)
}

// 初始化
window.addEventListener('DOMContentLoaded', () => {
    renderHomeworkList()
    document.getElementById('publishHomeworkBtn').addEventListener('click', publishHomework)
    document.querySelectorAll('.tab-item').forEach(el => {
        el.addEventListener('click', () => {
            document.querySelectorAll('.tab-item').forEach(e=>e.classList.remove('active'))
            el.classList.add('active')
            renderHomeworkList(el.dataset.status)
        })
    })
})