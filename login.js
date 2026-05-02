const STORAGE_KEYS = {
    USERS: 'classSystem_users',
    CURRENT_USER: 'classSystem_currentUser',
    REMEMBER: 'classSystem_remember'
}

// 保存/获取数据
function saveData(key, data) { localStorage.setItem(key, JSON.stringify(data)) }
function getData(key) { return JSON.parse(localStorage.getItem(key)) || [] }

// 页面加载
window.addEventListener('DOMContentLoaded', () => {
    // 记住密码自动填充
    const remember = getData(STORAGE_KEYS.REMEMBER)
    if (remember) {
        document.getElementById('school').value = remember.school || ''
        document.getElementById('className').value = remember.className || ''
        document.getElementById('name').value = remember.name || ''
        document.getElementById('userNo').value = remember.userNo || ''
        document.getElementById('password').value = remember.password || ''
        document.getElementById('rememberPwd').checked = true
    }

    // 登录提交
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault()
        const user = {
            school: document.getElementById('school').value,
            className: document.getElementById('className').value,
            name: document.getElementById('name').value,
            userNo: document.getElementById('userNo').value,
            password: document.getElementById('password').value
        }
        const users = getData(STORAGE_KEYS.USERS)
        const target = users.find(u => u.userNo === user.userNo && u.password === user.password)
        
        if (target) {
            // 记住密码
            if (document.getElementById('rememberPwd').checked) {
                saveData(STORAGE_KEYS.REMEMBER, user)
            } else {
                localStorage.removeItem(STORAGE_KEYS.REMEMBER)
            }
            saveData(STORAGE_KEYS.CURRENT_USER, target)
            alert('登录成功')
            location.href = 'index.html'
        } else {
            alert('账号或密码错误')
        }
    })

    // 注册弹窗
    document.getElementById('toRegister').addEventListener('click', () => {
        document.getElementById('registerModal').style.display = 'block'
    })

    // 注册提交
    document.getElementById('registerForm').addEventListener('submit', (e) => {
        e.preventDefault()
        const newUser = {
            role: document.getElementById('role').value,
            school: document.getElementById('regSchool').value,
            className: document.getElementById('regClass').value,
            name: document.getElementById('regName').value,
            userNo: document.getElementById('regNo').value,
            password: document.getElementById('regPwd').value,
            phone: ''
        }
        const users = getData(STORAGE_KEYS.USERS)
        if (users.some(u => u.userNo === newUser.userNo)) {
            alert('学号/工号已存在')
            return
        }
        users.push(newUser)
        saveData(STORAGE_KEYS.USERS, users)
        alert('注册成功，请登录')
        document.getElementById('registerModal').style.display = 'none'
    })

    // 忘记密码
    document.getElementById('forgetPwd').addEventListener('click', () => {
        alert('请联系班主任找回密码')
    })
})