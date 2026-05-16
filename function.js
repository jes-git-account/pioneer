// ====== 1. DOM 元素綁定 ======
const mainNavbar = document.getElementById("mainNavbar");
const mainFooter = document.getElementById("mainFooter");
const hamburgerBtn = document.getElementById("hamburgerBtn");
const closeBtn = document.getElementById("closeBtn");
const mobileMenu = document.getElementById("mobileMenu");
const overlay = document.getElementById("overlay");
const searchInput = document.getElementById("searchInput");

const loginModal = document.getElementById("loginModal");
const loginBtn = document.getElementById("loginBtn");
const userArea = document.getElementById("userArea");
const userBtn = document.getElementById("userBtn");
const userDropdown = document.getElementById("userDropdown");

// 頁面與抽屜區塊
const homePage = document.getElementById("homePage");
const comicDetailPage = document.getElementById("comicDetailPage");
const productDetailPage = document.getElementById("productDetailPage"); // ✨ 新增商品詳情頁
const chapterReadPage = document.getElementById("chapterReadPage");
const memberPage = document.getElementById("memberPage");
const creatorCenterPage = document.getElementById("creatorCenterPage");
const marketPage = document.getElementById("marketPage");
const taskPage = document.getElementById("taskPage");
const chapterDrawer = document.getElementById("chapterDrawer");

// 列表與表格
const comicGrid = document.getElementById("comicGrid");
const productGrid = document.getElementById("productGrid");
const myProductGrid = document.getElementById("myProductGrid");
const taskGrid = document.getElementById("taskGrid");
const creatorComicTableBody = document.getElementById("creatorComicTableBody");

// 表單
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const profileForm = document.getElementById("profileForm");
const createComicForm = document.getElementById("createComicForm");
const createChapterForm = document.getElementById("createChapterForm");
const sellForm = document.getElementById("sellForm");
const creatorEditComicForm = document.getElementById("creatorEditComicForm");
const chapterEditForm = document.getElementById("chapterEditForm");

// ====== 2. 假資料與初始化 ======
const defaultComics = [
  {
    id: 1,
    title: "我獨自升級",
    authorEmail: "official@demo.com",
    authorName: "官方示範",
    cover9x16: "./pic/我獨自升級.webp",
    cover1x1: "./pic/我獨自升級.webp",
    category: "奇幻",
    status: "連載中",
    description:
      "十多年前，世界各地突然出現連接異次元與現實世界的「傳送門」...",
  },
  {
    id: 2,
    title: "鏈鋸人",
    authorEmail: "official@demo.com",
    authorName: "官方示範",
    cover9x16: "./pic/練鋸人.webp",
    cover1x1: "./pic/練鋸人.webp",
    category: "動作",
    status: "連載中",
    description:
      "這是一個充斥著惡魔的世界。主角淀治為了解除父親留下的龐大債務，成為了惡魔獵人。",
  },
];
// ✨ 假資料中新增 likes 與 views 用作統計
const defaultChapters = [
  {
    id: 101,
    comicId: 1,
    chapterTitle: "第 1 話",
    isFree: true,
    pointsCost: 0,
    pages: ["./pic/我獨自升級.webp"],
    likes: 50,
    views: 120,
  },
  {
    id: 102,
    comicId: 1,
    chapterTitle: "第 2 話",
    isFree: false,
    pointsCost: 3,
    pages: ["./pic/我獨自升級.webp"],
    likes: 25,
    views: 60,
  },
];
const defaultTasks = [
  {
    id: 1,
    title: "每日登入",
    description: "今天成功登入",
    type: "daily_login",
    target: 1,
    rewardPoints: 100,
    isActive: true,
  },
  {
    id: 2,
    title: "閱讀漫畫",
    description: "閱讀 1 話",
    type: "read_chapter",
    target: 1,
    rewardPoints: 100,
    isActive: true,
  },
  {
    id: 3,
    title: "上架商品",
    description: "在作者商店上架 1 件商品",
    type: "sell_product",
    target: 1,
    rewardPoints: 200,
    isActive: true,
  },
];

function initData() {
  if (!localStorage.getItem("togetherComics"))
    localStorage.setItem("togetherComics", JSON.stringify(defaultComics));
  if (!localStorage.getItem("togetherChapters"))
    localStorage.setItem("togetherChapters", JSON.stringify(defaultChapters));
  if (!localStorage.getItem("togetherTasks"))
    localStorage.setItem("togetherTasks", JSON.stringify(defaultTasks));
  if (!localStorage.getItem("togetherProducts"))
    localStorage.setItem("togetherProducts", JSON.stringify([]));
  if (!localStorage.getItem("togetherUserTasks"))
    localStorage.setItem("togetherUserTasks", JSON.stringify([]));
  let users = JSON.parse(localStorage.getItem("togetherUsers")) || [];
  let adminIndex = users.findIndex((u) => u.email === "admin@demo.com");
  if (adminIndex === -1) {
    users.push({
      id: 999,
      email: "admin@demo.com",
      username: "管理員",
      password: "123",
      role: "admin",
      points: 1000,
      tokens: 50,
    });
  } else {
    users[adminIndex].password = "123";
    users[adminIndex].role = "admin";
  }
  localStorage.setItem("togetherUsers", JSON.stringify(users));
}

