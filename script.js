(() => {
  // ====== Modal content per day ======
  const dayContent = {
    15: {
      title: "Day 15｜乳癌小知識 #1",
      body: `
        <p><strong>主題：</strong>乳房自我覺察（Breast Awareness）</p>
        <p>你不需要「記住一個標準答案的觸感」，而是要熟悉自己平常的狀態；一旦有變化（硬塊、凹陷、皮膚改變、乳頭分泌物等）就及早就醫。你不需要「記住一個標準答案的觸感」，而是要熟悉自己平常的狀態；一旦有變化（硬塊、凹陷、皮膚改變、乳頭分泌物等）就及早就醫。</p>
        <ul>
          <li>洗澡時、換衣服時，都可以快速看一眼與摸一下</li>
          <li>有疑慮就記下發生時間與位置，方便就醫描述</li>
        </ul>
      `
    },
    17: {
      title: "Day 17｜乳癌小知識 #2",
      body: `
        <p><strong>主題：</strong>乳癌篩檢（概念版）</p>
        <p>不同年齡與風險族群的建議會不同；若你有家族史或特殊風險，建議與醫師討論個人化的檢查策略。</p>
        <ul>
          <li>把「家族史（幾親等、年齡）」整理清楚</li>
          <li>把最近身體變化記錄下來（有沒有痛、硬塊、皮膚變化）</li>
        </ul>
      `
    },
    22: {
      title: "Day 22｜乳癌小知識 #3",
      body: `
        <p><strong>主題：</strong>常見迷思</p>
        <ul>
          <li><strong>迷思：</strong>一定要痛才是問題 → <strong>事實：</strong>很多狀況不會痛</li>
          <li><strong>迷思：</strong>年輕就不會得 → <strong>事實：</strong>風險較低但不是不可能</li>
          <li><strong>迷思：</strong>摸到硬塊就一定是癌 → <strong>事實：</strong>也可能是良性變化，仍建議檢查確認</li>
        </ul>
        <p>重點是：有疑慮就確認，不要自己嚇自己或拖著不看。</p>
      `
    },
    24: {
      title: "Day 24｜平安夜小提醒",
      body: `
        <p><strong>主題：</strong>把關心變成一個「可持續」的小習慣</p>
        <ul>
          <li>今天做 30 秒乳房覺察：看、摸、記</li>
          <li>把下次檢查提醒設在手機行事曆</li>
          <li>如果你願意：把這份提醒分享給一位你關心的人</li>
        </ul>
      `
    },
    25: {
      title: "Day 25｜Merry Christmas",
      body: `
        <p>聖誕快樂！</p>
        <p>願你今年更靠近健康與安心。也謝謝你願意把「自我關照」放進生活裡。</p>
        <ul>
          <li>今天給自己一個擁抱：你很努力了</li>
          <li>把健康當作長期投資：規律覺察、定期諮詢</li>
        </ul>
      `
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
      title: `Day ${day}`,
      body: `<p>這天的內容尚未設定。</p>`
    };

    lastActiveElement = document.activeElement;

    modalTitle.textContent = data.title;
    modalBody.innerHTML = data.body;

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    // 修正：focus 到真正可點的關閉按鈕（不是 backdrop）
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

  startSnow();
})();
