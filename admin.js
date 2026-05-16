// 1. 安全防護：獲取當前登入者
function getActiveUser() {
  return JSON.parse(localStorage.getItem("togetherCurrentUser")) || JSON.parse(sessionStorage.getItem("togetherTempUser")) || null;
}

// 檢查是否有管理員權限
function checkAdminAccess() {
  const user = getActiveUser();
  if (!user || user.role !== "admin") {
    alert("⛔ 拒絕存取：您沒有管理員權限！\n請回前台使用管理員帳號登入 (admin@demo.com / 123)");
    window.location.href = "./index.html"; 
  } else {
    document.getElementById("adminNameDisplay").textContent = user.username;
  }
}

// 2. 登出功能 
document.getElementById("adminLogoutBtn").addEventListener("click", () => {
  localStorage.removeItem("togetherCurrentUser");
  sessionStorage.removeItem("togetherTempUser");
  alert("管理員已登出");
  window.location.href = "./index.html";
});

// 3. 左側選單切換功能
const menuItems = document.querySelectorAll(".sidebar-menu li");
const sections = document.querySelectorAll(".admin-section");

menuItems.forEach(item => {
  item.addEventListener("click", () => {
    menuItems.forEach(i => i.classList.remove("active"));
    sections.forEach(s => s.classList.remove("active")); 
    
    item.classList.add("active");
    const targetId = item.dataset.target;
    document.getElementById(targetId).classList.add("active");
    document.getElementById("pageTitle").textContent = item.textContent.replace(/[^\u4e00-\u9fa5a-zA-Z]/g, '');
    refreshData();
  });
});

// 4. 資料庫讀寫工具
function getDB(key) { return JSON.parse(localStorage.getItem(key)) || []; }
function saveDB(key, data) { localStorage.setItem(key, JSON.stringify(data)); }

// 5. 渲染後台所有資料
function refreshData() {
  const users = getDB("togetherUsers");
  const comics = getDB("togetherComics");
  const products = getDB("togetherProducts");

  document.getElementById("statUsers").textContent = users.length;
  document.getElementById("statComics").textContent = comics.length;

  // ✨ 修復：同步顯示點數與代幣資料
  document.getElementById("userTableBody").innerHTML = users.map(u => 
    `<tr>
      <td>${u.email}</td>
      <td>
        <select onchange="changeUserRole('${u.email}', this.value)" style="padding: 4px; border-radius: 4px; border: 1px solid #ccc; font-weight: bold; color: #18293A;" ${u.email === 'admin@demo.com' ? 'disabled' : ''}>
          <option value="reader" ${u.role === 'reader' ? 'selected' : ''}>讀者</option>
          <option value="creator" ${u.role === 'creator' ? 'selected' : ''}>創作者</option>
          <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>管理員</option>
        </select>
      </td>
      <td>${u.points || 0}</td>
      <td style="color: #ef4444; font-weight: bold;">${u.tokens || 0}</td>
    </tr>`
  ).join('');

  document.getElementById("contentTableBody").innerHTML = comics.map(c => 
    `<tr>
      <td>${c.title}</td>
      <td>${c.authorName}</td>
      <td>${c.status}</td>
      <td><button class="btn-action" onclick="deleteComic(${c.id})">強制刪除</button></td>
    </tr>`
  ).join('');

  document.getElementById("marketTableBody").innerHTML = products.map(p => 
    `<tr>
      <td>${p.name}</td>
      <td>${p.sellerName}</td>
      <td><button class="btn-action" onclick="deleteProduct(${p.id})">強制下架</button></td>
    </tr>`
  ).join('');
}

window.changeUserRole = function(email, newRole) {
  if(!confirm(`確定要將 [${email}] 的身分變更為「${newRole}」嗎？`)) {
    refreshData(); 
    return;
  }
  const users = getDB("togetherUsers");
  const idx = users.findIndex(u => u.email === email);
  if(idx !== -1) {
    users[idx].role = newRole;
    saveDB("togetherUsers", users);
    alert("會員身分更新成功！");
    refreshData();
  }
};

window.deleteComic = function(id) {
  if(!confirm("⚠️ 警告：確定要強制刪除這部作品嗎？這將無法復原！")) return;
  const comics = getDB("togetherComics").filter(c => String(c.id) !== String(id));
  saveDB("togetherComics", comics); 
  const chapters = getDB("togetherChapters").filter(ch => String(ch.comicId) !== String(id));
  saveDB("togetherChapters", chapters);
  alert("作品及其章節已刪除"); refreshData();
};

window.deleteProduct = function(id) {
  if(!confirm("⚠️ 警告：確定要強制下架這個商品嗎？")) return;
  const products = getDB("togetherProducts").filter(p => String(p.id) !== String(id));
  saveDB("togetherProducts", products); 
  alert("商品已下架"); refreshData();
};

checkAdminAccess();
refreshData();