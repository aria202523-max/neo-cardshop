export const CATEGORIES = [
  { key: "pokemon", label: "ポケモンカード" },
  { key: "yugioh", label: "遊戯王" },
  { key: "onepiece", label: "ワンピースカードゲーム" },
];

export function categoryLabel(key) {
  return CATEGORIES.find((c) => c.key === key)?.label ?? key;
}
