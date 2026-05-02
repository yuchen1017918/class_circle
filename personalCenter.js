const STORAGE_KEYS = { USERS: 'classSystem_users', CURRENT_USER: 'classSystem_currentUser' }
function saveData(key, data) { localStorage.setItem(key, JSON.stringify(data)) }
function getData(key) { return JSON.parse(localStorage.getItem(key)) || [] }
function getCurrentUser() { return getData(STORAGE_KEYS.CURRENT_USER) }
function showToast(msg) { document.getElementById('toast').textContent=msg;document.getElementById('toast').style.display='block';setTimeout(()=>document.getElementById('toast').style.display='none',2000) }

// 渲染个人信息
function renderPersonalInfo() {
    const user = getCurrentUser()
    document.getElementById('perName').value = user.name || ''
    document.getElementById('perNo').value = user.userNo || ''
    document.getElementById('perPhone').value = user.phone || ''
}

// 保存信息
function savePersonalInfo() {
    const user = getCurrentUser()
    const users = getData(STORAGE_KEYS.USERS)
    const index = users.findIndex(u => u.userNo === user.userNo)
    
    users[index].name = document.getElementById('perName').value
    users[index].phone = document.getElementById('perPhone').value
    saveData(STORAGE_KEYS.USERS, users)
    saveData(STORAGE_KEYS.CURRENT_USER, users[index])
    
    document.getElementById('userName').textContent = users[index].name
    showToast('保存成功')
}

// 修改密码
function changePassword() {
    const oldPwd = document.getElementById('oldPwd').value
    const newPwd = document.getElementById('newPwd').value
    if (!oldPwd || !newPwd) return showToast('请填写完整')

    const user = getCurrentUser()
    if (user.password !== oldPwd) return showToast('原密码错误')

    const users = getData(STORAGE_KEYS.USERS)
    const index = users.findIndex(u => u.userNo === user.userNo)
    users[index].password = newPwd
    saveData(STORAGE_KEYS.USERS, users)
    saveData(STORAGE_KEYS.CURRENT_USER, users[index])
    
    document.getElementById('oldPwd').value = ''
    document.getElementById('newPwd').value = ''
    showToast('密码修改成功')
}

// 初始化
window.addEventListener('DOMContentLoaded', () => {
    renderPersonalInfo()
    document.getElementById('saveInfoBtn').addEventListener('click', savePersonalInfo)
    document.getElementById('changePwdBtn').addEventListener('click', changePassword)
})