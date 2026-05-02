// 资料上传增加文件选择
function uploadMaterial() {
  openModal(`
    <h3>上传资料</h3>
    <input type="file" id="fileInput"><br>
    <input type="text" id="matTitle" placeholder="标题"><br>
    <select id="matCate"><option value="course">课件</option></select><br>
    <button onclick="submitMaterial()">上传</button>
  `);
}

// 提交资料（真实OSS上传）
async function submitMaterial() {
  const file = document.getElementById('fileInput').files[0];
  const title = document.getElementById('matTitle').value;
  const cate = document.getElementById('matCate').value;
  
  // 上传文件到OSS
  const uploadRes = await uploadFile(file);
  // 保存资料信息到数据库
  await post('/material/add', {
    title, cate, desc: '', fileUrl: uploadRes.url
  });
  
  closeModal();
  renderMaterialList();
  showToast('上传成功');
}