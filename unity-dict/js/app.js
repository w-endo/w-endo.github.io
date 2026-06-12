// ================================================================
// app.js  ── UI ロジック
// データの追加・修正は data/entries.js を編集してください
// ================================================================

let state = { q: "", cat: "all", diff: null, genre: null };

// ── フィルタリング ───────────────────────────────────────────────
function getEntries() {
  return ENTRIES.filter(e => {
    if (state.q) {
      const q = state.q.toLowerCase();
      if (
        !e.title.includes(state.q) &&
        !e.desc.includes(state.q) &&
        !e.components.join().toLowerCase().includes(q)
      ) return false;
    }
    if (state.cat !== "all" && !e.cats.includes(state.cat)) return false;
    if (state.diff !== null && e.diff !== state.diff) return false;
    if (state.genre !== null && !e.genres.includes(state.genre)) return false;
    return true;
  });
}

// ── ヘルパー ────────────────────────────────────────────────────
function tagClass(cat) {
  const map = {
    action: "tag-action", physics: "tag-physics", ui: "tag-ui",
    input: "tag-input", enemy: "tag-enemy", audio: "tag-audio",
    scene: "tag-scene", data: "tag-data"
  };
  return "tag " + (map[cat] || "tag-action");
}

function tagLabel(cat) {
  const map = {
    action: "アクション", physics: "物理", ui: "UI", input: "入力",
    enemy: "敵・AI", audio: "音・FX", scene: "シーン", data: "データ"
  };
  return map[cat] || cat;
}

function kindLabel(k) {
  const map = {
    method: "メソッド", event: "イベント", property: "プロパティ",
    class: "クラス", lifecycle: "ライフサイクル"
  };
  return map[k] || k;
}

function stars(d) {
  return "★".repeat(d) + "☆".repeat(3 - d);
}

