const STORAGE_KEYS = { MATERIALS: 'classSystem_materials', CURRENT_USER: 'classSystem_currentUser' }
function saveData(key, data) { localStorage.setItem(key, JSON.stringify(data)) }
function getData(key) { return JSON.parse(localStorage.getItem(key)) || [] }
function getCurrentUser() { return getData(STORAGE_KEYS.CURRENT_USER) }
function showToast(msg) { document.getElementById('toast').textContent=msg;document.getElementById('toast').style.display='block';setTimeout(()=>document.getElementById('toast').style.display='none',2000) }
const CATES = {course:'课件', exercise:'习题', paper:'试卷', extend:'拓展资料'}

// 渲染资料列表
function renderMaterialList(cate = 'all', keyword = '') {
    const list = document.getElementById('materialList')
    let materials = getData(STORAGE_KEYS.MATERIALS)
    if (cate !== 'all') materials = materials.filter(m => m.cate === cate)
    if (keyword) materials = materials.filter(m => m.title.includes(keyword) || m.desc.includes(keyword))
    
    list.innerHTML = materials.map(item => `
        <div class="card">
            <h4>${item.title}</h4>
            <p>分类：${CATES[item.cate]}</p>
            <p>${item.desc}</p>
            <div style="margin-top:10px">
                <button class="btn" style="width:auto;padding:5px 10px;margin-right:5px" onclick="showToast('下载成功')">下载</button>
                <button class="btn" style="width:auto;padding:5px 10px" onclick="showToast('收藏成功')">收藏</button>
            </div>
        </div>
    `).join('') || '<p>暂无资料</p>'
}

// 上传资料
function uploadMaterial() {
    const user = getCurrentUser()
    if (user.role !== 'teacher') return showToast('无权限')
    
    openModal(`
        <h3>上传资料</h3>
        <div class="form-group">
            <label>标题</label><input type="text" id="matTitle" required>
        </div>
        <div class="form-group">
            <label>分类</label>
            <select id="matCate">
                <option value="course">课件</option><option value="exercise">习题</option>
                <option value="paper">试卷</option><option value="extend">拓展资料</option>
            </select>
        </div>
        <div class="form-group">
            <label>描述</label><textarea id="matDesc" rows="3"></textarea>
        </div>
        <button onclick="submitMaterial()" class="btn">上传</button>
    `)
}

// 提交资料
function submitMaterial() {
    const title = document.getElementById('matTitle').value
    const cate = document.getElementById('matCate').value
    const desc = document.getElementById('matDesc').value
    if (!title) return showToast('请填写标题')

    const materials = getData(STORAGE_KEYS.MATERIALS)
    materials.unshift({id:Date.now(), title, cate, desc, time:Date.now()})
    saveData(STORAGE_KEYS.MATERIALS, materials)
    closeModal()
    renderMaterialList()
    showToast('上传成功')
}

// 初始化
window.addEventListener('DOMContentLoaded', () => {
    renderMaterialList()
    document.getElementById('uploadMaterialBtn').addEventListener('click', uploadMaterial)
    document.querySelectorAll('.category-item').forEach(el => {
        el.addEventListener('click', () => {
            document.querySelectorAll('.category-item').forEach(e=>e.classList.remove('active'))
            el.classList.add('active')
            renderMaterialList(el.dataset.cate)
        })
    })
    document.getElementById('materialSearch').addEventListener('input', (e) => {
        renderMaterialList('all', e.target.value)
    })
})