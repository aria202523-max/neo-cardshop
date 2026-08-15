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
  const thumb = el("div", "price-thumb");
  if (row.image_url) {
    const img = document.createElement("img");
    img.src = row.image_url;
    img.alt = row.card_name;
    img.width = 52;
    img.height = 52;
    thumb.append(img);
  } else {
    thumb.append(el("span", "price-thumb-empty", "PHOTO"));
  }
  return thumb;
}

function buildPriceRow(row) {
  const wrap = el("div", "price-row");
  wrap.dataset.name = row.card_name;

  const left = el("div");
  left.append(el("div", "price-row-name", row.condition || row.card_name));
  const sub = el("div", "price-row-sub");
  sub.append(buildTag(row));
  left.append(sub);

  const stack = el("div", "price-stack");
  stack.append(el("div", "price-value mono", row.price), el("div", "price-diff-up mono", row.diff || ""));

  wrap.append(buildThumb(row), left, stack);
  return wrap;
}

function buildHighlightCard(row) {
  const card = el("div", "highlight-card");
  const photo = el("div", "photo");
  if (row.image_url) {
    const img = document.createElement("img");
    img.src = row.image_url;
    img.alt = row.card_name;
    photo.append(img);
  } else {
    photo.textContent = "PHOTO";
  }
  card.append(
    photo,
    el("span", "badge", isTrue(row.graded) ? row.grade_label || "GRADED" : "RETRO"),
    el("div", "name", row.condition || row.card_name),
    el("div", "price mono", row.price)
  );
  return card;
}

function renderHighlights(container, rows) {
  const highlighted = rows.filter((r) => isTrue(r.highlight)).slice(0, 4);
  container.innerHTML = "";
  highlighted.forEach((row) => container.append(buildHighlightCard(row)));
  container.closest(".highlight-block")?.classList.toggle("is-empty", highlighted.length === 0);
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

    const priceCard = el("div", "price-card");
    items.forEach((row) => priceCard.append(buildPriceRow(row)));

    group.append(head, priceCard);
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
      const rows = group.querySelectorAll(".price-row");
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

  renderHighlights(highlightGrid, rows);
  renderCatalog(catalog, rows);
  setupFilters(root);

  if (updatedLabel) {
    const now = new Date();
    updatedLabel.textContent = `最終読み込み: ${now.toLocaleString("ja-JP", { hour12: false })}`;
  }
}
