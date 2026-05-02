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

    // 替换原localStorage登录，改为接口请求
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const userNo = document.getElementById('userNo').value;
        const password = document.getElementById('password').value;
  
        const res = await post('/login', { userNo, password });
        if (res.code === 200) {
            localStorage.setItem('user', JSON.stringify(res.data));
            alert('登录成功');
            location.href = 'index.html';
        } else {
            alert(res.msg);
        }
    });

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