// ── カード一覧の描画 ─────────────────────────────────────────────
function render() {
  const entries = getEntries();
  document.getElementById("count").textContent = entries.length + " 件";

  // アクティブフィルタ チップ
  const af = document.getElementById("activeFilters");
  af.innerHTML = "";

  if (state.cat !== "all") {
    const chip = document.createElement("span");
    chip.className = "active-tag " + tagClass(state.cat);
    chip.textContent = "✕ " + tagLabel(state.cat);
    chip.onclick = () => {
      state.cat = "all";
      document.querySelectorAll("[data-cat]").forEach(
        b => b.classList.toggle("active", b.dataset.cat === "all")
      );
      render();
    };
    af.appendChild(chip);
  }

  if (state.diff !== null) {
    const chip = document.createElement("span");
    chip.className = "active-tag tag-action";
    chip.textContent = "✕ " + stars(state.diff);
    chip.onclick = () => {
      state.diff = null;
      document.querySelectorAll("[data-diff]").forEach(b => b.classList.remove("active"));
      render();
    };
    af.appendChild(chip);
  }

  if (state.genre !== null) {
    const chip = document.createElement("span");
    chip.className = "active-tag tag-scene";
    chip.textContent = "✕ " + GENRE_TAGS[state.genre].label;
    chip.onclick = () => {
      state.genre = null;
      document.querySelectorAll(".genre-btn").forEach(b => b.classList.remove("active"));
      render();
    };
    af.appendChild(chip);
  }

  const cards    = document.getElementById("cards");
  const noResult = document.getElementById("noResult");
  cards.innerHTML = "";

  if (entries.length === 0) {
    noResult.style.display = "block";
    return;
  }
  noResult.style.display = "none";

  entries.forEach(e => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-header">
        <div class="card-icon">${e.icon}</div>
        <div class="card-title">${e.title}</div>
      </div>
      <div class="card-desc">${e.desc}</div>
      <div class="card-footer">
        <div class="tags">
          ${e.cats.slice(0, 2).map(c => `<span class="${tagClass(c)}">${tagLabel(c)}</span>`).join("")}
        </div>
        <div class="stars">${stars(e.diff)}</div>
      </div>
    `;
    card.onclick = () => openModal(e);
    cards.appendChild(card);
  });
}

// ── モーダル ────────────────────────────────────────────────────
function openModal(e) {
  const related = ENTRIES.filter(x => e.related.includes(x.id));

  const keywordsHtml = (e.keywords && e.keywords.length) ? `
    <div class="section-label">📖 キーワード解説</div>
    <div class="keyword-list">
      ${e.keywords.map((kw, i) => `
        <div class="keyword-item" id="kw-${e.id}-${i}">
          <div class="keyword-header" onclick="toggleKeyword('kw-${e.id}-${i}')">
            <span class="keyword-name">${kw.name}</span>
            <span class="keyword-kind kind-${kw.kind}">${kindLabel(kw.kind)}</span>
            <span class="keyword-summary">${kw.summary}</span>
            <span class="keyword-chevron">▶</span>
          </div>
          <div class="keyword-body">
            <div class="keyword-desc">${kw.desc}</div>
            <div class="keyword-syntax">${kw.syntax}</div>
            ${kw.note ? `<div class="keyword-note">💡 ${kw.note}</div>` : ""}
          </div>
        </div>
      `).join("")}
    </div>` : "";

  document.getElementById("modalContent").innerHTML = `
    <div class="modal-title">${e.icon} ${e.title}</div>
    <div class="modal-sub">難易度：${stars(e.diff)}</div>
    <div class="modal-tags">
      ${e.cats.map(c => `<span class="${tagClass(c)}">${tagLabel(c)}</span>`).join("")}
    </div>

    <div class="section-label">💡 考え方</div>
    <div class="idea-box">${e.idea}</div>

    <div class="section-label">🔧 使うコンポーネント</div>
    <div class="components">
      ${e.components.map(c => `<span class="comp-tag">${c}</span>`).join("")}
    </div>

    <div class="section-label">📝 サンプルコード</div>
    <pre>${e.code}</pre>

    ${keywordsHtml}

    <div class="section-label">⚠️ ハマりポイント</div>
    <div class="warn-box">${e.warn}</div>

    ${related.length ? `
    <div class="section-label">🔗 関連項目</div>
    <div class="related-links">
      ${related.map(r => `
        <a class="rel-link" onclick="openModal(ENTRIES.find(x=>x.id==${r.id}))">
          ${r.icon} ${r.title}
        </a>
      `).join("")}
    </div>` : ""}
  `;

  document.getElementById("modalOverlay").classList.add("open");
}

function toggleKeyword(id) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle("open");
}

// ── イベントリスナー ─────────────────────────────────────────────
document.getElementById("search").addEventListener("input", e => {
  state.q = e.target.value;
  render();
});

document.querySelectorAll("[data-cat]").forEach(btn => {
  btn.addEventListener("click", () => {
    state.cat = btn.dataset.cat;
    document.querySelectorAll("[data-cat]").forEach(
      b => b.classList.toggle("active", b === btn)
    );
    render();
  });
});

document.querySelectorAll("[data-diff]").forEach(btn => {
  btn.addEventListener("click", () => {
    const d = parseInt(btn.dataset.diff);
    if (state.diff === d) {
      state.diff = null;
      btn.classList.remove("active");
    } else {
      state.diff = d;
      document.querySelectorAll("[data-diff]").forEach(
        b => b.classList.toggle("active", b === btn)
      );
    }
    render();
  });
});

document.querySelectorAll(".genre-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const g = btn.dataset.genre;
    if (state.genre === g) {
      state.genre = null;
      btn.classList.remove("active");
    } else {
      state.genre = g;
      document.querySelectorAll(".genre-btn").forEach(
        b => b.classList.toggle("active", b === btn)
      );
    }
    render();
  });
});

document.getElementById("modalClose").onclick = () =>
  document.getElementById("modalOverlay").classList.remove("open");

document.getElementById("modalOverlay").onclick = e => {
  if (e.target === document.getElementById("modalOverlay"))
    document.getElementById("modalOverlay").classList.remove("open");
};

// ── 初期描画 ─────────────────────────────────────────────────────
render();
