// Site-wide constants that aren't tied to the Google Sheets data.
//
// LINE_URL: the shop's LINE公式アカウント friend-add link (e.g. https://lin.ee/xxxxxxx).
// Replace once the account is created; every place that links to LINE reads from here.
export const LINE_URL = "REPLACE_WITH_LINE_URL";

export function isLineConfigured() {
  return typeof LINE_URL === "string" && !LINE_URL.startsWith("REPLACE_WITH_");
}
