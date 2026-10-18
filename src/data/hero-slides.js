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
  { type: "image", image: "/images/promo-pokemon-carddass.jpg", alt: "買取UPキャンペーン。ポケモンカードダス・ワンピース・週刊少年ジャンプ系カード(NARUTO・ドラゴンボール・ハンター×ハンターなど)が対象。ポケモンカードダスはXYまで20%アップ(上限3万円)、ジャンプ系は10%アップ(上限3万円)。" },
  { type: "image", image: "/images/promo-nintendo-carddass.jpg", alt: "ニンテンドーカードダスの買取始めました。値段は相場等を確認してつけさせていただきます。" },
  { type: "cards", cards: ["", "", ""] },
  { type: "cards", cards: ["", "", ""] },
  { type: "cards", cards: ["", "", ""] },
];
