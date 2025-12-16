(() => {
  // ====== Password Gate ======
  const ACCESS_PASSWORD = "pfizertw";
  const STORAGE_KEY = "pf_gate_ok";

  const gate = document.getElementById("pwGate");
  const protectedEl = document.getElementById("protected");
  const input = document.getElementById("pwInput");
  const btn = document.getElementById("pwBtn");
  const err = document.getElementById("pwErr");

  function unlock() {
    gate.classList.add("is-hidden");
    gate.setAttribute("aria-hidden", "true");
    protectedEl.hidden = false;
    document.body.style.overflow = ""; // 還原滾動

    // 解鎖後才開始下雪
    startSnow();
  }

  function lock() {
    gate.classList.remove("is-hidden");
    gate.setAttribute("aria-hidden", "false");
    protectedEl.hidden = true;
    document.body.style.overflow = "hidden"; // 鎖住滾動
    setTimeout(() => input && input.focus(), 0);
  }

  function checkPassword() {
    const value = (input.value || "").trim();
    if (value === ACCESS_PASSWORD) {
      // localStorage.setItem(STORAGE_KEY, "1");
      err.textContent = "";
      unlock();
    } else {
      err.textContent = "密碼錯誤，請再試一次";
      input.select();
      input.focus();
    }
  }

  // // 若已通過（記住登入），直接解鎖
  // if (localStorage.getItem(STORAGE_KEY) === "1") {
  //   unlock();
  // } else {
  //   lock();
  // }

  btn.addEventListener("click", checkPassword);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") checkPassword();
  });

  // ====== Password Toggle (眼睛圖示切換顯示/隱藏密碼) ======
  const togglePwBtn = document.getElementById("togglePw");

  if (togglePwBtn && input) {
    togglePwBtn.addEventListener("click", () => {
      const isPassword = input.type === "password";

      // 切換 input type
      input.type = isPassword ? "text" : "password";

      // 切換按鈕樣式
      togglePwBtn.classList.toggle("show", isPassword);

      // 更新 aria-label
      togglePwBtn.setAttribute("aria-label", isPassword ? "隱藏密碼" : "顯示密碼");

      // 保持焦點在輸入框
      input.focus();
    });
  }

  // ====== Time Gate (未到時間顯示 wait1.jpg) ======
  const WAIT_IMG = "./img/wait1.jpg";

  // 為本次頁面載入生成一個唯一的時間戳（所有資源共用）
  const PAGE_TIMESTAMP = Date.now();

  // 加上時間戳避免快取
  function addTimestamp(url) {
    return `${url}?t=${PAGE_TIMESTAMP}`;
  }

  // 這個活動是 12 月（JavaScript 月份：0=1月...11=12月）
  const CAMPAIGN_MONTH = 11; // Dec

  // 活動年份（你如果每年都用同一套，改成 new Date().getFullYear()）
  const CAMPAIGN_YEAR = 2025;

  function getUnlockAt(day, data) {
    // 若你想針對特定天設定精準時間，可在 dayContent 裡放 unlockAt
    // 例如 unlockAt: "2025-12-15T10:00:00+08:00"
    if (data && data.unlockAt) return new Date(data.unlockAt);

    // 預設：該日 00:00 解鎖（本地時間）
    return new Date(CAMPAIGN_YEAR, CAMPAIGN_MONTH, day, 0, 0, 0);
  }


  // ====== Modal content per day ======
  const dayContent = {
    17: {
      title: "認識「各式各樣的乳癌小雪怪」",
      img: "./img/doc17.jpg"
    },
    22: {
      title: "選擇「正確的武器，打敗乳癌小雪怪」",
      img: "./img/doc22.jpg"
    },
    24: {
      title: "提高勝率攻略「早期發現乳癌小雪怪」",
      img: "./img/doc24.jpg"
    },
    25: {
      title: "Merry Christmas",
      img: "./img/doc25.jpg"
    }
  };


  // ====== Modal handlers ======
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");
  const modalOk = document.getElementById("modalOk");

  let lastActiveElement = null;

  function openModal(day) {
    const data = dayContent[day] || {
      title: "尚未開箱，敬請期待",
      body: `<p>尚未開箱，敬請期待</p>`
    };

    lastActiveElement = document.activeElement;

    // ====== Time check ======
    const now = new Date();
    const unlockAt = getUnlockAt(day, data);
    // const notYet = 0; // 測試模式：設為 0 強制全部開箱，設為 now < unlockAt 恢復正常
    const notYet = now < unlockAt;

    if (notYet) {
      // 尚未開箱時，統一顯示
      modalTitle.textContent = "尚未開箱，敬請期待";

      modalBody.innerHTML = `
        <img class="modal-img" src="${addTimestamp(WAIT_IMG)}" alt="尚未開箱" />
      `;
    } else {
      // 已開箱時，計算距離聖誕節的天數（25 - 當天日期）
      const daysToXmas = 25 - day;

      // 如果是聖誕節當天（倒數0天），只顯示標題
      if (daysToXmas === 0) {
        modalTitle.textContent = data.title;
      } else {
        modalTitle.textContent = `聖誕節倒數 ${daysToXmas} 天｜${data.title}`;
      }

      if (data.img) {
        // 聖誕節當天的圖片（暫時停用 YouTube 連結）
        if (day === 25) {
          modalBody.innerHTML = `
            <img class="modal-img" src="${addTimestamp(data.img)}" alt="${data.title}" />
          `;
          // === 暫時停用 YouTube 連結，之後要啟用把上面改成下面這段 ===
          // modalBody.innerHTML = `
          //   <a id="xmasYoutubeLink" href="https://www.youtube.com/watch?v=aAkMkVFwAoo" target="_blank" rel="noopener noreferrer">
          //     <img class="modal-img" src="${addTimestamp(data.img)}" alt="${data.title}" style="cursor: pointer;" />
          //   </a>
          // `;
          // // GA4 事件追蹤：記錄 YouTube 連結點擊
          // const youtubeLink = document.getElementById("xmasYoutubeLink");
          // if (youtubeLink) {
          //   youtubeLink.addEventListener("click", () => {
          //     if (typeof gtag === "function") {
          //       gtag("event", "youtube_link_click", {
          //         event_category: "engagement",
          //         event_label: "Merry Christmas YouTube",
          //         page_name: "pink_forward_calendar"
          //       });
          //     }
          //   });
          // }
        } else {
          modalBody.innerHTML = `
            <img class="modal-img" src="${addTimestamp(data.img)}" alt="${data.title}" />
          `;
        }
      } else {
        modalBody.innerHTML = `<p>尚未開箱，敬請期待</p>`;
      }
    }

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    // 每次打開彈窗都將捲軸重置到最上面
    modalBody.scrollTop = 0;

    const closeBtn = modal.querySelector(".btn-close");
    closeBtn && closeBtn.focus();
  }


  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    if (lastActiveElement && typeof lastActiveElement.focus === "function") {
      lastActiveElement.focus();
    }
  }

  // 只讓粉紅 / xmas 的格子可點
  document.querySelectorAll(".day.pink, .day.xmas").forEach(btn => {
    btn.addEventListener("click", () => {
      const day = Number(btn.dataset.day);
      openModal(day);

      // GA4 事件追蹤：記錄使用者點擊了哪一天
      if (typeof gtag === "function") {
        gtag("event", "calendar_day_click", {
          event_category: "engagement",
          event_label: `Day ${day}`,
          day_number: day,
          page_name: "pink_forward_calendar"
        });
      }
    });
  });

  // backdrop / close buttons
  modal.addEventListener("click", (e) => {
    const target = e.target;
    if (target && target.getAttribute("data-modal-close") === "true") {
      closeModal();
    }
  });

  // OK button = close
  modalOk.addEventListener("click", closeModal);

  // ESC close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });

  // 簡易 focus trap
  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("is-open")) return;
    if (e.key !== "Tab") return;

    const focusables = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const list = Array.from(focusables).filter(el => !el.hasAttribute("disabled"));

    if (list.length === 0) return;

    const first = list[0];
    const last = list[list.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  // ====== Snow (pure CSS flakes spawned by JS) ======
  const snowLayer = document.getElementById("snow-layer");

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createSnowflake() {
    const flake = document.createElement("div");
    flake.className = "snowflake";

    const arm = document.createElement("span");
    arm.className = "arm";
    flake.appendChild(arm);

    const size = rand(6, 14);
    const left = rand(0, 100);
    const duration = rand(6.5, 14);
    const opacity = rand(0.25, 0.75);
    const drift = rand(-40, 40);

    flake.style.left = `${left}vw`;
    flake.style.width = `${size}px`;
    flake.style.height = `${size}px`;
    flake.style.opacity = `${opacity}`;
    flake.style.setProperty("--drift", `${drift}px`);
    flake.style.animationDuration = `${duration}s`;

    snowLayer.appendChild(flake);

    const cleanup = () => {
      flake.removeEventListener("animationend", cleanup);
      flake.remove();
    };
    flake.addEventListener("animationend", cleanup);
  }

  let snowTimer = null;
  function startSnow() {
    if (snowTimer) return;
    snowTimer = setInterval(() => {
      createSnowflake();
      if (Math.random() > 0.65) createSnowflake();
    }, rand(140, 260));
  }

  // 雪花會在 unlock() 時啟動，不在這裡自動啟動
  // startSnow();

  // ====== Preload Images ======
  function preloadAllImages() {
    const preloadContainer = document.getElementById('preloadImages');
    if (!preloadContainer) return;

    // 預載等待圖片
    const waitImg = document.createElement('img');
    waitImg.src = addTimestamp(WAIT_IMG);
    waitImg.alt = 'preload';
    preloadContainer.appendChild(waitImg);

    // 預載所有內容圖片
    Object.values(dayContent).forEach(data => {
      if (data.img) {
        const img = document.createElement('img');
        img.src = addTimestamp(data.img);
        img.alt = 'preload';
        preloadContainer.appendChild(img);
      }
    });
  }

  // 頁面載入完成後預載圖片
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preloadAllImages);
  } else {
    preloadAllImages();
  }

  // ====== Current Date/Time Display ======
  function updateDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const dateTimeEl = document.getElementById('currentDateTime');
    if (dateTimeEl) {
      dateTimeEl.textContent = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
  }

  // 立即更新一次
  updateDateTime();

  // 每秒更新一次
  setInterval(updateDateTime, 1000);
})();
