// 公共存储键名
const STORAGE_KEYS = {
    USERS: 'classSystem_users',
    CURRENT_USER: 'classSystem_currentUser',
    NOTICES: 'classSystem_notices',
    CHATS: 'classSystem_chats',
    MATERIALS: 'classSystem_materials',
    HOMEWORKS: 'classSystem_homeworks',
    ANNOUNCES: 'classSystem_announces',
    REMEMBER: 'classSystem_remember'
}

// 初始化默认数据
function initDefaultData() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
        const defaultUsers = [
            { role: 'teacher', school: '实验中学', className: '高三1班', name: '张老师', userNo: 'T001', password: '123456', phone: '' },
            { role: 'student', school: '实验中学', className: '高三1班', name: '小明', userNo: 'S001', password: '123456', phone: '' }
        ]
        saveData(STORAGE_KEYS.USERS, defaultUsers)
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTICES)) saveData(STORAGE_KEYS.NOTICES, [])
    if (!localStorage.getItem(STORAGE_KEYS.CHATS)) saveData(STORAGE_KEYS.CHATS, [])
    if (!localStorage.getItem(STORAGE_KEYS.MATERIALS)) saveData(STORAGE_KEYS.MATERIALS, [])
    if (!localStorage.getItem(STORAGE_KEYS.HOMEWORKS)) saveData(STORAGE_KEYS.HOMEWORKS, [])
    if (!localStorage.getItem(STORAGE_KEYS.ANNOUNCES)) saveData(STORAGE_KEYS.ANNOUNCES, [])
}

// 本地存储操作
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data))
}
function getData(key) {
    return JSON.parse(localStorage.getItem(key)) || []
}
function getCurrentUser() {
    return getData(STORAGE_KEYS.CURRENT_USER)
}

// Toast提示
function showToast(msg, type = 'success') {
    const toast = document.getElementById('toast')
    toast.textContent = msg
    toast.style.background = type === 'success' ? 'var(--success)' : 'var(--danger)'
    toast.style.display = 'block'
    setTimeout(() => toast.style.display = 'none', 2000)
}

// 格式化时间
function formatTime(timestamp = new Date().getTime()) {
    const date = new Date(timestamp)
    return date.getFullYear() + '-' + 
           String(date.getMonth()+1).padStart(2,'0') + '-' + 
           String(date.getDate()).padStart(2,'0') + ' ' + 
           String(date.getHours()).padStart(2,'0') + ':' + 
           String(date.getMinutes()).padStart(2,'0')
}

// 权限控制
function checkPermission() {
    const user = getCurrentUser()
    if (!user) {
        location.href = 'login.html'
        return
    }
    // 渲染用户信息
    document.getElementById('userName').textContent = user.name
    document.getElementById('userRole').textContent = user.role === 'teacher' ? '教师' : '学生'
    
    // 教师权限按钮显示
    if (user.role === 'teacher') {
        document.querySelectorAll('.teacher-only').forEach(el => el.style.display = 'block')
    }
    // 未读通知红点
    const notices = getData(STORAGE_KEYS.NOTICES)
    const unread = notices.filter(n => !n.isRead).length
    if (unread > 0) document.getElementById('noticeDot').style.display = 'block'
}

// 路由切换
function initRoute() {
    const navItems = document.querySelectorAll('.nav-item')
    const sections = document.querySelectorAll('.content-section')
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // 侧边栏移动端折叠
            document.getElementById('sidebar').classList.remove('show')
            // 激活状态
            navItems.forEach(i => i.classList.remove('active'))
            item.classList.add('active')
            // 切换内容
            const target = item.dataset.target
            sections.forEach(sec => sec.classList.remove('active'))
            document.getElementById(`${target}Section`).classList.add('active')
        })
    })

    // 汉堡菜单
    document.getElementById('hamburger').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('show')
    })
}

// 夜间模式
function initDarkMode() {
    const btn = document.getElementById('darkModeBtn')
    btn.addEventListener('click', () => {
        document.body.classList.toggle('dark')
        btn.textContent = document.body.classList.contains('dark') ? '☀️ 日间模式' : '🌙 夜间模式'
    })
}

// 退出登录
function initLogout() {
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
        showToast('退出成功')
        setTimeout(() => location.href = 'login.html', 1000)
    })
}

// 通用弹窗
function openModal(html) {
    document.getElementById('modalBody').innerHTML = html
    document.getElementById('commonModal').style.display = 'block'
}
function closeModal() {
    document.getElementById('commonModal').style.display = 'none'
}

// 初始化
window.addEventListener('DOMContentLoaded', () => {
    initDefaultData()
    checkPermission()
    initRoute()
    initDarkMode()
    initLogout()
    
    // 关闭弹窗
    document.querySelectorAll('.close').forEach(el => {
        el.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(m => m.style.display = 'none')
        })
    })
})