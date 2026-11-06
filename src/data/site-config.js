// Site-wide constants that aren't tied to the Google Sheets data.
//
// LINE_URL: the shop's LINE公式アカウント friend-add link (e.g. https://lin.ee/xxxxxxx).
// Replace once the account is created; every place that links to LINE reads from here.
export const LINE_URL = "https://lin.ee/Yx5F7pH";

export function isLineConfigured() {
  return typeof LINE_URL === "string" && !LINE_URL.startsWith("REPLACE_WITH_");
}

// WEB3FORMS_ACCESS_KEY: powers the 在庫 (zaiko) order form's email delivery via
// https://web3forms.com (no backend needed). Get a free key at web3forms.com by
// entering the shop's email, then paste the key here, replacing the placeholder.
export const WEB3FORMS_ACCESS_KEY = "REPLACE_WITH_WEB3FORMS_ACCESS_KEY";

export function isWeb3FormsConfigured() {
  return typeof WEB3FORMS_ACCESS_KEY === "string" && !WEB3FORMS_ACCESS_KEY.startsWith("REPLACE_WITH_");
}
