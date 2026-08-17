import { fetchSheetRows } from "./sheet-fetch.js";
import { KAITORIHYO_CSV_URL, isSheetConfigured } from "../data/sheet-config.js";
import { SAMPLE_KAITORIHYO_ROWS } from "../data/sample-kaitorihyo.js";
import { CATEGORIES, categoryLabel } from "../data/categories.js";

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// Google Sheets auto-detects true/false text as booleans and exports them as
// "TRUE"/"FALSE" in CSV, so compare case-insensitively rather than to "true".
function isTrue(value) {
  return typeof value === "string" && value.trim().toLowerCase() === "true";
}

function buildTag(row) {
  if (isTrue(row.graded)) {
    const tag = el("span", "slab-tag");
    tag.append(el("span", "bar"), el("span", "label", row.grade_label || "GRADED"));
    return tag;
  }
  return el("span", "tag-retro", "RETRO");
}

function buildThumb(row) {
  const thumb = el("div", "pt-thumb");
  if (row.image_url) {
    const img = document.createElement("img");
    img.src = row.image_url;
    img.alt = row.card_name;
    thumb.append(img);
  } else {
    thumb.append(el("span", "pt-thumb-empty", "PHOTO"));
  }
  return thumb;
}

function buildPriceRow(row) {
  // Named "pt-row" (not "price-row") on purpose: global.css already defines a
  // .price-row grid layout for the unrelated TOP-page sample card, and reusing
  // that class name on a <tr> forced display:grid onto the table row.
  const tr = el("tr", "pt-row");
  tr.dataset.name = row.card_name;

  const thumbTd = el("td", "pt-thumb-cell");
  thumbTd.append(buildThumb(row));

  const nameTd = el("td", "pt-name-cell");
  nameTd.append(el("div", "pt-name", row.condition || row.card_name));
  const sub = el("div", "pt-sub");
  sub.append(buildTag(row));
  nameTd.append(sub);

  const priceTd = el("td", "pt-price mono", row.price);
  const dateTd = el("td", "pt-date mono", row.updated || "");

  tr.append(thumbTd, nameTd, priceTd, dateTd);
  return tr;
}

function buildImageCard(row) {
  const card = el("div", "highlight-card");
  if (row.image_url) {
    const img = document.createElement("img");
    img.src = row.image_url;
    img.alt = row.condition || row.card_name;
    card.append(img);
  } else {
    card.append(el("span", "highlight-empty", "PHOTO"));
  }
  return card;
}

// Rows flagged true for a given boolean column, capped at `max`.
function pickRows(rows, field, max = 4) {
  return rows.filter((r) => isTrue(r[field])).slice(0, max);
}

// Shared by both the ピックアップ買取 and 注目の高額買取 sections: render a
// pre-picked list of rows as full-width image-only cards.
function renderImageBlock(container, picked) {
  container.innerHTML = "";
  picked.forEach((row) => container.append(buildImageCard(row)));
  container.closest(".highlight-block")?.classList.toggle("is-empty", picked.length === 0);
}

function renderCatalog(container, rows) {
  container.innerHTML = "";
  const byCategory = new Map();
  rows.forEach((row) => {
    if (!byCategory.has(row.category)) byCategory.set(row.category, []);
    byCategory.get(row.category).push(row);
  });

  CATEGORIES.forEach(({ key }) => {
    const items = byCategory.get(key);
    if (!items || items.length === 0) return;

    const group = el("div", "cat-group");
    group.dataset.cat = key;

    const head = el("div", "cat-group-head");
    head.append(el("h2", "display", categoryLabel(key)), el("span", "count", `${items.length}件`));

    const scroll = el("div", "price-table-scroll");
    const table = el("table", "price-table");
    const thead = el("thead");
    const headRow = el("tr");
    headRow.append(el("th", "", "画像"), el("th", "", "カード名"), el("th", "pt-th-price", "買取金額"), el("th", "pt-th-date", "更新日"));
    thead.append(headRow);
    const tbody = el("tbody");
    items.forEach((row) => tbody.append(buildPriceRow(row)));
    table.append(thead, tbody);
    scroll.append(table);

    group.append(head, scroll);
    container.append(group);
  });
}

function setupFilters(root) {
  const searchInput = root.querySelector("#cardSearch");
  const filterBtns = root.querySelectorAll("#catFilter button");
  const groups = root.querySelectorAll(".cat-group");
  const emptyState = root.querySelector("#emptyState");
  let currentCat = "all";

  function applyFilters() {
    const q = searchInput.value.trim().toLowerCase();
    let anyVisible = false;

    groups.forEach((group) => {
      const cat = group.getAttribute("data-cat");
      const catMatch = currentCat === "all" || cat === currentCat;
      const rows = group.querySelectorAll(".pt-row");
      let visibleInGroup = 0;

      rows.forEach((row) => {
        const name = (row.dataset.name + " " + row.textContent).toLowerCase();
        const textMatch = q === "" || name.indexOf(q) !== -1;
        const show = catMatch && textMatch;
        row.classList.toggle("is-hidden", !show);
        if (show) visibleInGroup++;
      });

      const groupVisible = catMatch && visibleInGroup > 0;
      group.style.display = groupVisible ? "" : "none";
      if (groupVisible) anyVisible = true;
    });

    emptyState.classList.toggle("show", !anyVisible);
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentCat = btn.getAttribute("data-cat");
      applyFilters();
    });
  });

  searchInput.addEventListener("input", applyFilters);
}

export async function initKaitorihyoPage(root) {
  const pickupGrid = root.querySelector("#pickupGrid");
  const highlightGrid = root.querySelector("#highlightGrid");
  const catalog = root.querySelector("#catalog");
  const updatedLabel = root.querySelector("#updatedLabel");

  let rows = SAMPLE_KAITORIHYO_ROWS;
  if (isSheetConfigured(KAITORIHYO_CSV_URL)) {
    try {
      rows = await fetchSheetRows(KAITORIHYO_CSV_URL);
    } catch (err) {
      console.error("買取表データの取得に失敗したため、サンプルデータを表示します。", err);
    }
  }

  // Anything shown as a pickup drops out of every section below it, so the
  // same card doesn't get repeated down the page.
  const pickupRows = pickRows(rows, "pickup");
  const pickupSet = new Set(pickupRows);
  const remainingRows = rows.filter((r) => !pickupSet.has(r));

  renderImageBlock(pickupGrid, pickupRows);
  renderImageBlock(highlightGrid, pickRows(remainingRows, "highlight"));
  renderCatalog(catalog, remainingRows);
  setupFilters(root);

  if (updatedLabel) {
    const now = new Date();
    updatedLabel.textContent = `最終読み込み: ${now.toLocaleString("ja-JP", { hour12: false })}`;
  }
}
