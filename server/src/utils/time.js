import moment from "moment-timezone";
// Use Jerusalem timezone for all time calculations
export const JERUSALEM_TZ = "Asia/Jerusalem";

export function formatJerusalemOffsetIsoNow(date = new Date()) {
  return moment(date).tz(JERUSALEM_TZ).format();
}
