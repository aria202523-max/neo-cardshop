import { fetchSheetRows } from "./sheet-fetch.js";
import { JISSEKI_CSV_URL, isSheetConfigured } from "../data/sheet-config.js";
import { SAMPLE_JISSEKI_ROWS } from "../data/sample-jisseki.js";
import { categoryLabel } from "../data/categories.js";

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function buildJissekiCard(row) {
  const card = el("div", "jisseki-card");

  const photo = el("div", "jisseki-photo");
  if (row.image_url) {
    const img = document.createElement("img");
    img.src = row.image_url;
    img.alt = row.item_name;
    photo.append(img);
  } else {
    photo.textContent = "PHOTO";
  }

  const body = el("div", "jisseki-body");
  const meta = el("div", "jisseki-meta");
  meta.append(el("span", "jisseki-date mono", row.date), el("span", "jisseki-cat", categoryLabel(row.category)));
  body.append(meta);
  body.append(el("div", "jisseki-name", row.item_name));
  if (row.comment) body.append(el("p", "jisseki-comment", row.comment));

  card.append(photo, body);
  return card;
}

export async function initJissekiPage(root) {
  const grid = root.querySelector("#jissekiGrid");
  const updatedLabel = root.querySelector("#updatedLabel");

  let rows = SAMPLE_JISSEKI_ROWS;
  if (isSheetConfigured(JISSEKI_CSV_URL)) {
    try {
      rows = await fetchSheetRows(JISSEKI_CSV_URL);
    } catch (err) {
      console.error("買取実績データの取得に失敗したため、サンプルデータを表示します。", err);
    }
  }

  grid.innerHTML = "";
  rows.forEach((row) => grid.append(buildJissekiCard(row)));

  if (updatedLabel) {
    const now = new Date();
    updatedLabel.textContent = `最終読み込み: ${now.toLocaleString("ja-JP", { hour12: false })}`;
  }
}
