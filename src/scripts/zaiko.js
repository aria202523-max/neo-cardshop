import { fetchSheetRows } from "./sheet-fetch.js";
import { ZAIKO_CSV_URL, isSheetConfigured } from "../data/sheet-config.js";
import { SAMPLE_ZAIKO_ROWS } from "../data/sample-zaiko.js";
import { categoryLabel } from "../data/categories.js";

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function buildStockCard(row, onOrder) {
  const card = el("div", "stock-card");
  card.dataset.id = row.id;

  const photo = el("div", "stock-photo", row.image_url ? "" : "PHOTO");
  if (row.image_url) {
    const img = document.createElement("img");
    img.src = row.image_url;
    img.alt = row.name;
    photo.append(img);
  }

  const body = el("div", "stock-body");
  body.append(el("span", "stock-status", row.status || "在庫あり"));
  body.append(el("div", "stock-name", row.name));
  body.append(el("div", "stock-condition", row.condition));
  if (row.description) body.append(el("p", "stock-desc", row.description));
  body.append(el("div", "stock-price mono", row.price));

  const orderBtn = el("button", "stock-order-btn", "この商品を注文する");
  orderBtn.type = "button";
  orderBtn.addEventListener("click", () => onOrder(row));
  body.append(orderBtn);

  card.append(photo, body);
  return card;
}

export async function initZaikoPage(root) {
  const grid = root.querySelector("#stockGrid");
  const updatedLabel = root.querySelector("#updatedLabel");
  const form = root.querySelector("#orderForm");
  const itemField = root.querySelector("#orderItemField");
  const itemDisplay = root.querySelector("#orderItemDisplay");

  let rows = SAMPLE_ZAIKO_ROWS;
  if (isSheetConfigured(ZAIKO_CSV_URL)) {
    try {
      rows = await fetchSheetRows(ZAIKO_CSV_URL);
    } catch (err) {
      console.error("在庫データの取得に失敗したため、サンプルデータを表示します。", err);
    }
  }

  function selectItem(row) {
    itemField.value = `${row.id} / ${row.name} / ${row.price}`;
    itemDisplay.textContent = `選択中の商品: ${row.name}(${row.price})`;
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  grid.innerHTML = "";
  rows.forEach((row) => grid.append(buildStockCard(row, selectItem)));

  form.addEventListener("submit", (event) => {
    if (!itemField.value) {
      event.preventDefault();
      itemDisplay.textContent = "先に注文したい商品の「この商品を注文する」を押してください。";
      itemDisplay.classList.add("is-error");
    }
  });

  if (updatedLabel) {
    const now = new Date();
    updatedLabel.textContent = `最終読み込み: ${now.toLocaleString("ja-JP", { hour12: false })}`;
  }
}

export { categoryLabel };
