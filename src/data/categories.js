export const CATEGORIES = [
  { key: "pokemon", label: "ポケモンカード" },
  { key: "onepiece", label: "ワンピースカードゲーム" },
];

export function categoryLabel(key) {
  return CATEGORIES.find((c) => c.key === key)?.label ?? key;
}
