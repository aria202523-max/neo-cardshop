import { csvToObjects } from "./csv-parse.js";

// Fetches a Google Sheet tab published to the web as CSV and returns row objects.
// Appends a cache-busting param since Google's publish cache + the browser cache
// can otherwise make staff edits feel like they "didn't save".
export async function fetchSheetRows(csvUrl) {
  const url = csvUrl + (csvUrl.includes("?") ? "&" : "?") + "_=" + Date.now();
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`スプレッドシートの取得に失敗しました (HTTP ${res.status})`);
  }
  const text = await res.text();
  return csvToObjects(text);
}
