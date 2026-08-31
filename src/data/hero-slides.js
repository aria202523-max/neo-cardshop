// TOPページのヒーローバナーで切り替わるスライド。2種類のタイプがある。
//
// { type: "cards", cards: [カードA, 中央カードB, カードC] }
//   → 見出しテキスト+右側3枚のカード写真の通常レイアウト。
//     各カードのURLが空文字なら、写真なしの枠だけのプレースホルダー表示になる。
//
// { type: "image", image: "/images/xxx.jpg", alt: "説明文" }
//   → テキストは出さず、1枚の完成した画像(キャンペーンバナーなど)をそのまま表示する。
export const HERO_SLIDES = [
  { type: "cards", cards: ["", "", ""] },
  { type: "image", image: "/images/promo-jump-campaign.jpg", alt: "少年ジャンプ系レトロカード買取強化キャンペーン。対象カードの買取価格を10%アップ。NARUTO・ワンピース・ドラゴンボール・ハンター×ハンターのカードを高価買取。" },
  { type: "cards", cards: ["", "", ""] },
  { type: "cards", cards: ["", "", ""] },
  { type: "cards", cards: ["", "", ""] },
];
