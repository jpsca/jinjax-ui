/**
 * JinjaX-UI - Time ago
 * @author Juan-Pablo Scaletti https://github.com/jpsca
 * MIT license
 */

import { Controller } from "./stimulus.js";

export class TimeAgoController extends Controller {
  connect() {
    const datetime = this.element.getAttribute("datetime");
    const date = new Date(datetime);
    const lang = this.element.getAttribute("lang")
      || document.body.getAttribute("lang")
      || navigator.language;
    const nowAttr = this.element.getAttribute("data-now");
    let now;
    if (nowAttr) {
      now = Date.parse(nowAttr);
      now = isNaN(now) ? 0 : now;
    } else {
      now = 0
    }

    this.element.textContent = getRelativeTimeString(date, lang, now);
  }
}
window.Stimulus.register("ui--time-ago", TimeAgoController);


/**
 * Convert a date to a relative time string, such as
 * "a minute ago", "in 2 hours", "yesterday", "3 months ago", etc.
 * using Intl.RelativeTimeFormat
 *
 * @param {Date | number} date - The date or time to be converted
 * @param {string} [lang=navigator.language] - The language to be used for formatting
 * @param {int} [now=Date.now()] - The language to be used for formatting
 * @returns {string} The relative time string
 *
 * (Note: Leap years, leap seconds, February, etc. are completely irrelevant here
 *  due to the coarse nature of the relative time format)
 */
function getRelativeTimeString(date, lang=navigator.language, now=0) {
  lang = Intl.RelativeTimeFormat.supportedLocalesOf(lang.split(/\s*,\s*/))[0] || navigator.language;
  now = now || Date.now();

  // Allow dates or times to be passed
  const timeMs = typeof date === "number" ? date : date.getTime();

  // Get the amount of seconds between the given date and now
  const deltaSeconds = Math.round((timeMs - now) / 1000);

  // Array representing one minute, hour, day, week, month, etc in seconds
  const cutoffs = [60, 3600, 86400, 86400 * 7, 86400 * 30, 86400 * 365, Infinity];

  // Array equivalent to the above but in the string representation of the units
  const units = ["second", "minute", "hour", "day", "week", "month", "year"];

  // Grab the ideal cutoff unit
  const unitIndex = cutoffs.findIndex(cutoff => cutoff > Math.abs(deltaSeconds));

  // Get the divisor to divide from the seconds. E.g. if our unit is "day" our divisor
  // is one day in seconds, so we can divide our seconds by this to get the # of days
  const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1;

  // Intl.RelativeTimeFormat do its magic
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });
  return rtf.format(Math.floor(deltaSeconds / divisor), units[unitIndex]);
}
