// 角色映射
const roleMap = {
    student: "学生",
    teacher: "教师",
    master: "班主任"
};

// ====================== 默认学校 / 默认班级（你可以自己改）
const DEFAULT_SCHOOL = "杭州市东城第二实验学校";
const DEFAULT_CLASS = "六年级（6）班";
// ======================

// 获取用户列表
function getUserList() {
    return JSON.parse(localStorage.getItem("userList")) || [];
}

// 切换页面
function showReg() {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("regPage").style.display = "block";
    
    // 注册页自动填默认学校、班级
    document.getElementById("regSchool").value = DEFAULT_SCHOOL;
    document.getElementById("regClass").value = DEFAULT_CLASS;
}
function showLogin() {
    document.getElementById("regPage").style.display = "none";
    document.getElementById("loginPage").style.display = "block";
    document.getElementById("regErr").innerText = "";
}

// 页面加载时自动填充默认学校、班级
window.onload = function () {
    // 登录页默认值
    document.getElementById("loginSchool").value = DEFAULT_SCHOOL;
    document.getElementById("loginClass").value = DEFAULT_CLASS;

    let u = localStorage.getItem("currentUser");
    if (u) showMain(JSON.parse(u));
};

// 注册
function handleReg() {
    let role = document.getElementById("regRole").value;
    let school = document.getElementById("regSchool").value.trim();
    let className = document.getElementById("regClass").value.trim();
    let name = document.getElementById("regName").value.trim();
    let sno = document.getElementById("regSno").value.trim();
    let pwd = document.getElementById("regPwd").value.trim();
    let err = document.getElementById("regErr");

    if (!school || !className || !name || !sno || !pwd) {
        err.innerText = "请填写完整信息";
        return;
    }

    let list = getUserList();
    let has = list.find(item => item.sno === sno);
    if (has) {
        err.innerText = "该学号/工号已注册";
        return;
    }

    list.push({ role, school, class: className, name, sno, pwd });
    localStorage.setItem("userList", JSON.stringify(list));
    alert("注册成功！");
    showLogin();
}

// 登录：输入姓名 → 自动匹配学号
function autoFillSno() {
    let name = document.getElementById("loginName").value.trim();
    let school = document.getElementById("loginSchool").value.trim();
    let className = document.getElementById("loginClass").value.trim();
    let role = document.getElementById("loginRole").value;
    let list = getUserList();

    let user = list.find(u =>
        u.name === name &&
        u.school === school &&
        u.class === className &&
        u.role === role
    );

    if (user) {
        document.getElementById("loginSno").value = user.sno;
    } else {
        document.getElementById("loginSno").value = "";
    }
}

// 登录验证
function handleLogin() {
    let role = document.getElementById("loginRole").value;
    let school = document.getElementById("loginSchool").value.trim();
    let className = document.getElementById("loginClass").value.trim();
    let name = document.getElementById("loginName").value.trim();
    let sno = document.getElementById("loginSno").value.trim();
    let pwd = document.getElementById("loginPwd").value.trim();
    let err = document.getElementById("loginErr");

    if (!school || !className || !name || !sno || !pwd) {
        err.innerText = "请填写完整信息";
        return;
    }

    let list = getUserList();
    let user = list.find(u =>
        u.role === role &&
        u.school === school &&
        u.class === className &&
        u.name === name &&
        u.sno === sno &&
        u.pwd === pwd
    );

    if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        showMain(user);
    } else {
        err.innerText = "信息不匹配，登录失败";
    }
}

// 显示主页
function showMain(user) {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("regPage").style.display = "none";
    document.getElementById("mainPage").style.display = "block";

    document.getElementById("userInfo").innerText = `${roleMap[user.role]} - ${user.name}`;
    document.getElementById("uRole").innerText = roleMap[user.role];
    document.getElementById("uSchool").innerText = user.school;
    document.getElementById("uClass").innerText = user.class;
    document.getElementById("uName").innerText = user.name;
    document.getElementById("uSno").innerText = user.sno;
}

// 退出登录
function logout() {
    localStorage.removeItem("currentUser");
    location.reload();
}

// 切换页面
function goPage(id) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("show"));
    document.getElementById(id).classList.add("show");
    document.querySelectorAll(".nav button").forEach(b => b.classList.remove("active"));
    event.target.classList.add("active");
}