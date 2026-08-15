// Google Sheets integration config.
//
// How to connect the real spreadsheet (once the shop's sheet exists):
//   1. In Google Sheets: File > Share > 「ウェブに公開」(Publish to web)
//   2. Choose the specific tab (not "Entire document") and format "カンマ区切りの値(.csv)"
//   3. Copy the resulting URL and paste it below, replacing the REPLACE_WITH_... placeholder
//
// Until a real URL is set, pages fall back to the bundled sample data in
// src/data/sample-*.js so the site still works end-to-end during development/review.

export const KAITORIHYO_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTFFru3YoqaHoFrOC7lmPUyAtk_Sfa4OW9Jz7vZT_-9mkB_Ti3axxnG2TTCgx5uYOaQ6oflebEeoJEu/pub?gid=0&single=true&output=csv";
export const ZAIKO_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTFFru3YoqaHoFrOC7lmPUyAtk_Sfa4OW9Jz7vZT_-9mkB_Ti3axxnG2TTCgx5uYOaQ6oflebEeoJEu/pub?gid=1468018503&single=true&output=csv";
export const JISSEKI_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTFFru3YoqaHoFrOC7lmPUyAtk_Sfa4OW9Jz7vZT_-9mkB_Ti3axxnG2TTCgx5uYOaQ6oflebEeoJEu/pub?gid=1282782273&single=true&output=csv";

export function isSheetConfigured(url) {
  return typeof url === "string" && !url.startsWith("REPLACE_WITH_");
}

// Expected columns for the 買取表 (buyback price list) sheet tab.
// category:    ジャンル (src/data/categories.js のkeyと合わせる。例: pokemon / yugioh / onepiece)
// card_name:   検索対象になる商品名
// image_url:   商品写真のURL、任意(空欄ならプレースホルダー表示)
// condition:   状態・鑑定情報の表示文言
// price:       表示用の価格文字列 (例: "¥98,000")
// diff:        前回比の表示文言、任意 (例: "▲2,000")
// graded:      "true" なら鑑定品スラブ表示、それ以外はRETROタグ表示
// grade_label: gradedがtrueのときのラベル (例: "GRADED · 10")
// highlight:   "true" なら「注目の高額買取」セクションにも表示
export const KAITORIHYO_COLUMNS = [
  "category",
  "card_name",
  "image_url",
  "condition",
  "price",
  "diff",
  "graded",
  "grade_label",
  "highlight",
];

// Expected columns for the 在庫 (bank-transfer sale items) sheet tab.
// id, category, name, condition, price, image_url, status, description
export const ZAIKO_COLUMNS = [
  "id",
  "category",
  "name",
  "condition",
  "price",
  "image_url",
  "status",
  "description",
];

// Expected columns for the 買取実績 (past buyback results) sheet tab.
// 買取金額は掲載しない方針のため price 列は持たない。
// date:      買取日の表示文言 (例: "2026.08.01")
// category:  ジャンル。他タブと同じ (pokemon / yugioh / onepiece)
// item_name: 商品名
// image_url: 商品写真のURL、任意(空欄ならプレースホルダー表示)
// comment:   一言コメント、任意 (例: "状態良好で高額査定になりました")
export const JISSEKI_COLUMNS = [
  "date",
  "category",
  "item_name",
  "image_url",
  "comment",
];