// ====== 3. 核心工具 ======
function getDB(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}
function saveDB(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
function getActiveUser() {
  return (
    JSON.parse(localStorage.getItem("togetherCurrentUser")) ||
    JSON.parse(sessionStorage.getItem("togetherTempUser")) ||
    null
  );
}
function findUserByEmail(email) {
  return getDB("togetherUsers").find((u) => u.email === email);
}
function getTodayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function updateSessionLocal(user) {
  if (localStorage.getItem("togetherCurrentUser"))
    localStorage.setItem("togetherCurrentUser", JSON.stringify(user));
  else if (sessionStorage.getItem("togetherTempUser"))
    sessionStorage.setItem("togetherTempUser", JSON.stringify(user));
}

// ====== 4. 路由與 UI 控制 ======
function showOnlyPage(pageId) {
  [
    homePage,
    comicDetailPage,
    productDetailPage,
    chapterReadPage,
    memberPage,
    creatorCenterPage,
    marketPage,
    taskPage,
  ].forEach((p) => p?.classList.add("hidden"));
  document.getElementById(pageId)?.classList.remove("hidden");

  if (pageId === "chapterReadPage") {
    mainNavbar.classList.add("hidden");
    mainFooter.classList.add("hidden");
  } else {
    mainNavbar.classList.remove("hidden");
    mainFooter.classList.remove("hidden");
  }
  window.scrollTo(0, 0);
  closeMobileMenu();
  closeChapterDrawer();
}

function closeAllModals() {
  document.querySelectorAll(".modal").forEach((m) => {
    m.classList.remove("show");
    m.classList.add("hidden");
    m.style.display = "none";
  });
  if (
    !mobileMenu.classList.contains("active") &&
    !chapterDrawer.classList.contains("active")
  ) {
    overlay.classList.remove("active");
    document.body.classList.remove("no-scroll");
  }
}

function openModal() {
  closeMobileMenu();
  loginModal.classList.remove("hidden");
  loginModal.classList.add("show");
  overlay.classList.add("active");
}
function closeMobileMenu() {
  mobileMenu.classList.remove("active");
  if (
    !loginModal.classList.contains("show") &&
    !chapterDrawer.classList.contains("active")
  ) {
    overlay.classList.remove("active");
    document.body.classList.remove("no-scroll");
  }
}
function openChapterDrawer() {
  chapterDrawer.classList.add("active");
  overlay.classList.add("active");
  document.body.classList.add("no-scroll");
}
function closeChapterDrawer() {
  chapterDrawer.classList.remove("active");
  if (
    !loginModal.classList.contains("show") &&
    !mobileMenu.classList.contains("active")
  ) {
    overlay.classList.remove("active");
    document.body.classList.remove("no-scroll");
  }
}

function updateNavUI() {
  const user = getActiveUser();
  if (user) {
    loginBtn.classList.add("hidden");
    userArea.classList.remove("hidden");
    document
      .querySelectorAll(".mobile-guest-only")
      .forEach((el) => el.classList.add("hidden"));
    document
      .querySelectorAll(".mobile-auth-only")
      .forEach((el) => el.classList.remove("hidden"));
    document.querySelectorAll(".admin-only").forEach((el) => {
      if (user.role === "admin") el.classList.remove("hidden");
      else el.classList.add("hidden");
    });
  } else {
    loginBtn.classList.remove("hidden");
    userArea.classList.add("hidden");
    document
      .querySelectorAll(".mobile-guest-only")
      .forEach((el) => el.classList.remove("hidden"));
    document
      .querySelectorAll(".mobile-auth-only")
      .forEach((el) => el.classList.add("hidden"));
  }
}

function logout(e) {
  if (e) e.preventDefault();
  localStorage.removeItem("togetherCurrentUser");
  sessionStorage.removeItem("togetherTempUser");
  updateNavUI();
  refreshSummary();
  showOnlyPage("homePage");
  renderComics();
  alert("已登出");
  document.getElementById("userDropdown").classList.add("hidden");
}

function refreshSummary() {
  const user = getActiveUser();
  if (!user) {
    document.getElementById("summaryUserName").textContent = "訪客";
    document.getElementById("summaryPoints").textContent = "0";
    if (document.getElementById("summaryTokens"))
      document.getElementById("summaryTokens").textContent = "0";
  } else {
    const dbUser = findUserByEmail(user.email);
    if (dbUser) {
      document.getElementById("summaryUserName").textContent = dbUser.username;
      document.getElementById("summaryPoints").textContent = dbUser.points || 0;
      if (document.getElementById("summaryTokens"))
        document.getElementById("summaryTokens").textContent =
          dbUser.tokens || 0;
    }
  }
}

// ====== 5. 渲染邏輯 ======
function renderComics(filterFn = null) {
  const comics = getDB("togetherComics");
  comicGrid.innerHTML = "";
  let count = 0;
  comics.forEach((c) => {
    if (filterFn && !filterFn(c)) return;
    count++;
    const div = document.createElement("div");
    div.className = "comic-card";
    const mainCover = c.cover9x16 || c.cover;
    div.innerHTML = `<div class="cover"><img src="${mainCover}"></div><h3>${c.title}</h3><p class="tag">${c.category}｜${c.status}</p>`;
    div.onclick = () => openComicDetail(c.id);
    comicGrid.appendChild(div);
  });
  if (count === 0)
    document.getElementById("noResult").classList.add("show-no-result");
  else document.getElementById("noResult").classList.remove("show-no-result");
}

function openComicDetail(comicId) {
  const comic = getDB("togetherComics").find(
    (c) => String(c.id) === String(comicId),
  );
  const chapters = getDB("togetherChapters").filter(
    (ch) => String(ch.comicId) === String(comicId),
  );
  if (!comic) return;
  const active = getActiveUser();
  const latest = active ? findUserByEmail(active.email) : null;
  const detailCover = comic.cover1x1 || comic.cover;

  // ✨ 計算總觀看數
  const totalViews = chapters.reduce((sum, ch) => sum + (ch.views || 0), 0);

  // ✨ 詳情頁左側加入總觀看與收藏按鈕
  document.getElementById("comicDetailContent").innerHTML = `
    <div style="margin-bottom: 1.5rem;"><button class="nav-text-btn" onclick="showOnlyPage('homePage'); renderComics();" style="font-size: 1.1rem; padding: 0;">⬅ 返回首頁</button></div>
    <div class="chapter-layout-grid">
      <div class="detail-left-column">
        <img src="${detailCover}" class="comic-detail-cover">
        <div class="detail-text-area">
          <h2 class="comic-detail-title">${comic.title}</h2>
          <p class="comic-detail-meta">作者：${comic.authorName}<br>狀態：${comic.status} ｜ 分類：${comic.category}</p>
          <div class="comic-detail-desc">${comic.description || "暫無簡介"}</div>
        </div>
        <div class="comic-stats-box">
        <p class="comic-total-views">總觀看數 ${totalViews}</p>
        <button class="action-btn" style="width:100%; border: 1px solid #ff4d4f; color: #ff4d4f;" onclick="alert('已加入收藏！')">❤️ 收藏</button>
        </div>
      </div>
      <div class="chapter-list-wrap">
        <h3 style="margin-bottom:1.5rem; color:#18293A; font-size:1.4rem;">話次列表 (${chapters.length})</h3>
        <div id="chapterListContainer"></div>
      </div>
    </div>`;

  const list = document.getElementById("chapterListContainer");
  chapters.forEach((ch) => {
    const btn = document.createElement("button");
    btn.className = "chapter-btn";
    let meta = ch.isFree ? "免費" : `${ch.pointsCost} 代幣`;
    if (!ch.isFree && latest?.unlockedChapters?.includes(`${comicId}_${ch.id}`))
      meta = "已解鎖";
    let likes = ch.likes || 0;

    // ✨ 右側加入按讚數顯示
    btn.innerHTML = `<span>${ch.chapterTitle}</span><div style="display:flex; gap:15px; align-items:center; color:#888; font-size:0.95rem;"><span>❤️ ${likes}</span><span>${meta}</span></div>`;
    btn.onclick = () => openChapter(comicId, ch.id);
    list.appendChild(btn);
  });
  showOnlyPage("comicDetailPage");
}

function openChapter(comicId, chapterId) {
  try {
    const comic = getDB("togetherComics").find(
      (c) => String(c.id) === String(comicId),
    );
    const chaptersDB = getDB("togetherChapters");
    const chapters = chaptersDB.filter(
      (ch) => String(ch.comicId) === String(comicId),
    );
    const dbChapIdx = chaptersDB.findIndex(
      (ch) => String(ch.id) === String(chapterId),
    );
    const chapterIndex = chapters.findIndex(
      (ch) => String(ch.id) === String(chapterId),
    );

    if (!comic || dbChapIdx === -1) {
      alert("找不到該話次資料！");
      return;
    }

    const chapter = chaptersDB[dbChapIdx];
    const user = getActiveUser();
    const dbUser = user ? findUserByEmail(user.email) : null;
    const key = `${comicId}_${chapterId}`;

    if (!chapter.isFree) {
      if (!dbUser) {
        alert("請先登入才能解鎖付費內容");
        return openModal();
      }
      if (!dbUser.unlockedChapters?.includes(key)) {
        if (!confirm(`此章節需 ${chapter.pointsCost} 代幣，確認解鎖？`)) return;
        if ((dbUser.tokens || 0) < chapter.pointsCost)
          return alert("代幣不足！請先前往會員中心兌換代幣。");
        const users = getDB("togetherUsers");
        const idx = users.findIndex((u) => u.email === dbUser.email);
        users[idx].tokens -= chapter.pointsCost;
        users[idx].unlockedChapters = users[idx].unlockedChapters || [];
        users[idx].unlockedChapters.push(key);
        saveDB("togetherUsers", users);
        updateSessionLocal(users[idx]);
        refreshSummary();
        alert("解鎖成功！");
      }
    }

    // ✨ 進入閱讀時，觀看次數自動 +1
    chaptersDB[dbChapIdx].views = (chaptersDB[dbChapIdx].views || 0) + 1;
    saveDB("togetherChapters", chaptersDB);
    chapter.views = chaptersDB[dbChapIdx].views; // 更新本地端

    const topTitle = document.getElementById("readerTopTitle");
    if (topTitle) topTitle.textContent = `${chapter.chapterTitle}`;
    const drawerList = document.getElementById("drawerList");
    drawerList.innerHTML = "";
    chapters.forEach((ch) => {
      const btn = document.createElement("button");
      btn.className =
        "drawer-chapter-btn" +
        (String(ch.id) === String(chapterId) ? " active" : "");
      btn.textContent = ch.chapterTitle;
      btn.onclick = () => {
        closeChapterDrawer();
        openChapter(comicId, ch.id);
      };
      drawerList.appendChild(btn);
    });

    const homeBtn = document.getElementById("readerHomeBtn");
    if (homeBtn)
      homeBtn.onclick = () => {
        showOnlyPage("homePage");
        renderComics();
      };
    const detailBtn = document.getElementById("backToDetailBtn");
    if (detailBtn) {
      detailBtn.textContent = `⬅ ${comic.title}`;
      detailBtn.onclick = () => openComicDetail(comicId);
    }

    const rc = document.getElementById("chapterReadContent");
    rc.innerHTML = "";
    chapter.pages.forEach((src) => {
      const img = document.createElement("img");
      img.src = src.trim();
      img.className = "reader-page-image";
      rc.appendChild(img);
    });

    // ✨ 閱讀頁底部的統計資訊與按鈕
    const bottomDiv = document.createElement("div");
    bottomDiv.className = "reader-bottom-actions";
    const prevId = chapterIndex > 0 ? chapters[chapterIndex - 1].id : null;
    const nextId =
      chapterIndex < chapters.length - 1 ? chapters[chapterIndex + 1].id : null;
    bottomDiv.innerHTML = `
      <div class="interaction-btns">
        <button class="action-btn" onclick="likeChapter(${chapter.id})" id="likeBtn_${chapter.id}">❤️ 按讚 (${chapter.likes || 0})</button>
        <button class="action-btn" onclick="alert('已加入收藏！')">⭐ 收藏</button>
        <button class="action-btn" onclick="alert('連結已複製，分享給朋友吧！')">🔗 分享</button>
        <span style="font-weight:bold; color:#64748b; padding: 0.8rem 1rem;">👁️ 觀看: ${chapter.views}</span>
      </div>
      <div class="nav-btns"><button class="nav-btn" ${!prevId ? "disabled" : ""} id="prevChapterBtn">⬅ 上一集</button><button class="nav-btn" ${!nextId ? "disabled" : ""} id="nextChapterBtn">下一集 ➡</button></div>`;
    rc.appendChild(bottomDiv);

    if (prevId)
      document.getElementById("prevChapterBtn").onclick = () => {
        window.scrollTo(0, 0);
        openChapter(comicId, prevId);
      };
    if (nextId)
      document.getElementById("nextChapterBtn").onclick = () => {
        window.scrollTo(0, 0);
        openChapter(comicId, nextId);
      };

    updateTaskProgress("read_chapter", 1);
    showOnlyPage("chapterReadPage");
  } catch (error) {
    console.error("閱讀頁錯誤:", error);
    alert("系統發生錯誤，無法打開此話次。");
  }
}

// ✨ 即時按讚功能
window.likeChapter = function (chapterId) {
  const chapters = getDB("togetherChapters");
  const idx = chapters.findIndex((ch) => String(ch.id) === String(chapterId));
  if (idx !== -1) {
    chapters[idx].likes = (chapters[idx].likes || 0) + 1;
    saveDB("togetherChapters", chapters);
    const btn = document.getElementById(`likeBtn_${chapterId}`);
    if (btn) btn.textContent = `❤️ 按讚 (${chapters[idx].likes})`;
  }
};

function renderProducts() {
  const products = getDB("togetherProducts");
  productGrid.innerHTML = "";
  if (products.length === 0) {
    document.getElementById("noProductResult").classList.remove("hidden");
    return;
  }
  document.getElementById("noProductResult").classList.add("hidden");
  products.forEach((p) => {
    const div = document.createElement("div");
    div.className = "comic-card";
    // ✨ 點擊商品卡片開啟專屬詳情頁
    div.onclick = () => openProductDetail(p.id);
    div.innerHTML = `<div class="cover portrait" style="aspect-ratio:1/1;"><img src="${p.image || "./pic/product.jpg"}"></div><h3 style="margin-top: 15px;">${p.name}</h3><p class="author" style="margin-bottom: 10px;">賣家：${p.sellerName}</p><div style="display: flex; justify-content: space-between; align-items: center; padding: 0 14px 14px;"><span style="font-weight: bold; color: #ef4444; font-size: 1.05rem;">${p.price} 代幣</span><button class="btn-submit" style="padding: 4px 12px; font-size: 0.9rem;" onclick="event.stopPropagation(); buyProduct(${p.id})">購買</button></div>`;
    productGrid.appendChild(div);
  });
}

// ✨ 新增：商品詳情頁的渲染邏輯
window.openProductDetail = function (productId) {
  const product = getDB("togetherProducts").find(
    (p) => String(p.id) === String(productId),
  );
  if (!product) return;

  document.getElementById("productDetailContent").innerHTML = `
    <div style="margin-bottom: 1.5rem;">
      <button class="nav-text-btn" onclick="showOnlyPage('marketPage'); renderProducts();" style="font-size: 1.1rem; padding: 0;">⬅ 返回作者商店</button>
    </div>
    <div class="chapter-layout-grid">
      <div class="detail-left-column">
        <img src="${product.image || "./pic/product.jpg"}" class="comic-detail-cover" style="aspect-ratio: 1/1; object-fit: cover;">
      </div>
      <div class="chapter-list-wrap" style="display: flex; flex-direction: column;">
        <h2 class="comic-detail-title" style="font-size:2rem; margin-bottom:0.5rem;">${product.name}</h2>
        <p class="comic-detail-meta" style="font-size:1.1rem; margin-bottom:1.5rem; color:#666;">賣家：${product.sellerName}</p>
        
        <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; flex: 1;">
            <h3 style="margin-bottom: 10px; color:#18293A; font-size:1.1rem;">商品描述</h3>
            <p style="color: #444; line-height: 1.7;">${product.description || "暫無描述"}</p>
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #eee; padding-top: 1.5rem;">
          <span style="font-size: 1.8rem; color: #ef4444; font-weight: bold;">${product.price} 代幣</span>
          <button class="btn-submit" style="font-size: 1.1rem; padding: 0.8rem 2.5rem;" onclick="buyProduct(${product.id})">立即購買</button>
        </div>
      </div>
    </div>
  `;
  showOnlyPage("productDetailPage");
};

window.buyProduct = function (productId) {
  const user = getActiveUser();
  if (!user) {
    alert("請先登入才能購買商品！");
    return openModal();
  }
  const products = getDB("togetherProducts");
  const product = products.find((p) => String(p.id) === String(productId));
  if (!product) return alert("找不到該商品！");
  const dbUser = findUserByEmail(user.email);

  if ((dbUser.tokens || 0) < Number(product.price))
    return alert(
      `代幣不足！\n您的代幣：${dbUser.tokens || 0} \n商品價格：${product.price} 代幣`,
    );
  if (!confirm(`確定要花費 ${product.price} 代幣，購買「${product.name}」嗎？`))
    return;

  const users = getDB("togetherUsers");
  const buyerIdx = users.findIndex((u) => u.email === user.email);
  users[buyerIdx].tokens -= Number(product.price);
  const sellerIdx = users.findIndex((u) => u.email === product.sellerEmail);
  if (sellerIdx !== -1) {
    users[sellerIdx].tokens =
      (users[sellerIdx].tokens || 0) + Number(product.price);
  }

  saveDB("togetherUsers", users);
  updateSessionLocal(users[buyerIdx]);
  refreshSummary();
  renderMemberCenter();
  alert("🎉 購買成功！賣家將會收到代幣。");
};

function renderCreatorCenter() {
  const user = getActiveUser();
  if (!user) return;
  const comics = getDB("togetherComics").filter(
    (c) => c.authorEmail === user.email,
  );
  const chapters = getDB("togetherChapters");

  creatorComicTableBody.innerHTML = "";
  comics.forEach((c) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${c.title}</td><td>${c.category}</td><td>${c.status}</td><td>${chapters.filter((ch) => ch.comicId === c.id).length}</td>
    <td>
      <button class="btn-action" onclick="openCreatorEditModal(${c.id})">編輯作品</button>
      <button class="btn-action" style="background:#e0f2fe; color:#2563eb;" onclick="openChapterManageModal(${c.id})">章節管理</button>
    </td>`;
    creatorComicTableBody.appendChild(tr);
  });

  const select = document.getElementById("chapterComicSelect");
  select.innerHTML = "";
  comics.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = c.title;
    select.appendChild(opt);
  });
  autoFillChapterTitle();

  const myProducts = getDB("togetherProducts").filter(
    (p) => p.sellerEmail === user.email,
  );
  myProductGrid.innerHTML = "";
  if (myProducts.length === 0) {
    document.getElementById("noMyProductResult").classList.remove("hidden");
  } else {
    document.getElementById("noMyProductResult").classList.add("hidden");
    myProducts.forEach((p) => {
      const div = document.createElement("div");
      div.className = "comic-card";
      div.innerHTML = `<div class="cover portrait" style="aspect-ratio:1/1;"><img src="${p.image || "./pic/product.jpg"}"></div><h3>${p.name}</h3><p class="tag">${p.price} 代幣</p>`;
      myProductGrid.appendChild(div);
    });
  }
}

function autoFillChapterTitle() {
  const comicId = document.getElementById("chapterComicSelect").value;
  if (!comicId) return;
  const chapters = getDB("togetherChapters").filter(
    (ch) => String(ch.comicId) === String(comicId),
  );
  document.getElementById("chapterTitle").value =
    `第 ${chapters.length + 1} 話`;
}
document
  .getElementById("chapterComicSelect")
  .addEventListener("change", autoFillChapterTitle);

function renderMemberCenter() {
  const user = getActiveUser();
  if (!user) return openModal();
  const dbUser = findUserByEmail(user.email);
  if (!dbUser) return;
  document.getElementById("profileEmail").value = dbUser.email;
  document.getElementById("profileUsername").value = dbUser.username;
  document.getElementById("profilePassword").value = "";
  const roleMap = { reader: "讀者", creator: "創作者", admin: "管理員" };
  document.getElementById("profileRole").textContent =
    roleMap[dbUser.role] || dbUser.role;

  if (document.getElementById("profilePoints"))
    document.getElementById("profilePoints").textContent = dbUser.points || 0;
  if (document.getElementById("profileTokens"))
    document.getElementById("profileTokens").textContent = dbUser.tokens || 0;

  if (document.getElementById("exchangePointsDisplay"))
    document.getElementById("exchangePointsDisplay").textContent =
      dbUser.points || 0;
  if (document.getElementById("exchangeTokensDisplay"))
    document.getElementById("exchangeTokensDisplay").textContent =
      dbUser.tokens || 0;

  document.getElementById("profileLevel").textContent =
    dbUser.points >= 300 ? "資深會員" : "新手會員";
}

document.getElementById("exchangeForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const user = getActiveUser();
  if (!user) return;
  const amount = parseInt(document.getElementById("exchangeAmount").value);
  if (amount <= 0 || isNaN(amount)) return alert("請輸入有效的數量");
  const cost = amount * 100;

  const users = getDB("togetherUsers");
  const idx = users.findIndex((u) => u.email === user.email);
  if ((users[idx].points || 0) < cost) {
    return alert(`點數不足！\n兌換 ${amount} 代幣需要 ${cost} 點數。`);
  }

  users[idx].points -= cost;
  users[idx].tokens = (users[idx].tokens || 0) + amount;
  saveDB("togetherUsers", users);
  updateSessionLocal(users[idx]);

  document.getElementById("exchangeAmount").value = "";
  renderMemberCenter();
  refreshSummary();
  alert(`成功使用 ${cost} 點數兌換了 ${amount} 代幣！🎉`);
});

function renderTaskCenter() {
  const user = getActiveUser();
  taskGrid.innerHTML = "";
  if (!user) return;
  const tasks = getDB("togetherTasks").filter((t) => t.isActive);
  const userTasks = getDB("togetherUserTasks");
  tasks.forEach((task) => {
    let record = userTasks.find(
      (item) => item.userEmail === user.email && item.taskId === task.id,
    );
    if (!record) {
      record = {
        userEmail: user.email,
        taskId: task.id,
        progress: 0,
        completed: false,
        claimed: false,
      };
    }
    const card = document.createElement("div");
    card.className = "task-card";
    let btnText = "進行中",
      btnClass = "claim-btn disabled";
    if (record.completed && !record.claimed) {
      btnText = "領取獎勵";
      btnClass = "claim-btn";
    } else if (record.claimed) {
      btnText = "已領取";
    }
    card.innerHTML = `<h3>${task.title}</h3><p class="task-desc">${task.description}</p><p class="task-meta">獎勵：${task.rewardPoints} 點數</p><p class="task-progress">進度：${record.progress} / ${task.target}</p><button class="${btnClass}" data-task-id="${task.id}">${btnText}</button>`;
    const btn = card.querySelector("button");
    if (record.completed && !record.claimed)
      btn.onclick = () => claimTaskReward(task.id);
    taskGrid.appendChild(card);
  });
}

function claimTaskReward(taskId) {
  const user = getActiveUser();
  if (!user) return;
  const task = getDB("togetherTasks").find((t) => t.id === taskId);
  const userTasks = getDB("togetherUserTasks");
  const record = userTasks.find(
    (item) => item.userEmail === user.email && item.taskId === taskId,
  );
  if (!record || !record.completed || record.claimed) return;
  record.claimed = true;
  saveDB("togetherUserTasks", userTasks);
  const users = getDB("togetherUsers");
  const idx = users.findIndex((u) => u.email === user.email);
  users[idx].points = (users[idx].points || 0) + task.rewardPoints;
  saveDB("togetherUsers", users);
  updateSessionLocal(users[idx]);
  refreshSummary();
  renderTaskCenter();
  alert(`領取成功！獲得 ${task.rewardPoints} 點數`);
}

function updateTaskProgress(taskType, amount = 1) {
  const user = getActiveUser();
  if (!user) return;
  const tasks = getDB("togetherTasks").filter(
    (t) => t.isActive && t.type === taskType,
  );
  const userTasks = getDB("togetherUserTasks");
  const today = getTodayStr();
  tasks.forEach((task) => {
    let record = userTasks.find(
      (item) => item.userEmail === user.email && item.taskId === task.id,
    );
    if (!record) {
      record = {
        userEmail: user.email,
        taskId: task.id,
        progress: 0,
        completed: false,
        claimed: false,
        dailyDate: "",
      };
      userTasks.push(record);
    }
    if (task.type === "daily_login" && record.dailyDate !== today) {
      record.dailyDate = today;
      record.progress = 0;
      record.completed = false;
      record.claimed = false;
    }
    if (!record.completed) {
      record.progress += amount;
      if (record.progress >= task.target) record.completed = true;
    }
  });
  saveDB("togetherUserTasks", userTasks);
}

// ====== 6. 表單送出 ======
registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("regEmail").value.trim();
  const pwd = document.getElementById("regPassword").value;
  if (pwd !== document.getElementById("regConfirmPassword").value)
    return alert("密碼不一致");
  const users = getDB("togetherUsers");
  if (users.find((u) => u.email === email)) return alert("帳號已存在");
  const newUser = {
    id: Date.now(),
    email,
    username: document.getElementById("regUsername").value.trim(),
    password: pwd,
    role: "creator",
    points: 500,
    tokens: 0,
    unlockedChapters: [],
  };
  users.push(newUser);
  saveDB("togetherUsers", users);
  localStorage.setItem("togetherCurrentUser", JSON.stringify(newUser));
  updateNavUI();
  closeAllModals();
  alert("註冊成功！送您 500 新手點數");
});

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const user = findUserByEmail(email);
  if (!user || user.password !== document.getElementById("password").value)
    return alert("帳號或密碼錯誤");

  const users = getDB("togetherUsers");
  const idx = users.findIndex((u) => u.email === email);
  document.getElementById("remember").checked
    ? localStorage.setItem("togetherCurrentUser", JSON.stringify(users[idx]))
    : sessionStorage.setItem("togetherTempUser", JSON.stringify(users[idx]));

  const today = getTodayStr();
  if (users[idx].lastLogin !== today) {
    users[idx].lastLogin = today;
    users[idx].points = (users[idx].points || 0) + 100;
    saveDB("togetherUsers", users);
    alert("每日登入獲得 100 點數！");
    updateSessionLocal(users[idx]);
  }
  updateNavUI();
  refreshSummary();
  updateTaskProgress("daily_login", 1);
  closeAllModals();
  showOnlyPage("homePage");
  renderComics();
});

profileForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = getActiveUser();
  if (!user) return;
  const newPwd = document.getElementById("profilePassword").value;
  const users = getDB("togetherUsers");
  const idx = users.findIndex((u) => u.email === user.email);
  if (idx !== -1) {
    users[idx].username = document
      .getElementById("profileUsername")
      .value.trim();
    if (newPwd.length >= 6) users[idx].password = newPwd;
    else if (newPwd.length > 0) return alert("密碼至少6字元");
    saveDB("togetherUsers", users);
    updateSessionLocal(users[idx]);
    alert("資料更新成功！");
    renderMemberCenter();
    refreshSummary();
  }
});

createComicForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = getActiveUser();
  const comics = getDB("togetherComics");
  comics.push({
    id: Date.now(),
    authorEmail: user.email,
    authorName: user.username,
    title: document.getElementById("creatorComicTitle").value,
    category: document.getElementById("creatorComicCategory").value,
    cover9x16: document.getElementById("creatorComicCover9x16").value,
    cover1x1: document.getElementById("creatorComicCover1x1").value,
    description: document.getElementById("creatorComicDesc").value,
    status: "連載中",
  });
  saveDB("togetherComics", comics);
  alert("建立成功");
  createComicForm.reset();
  renderCreatorCenter();
});

const chapFreeChk = document.getElementById("chapterIsFree");
const chapCostInp = document.getElementById("chapterPointsCost");
chapFreeChk.addEventListener("change", (e) => {
  chapCostInp.disabled = e.target.checked;
  if (e.target.checked) chapCostInp.value = 0;
});

createChapterForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const chapters = getDB("togetherChapters");
  const isFree = document.getElementById("chapterIsFree").checked;
  chapters.push({
    id: Date.now(),
    comicId: Number(document.getElementById("chapterComicSelect").value),
    chapterTitle: document.getElementById("chapterTitle").value,
    pages: document.getElementById("chapterImagePath").value.split(","),
    isFree: isFree,
    pointsCost: isFree
      ? 0
      : Number(document.getElementById("chapterPointsCost").value),
    likes: 0,
    views: 0, // ✨ 新增預設觀看與按讚
  });
  saveDB("togetherChapters", chapters);
  alert("章節發布成功");
  document.getElementById("chapterTitle").value = "";
  document.getElementById("chapterImagePath").value = "";
  renderCreatorCenter();
});

// ✨ 修復商品描述沒有正確存入的Bug
sellForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = getActiveUser();
  const p = getDB("togetherProducts");
  p.push({
    id: Date.now(),
    sellerEmail: user.email,
    sellerName: user.username,
    name: document.getElementById("productName").value,
    price: document.getElementById("productPrice").value,
    description: document.getElementById("productDesc").value, // 修復
    image: document.getElementById("productImage").value,
  });
  saveDB("togetherProducts", p);
  updateTaskProgress("sell_product", 1);
  alert("上架成功");
  sellForm.reset();
  renderCreatorCenter();
});

// ====== 編輯作品 ======
window.openCreatorEditModal = function (id) {
  try {
    const c = getDB("togetherComics").find(
      (item) => String(item.id) === String(id),
    );
    if (!c) {
      alert("找不到對應的作品資料，請重新整理頁面。");
      return;
    }
    document.getElementById("creatorEditComicId").value = c.id;
    document.getElementById("creatorEditComicTitle").value = c.title || "";
    document.getElementById("creatorEditComicCategory").value =
      c.category || "奇幻";
    document.getElementById("creatorEditComicCover9x16").value =
      c.cover9x16 || c.cover || "";
    document.getElementById("creatorEditComicCover1x1").value =
      c.cover1x1 || c.cover || "";
    document.getElementById("creatorEditComicStatus").value =
      c.status || "連載中";
    document.getElementById("creatorEditComicDesc").value = c.description || "";
    const modal = document.getElementById("creatorEditComicModal");
    modal.classList.remove("hidden");
    modal.classList.add("show");
    modal.style.display = "flex";
    overlay.classList.add("active");
    document.body.classList.add("no-scroll");
  } catch (err) {
    console.error("編輯視窗發生錯誤:", err);
    alert("系統錯誤，無法開啟編輯器。");
  }
};

creatorEditComicForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = document.getElementById("creatorEditComicId").value;
  const comics = getDB("togetherComics");
  const idx = comics.findIndex((c) => String(c.id) === String(id));
  if (idx !== -1) {
    comics[idx].title = document.getElementById("creatorEditComicTitle").value;
    comics[idx].category = document.getElementById(
      "creatorEditComicCategory",
    ).value;
    comics[idx].cover9x16 = document.getElementById(
      "creatorEditComicCover9x16",
    ).value;
    comics[idx].cover1x1 = document.getElementById(
      "creatorEditComicCover1x1",
    ).value;
    comics[idx].status = document.getElementById(
      "creatorEditComicStatus",
    ).value;
    comics[idx].description = document.getElementById(
      "creatorEditComicDesc",
    ).value;
    saveDB("togetherComics", comics);
    alert("更新成功");
    closeAllModals();
    renderCreatorCenter();
  }
});

// 章節管理與編輯
window.openChapterManageModal = function (comicId) {
  const comic = getDB("togetherComics").find(
    (c) => String(c.id) === String(comicId),
  );
  const chapters = getDB("togetherChapters").filter(
    (ch) => String(ch.comicId) === String(comicId),
  );
  document.getElementById("manageComicTitle").textContent = comic.title;
  const tbody = document.getElementById("manageChapterTableBody");
  tbody.innerHTML = chapters
    .map(
      (ch) => `
      <tr>
          <td>${ch.chapterTitle}</td>
          <td>${ch.isFree ? "免費" : "付費"}</td>
          <td>${ch.isFree ? 0 : ch.pointsCost}</td>
          <td><button class="btn-action" onclick="openChapterEditModal(${ch.id})">編輯</button></td>
      </tr>
  `,
    )
    .join("");
  const modal = document.getElementById("chapterManageModal");
  modal.classList.remove("hidden");
  modal.classList.add("show");
  modal.style.display = "flex";
  overlay.classList.add("active");
  document.body.classList.add("no-scroll");
};

const editChapFreeChk = document.getElementById("editChapterIsFree");
const editChapCostInp = document.getElementById("editChapterPointsCost");
editChapFreeChk.addEventListener("change", (e) => {
  editChapCostInp.disabled = e.target.checked;
  if (e.target.checked) editChapCostInp.value = 0;
});

window.openChapterEditModal = function (chapterId) {
  const ch = getDB("togetherChapters").find(
    (c) => String(c.id) === String(chapterId),
  );
  if (!ch) return;
  document.getElementById("editChapterId").value = ch.id;
  document.getElementById("editChapterComicId").value = ch.comicId;
  document.getElementById("editChapterTitle").value = ch.chapterTitle;
  document.getElementById("editChapterImages").value = ch.pages.join(",");
  document.getElementById("editChapterIsFree").checked = ch.isFree;
  document.getElementById("editChapterPointsCost").value = ch.pointsCost || 0;
  document.getElementById("editChapterPointsCost").disabled = ch.isFree;

  const modal = document.getElementById("chapterEditModal");
  modal.classList.remove("hidden");
  modal.classList.add("show");
  modal.style.display = "flex";
};

window.closeChapterEditModal = function () {
  const modal = document.getElementById("chapterEditModal");
  modal.classList.remove("show");
  modal.classList.add("hidden");
  modal.style.display = "none";
};

document.getElementById("chapterEditForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const id = document.getElementById("editChapterId").value;
  const comicId = document.getElementById("editChapterComicId").value;
  const chapters = getDB("togetherChapters");
  const idx = chapters.findIndex((ch) => String(ch.id) === String(id));
  if (idx !== -1) {
    const isFree = document.getElementById("editChapterIsFree").checked;
    chapters[idx].chapterTitle =
      document.getElementById("editChapterTitle").value;
    chapters[idx].pages = document
      .getElementById("editChapterImages")
      .value.split(",");
    chapters[idx].isFree = isFree;
    chapters[idx].pointsCost = isFree
      ? 0
      : Number(document.getElementById("editChapterPointsCost").value);
    saveDB("togetherChapters", chapters);
    alert("章節更新成功！");
    closeChapterEditModal();
    openChapterManageModal(comicId); // 重新整理列表
  }
});

// ====== 7. 事件綁定 ======
hamburgerBtn.onclick = () => {
  mobileMenu.classList.add("active");
  overlay.classList.add("active");
  document.body.classList.add("no-scroll");
};
closeBtn.onclick = closeMobileMenu;
document.getElementById("closeDrawerBtn").onclick = closeChapterDrawer;
overlay.onclick = () => {
  closeAllModals();
  closeMobileMenu();
  closeChapterDrawer();
};

loginBtn.onclick = openModal;
document.getElementById("mobileLoginBtn").onclick = openModal;
document.getElementById("logoutBtn").onclick = logout;
document.getElementById("mobileLogoutBtn").onclick = logout;
document.getElementById("chapterMenuBtn").onclick = openChapterDrawer;

userBtn.onclick = (e) => {
  e.stopPropagation();
  userDropdown.classList.toggle("hidden");
};
document.onclick = (e) => {
  if (!userArea.contains(e.target)) userDropdown.classList.add("hidden");
};

document.querySelectorAll(".switch-link").forEach((link) => {
  link.onclick = (e) => {
    e.preventDefault();
    document
      .querySelectorAll(".auth-form")
      .forEach((f) => f.classList.remove("active"));
    const target = link.dataset.target;
    if (target === "register") {
      document.getElementById("registerForm").classList.add("active");
      document.getElementById("modalTitle").textContent = "會員註冊";
      document.getElementById("switchToRegister").classList.add("hidden");
      document.getElementById("switchToLogin").classList.remove("hidden");
    } else if (target === "forgot") {
      document.getElementById("forgotForm").classList.add("active");
      document.getElementById("modalTitle").textContent = "忘記密碼";
    } else {
      document.getElementById("loginForm").classList.add("active");
      document.getElementById("modalTitle").textContent = "會員登入";
      document.getElementById("switchToRegister").classList.remove("hidden");
      document.getElementById("switchToLogin").classList.add("hidden");
    }
  };
});

window.toggleCardContent = function (header) {
  header.nextElementSibling.classList.toggle("hidden-content");
  header.querySelector(".toggle-icon").classList.toggle("collapsed");
};

document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".tab-btn")
      .forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach((c) => {
      c.classList.remove("active");
      c.classList.remove("hidden");
    });
    btn.classList.add("active");
    document.getElementById(btn.dataset.target).classList.add("active");
  });
});

const hideDropdown = () => userDropdown.classList.add("hidden");
document.querySelectorAll(".nav-home-link").forEach(
  (btn) =>
    (btn.onclick = (e) => {
      e.preventDefault();
      showOnlyPage("homePage");
      renderComics();
      hideDropdown();
    }),
);
document.getElementById("memberCenterBtn").onclick = (e) => {
  e.preventDefault();
  showOnlyPage("memberPage");
  renderMemberCenter();
  hideDropdown();
};
document.getElementById("mobileMemberBtn").onclick = (e) => {
  e.preventDefault();
  showOnlyPage("memberPage");
  renderMemberCenter();
  closeMobileMenu();
};
document.getElementById("taskCenterBtn").onclick = (e) => {
  e.preventDefault();
  showOnlyPage("taskPage");
  renderTaskCenter();
  hideDropdown();
};
document.getElementById("shopBrowseBtn").onclick = (e) => {
  e.preventDefault();
  showOnlyPage("marketPage");
  renderProducts();
  hideDropdown();
};
document.getElementById("mobileShopBtn").onclick = (e) => {
  e.preventDefault();
  showOnlyPage("marketPage");
  renderProducts();
  closeMobileMenu();
};
document.getElementById("creatorCenterBtn").onclick = (e) => {
  e.preventDefault();
  showOnlyPage("creatorCenterPage");
  renderCreatorCenter();
  hideDropdown();
};
document.getElementById("mobileCreatorBtn").onclick = (e) => {
  e.preventDefault();
  showOnlyPage("creatorCenterPage");
  renderCreatorCenter();
  closeMobileMenu();
};

document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.onclick = (e) => {
    e.preventDefault();
    const cat = btn.dataset.filter;
    showOnlyPage("homePage");
    cat === "全部" ? renderComics() : renderComics((c) => c.category === cat);
  };
});
searchInput.addEventListener("input", (e) => {
  const keyword = e.target.value.toLowerCase();
  showOnlyPage("homePage");
  renderComics(
    (c) =>
      c.title.toLowerCase().includes(keyword) ||
      c.authorName.toLowerCase().includes(keyword),
  );
});

initData();
updateNavUI();
refreshSummary();
showOnlyPage("homePage");
renderComics();
