/**
 * JinjaX-UI - Relative date component
 * @author Juan-Pablo Scaletti https://github.com/jpsca
 * MIT license
 */

/**
 * Convert a date to a relative time string, such as
 * "a minute ago", "in 2 hours", "yesterday", "3 months ago", etc.
 * using Intl.RelativeTimeFormat
 *
 * @param {Date | number} date - The date or time to be converted
 * @param {string} [lang=navigator.language] - The language to be used for formatting
 * @returns {string} The relative time string
 *
 * (Note: Leap years, leap seconds, February, etc. are completely irrelevant here
 *  due to the coarse nature of the relative time format)
 */
export function getRelativeTimeString(date, lang = navigator.language) {
  // Allow dates or times to be passed
  const timeMs = typeof date === "number" ? date : date.getTime();

  // Get the amount of seconds between the given date and now
  const deltaSeconds = Math.round((timeMs - Date.now()) / 1000);

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

/**
 * Takes a <time> node and sets its content to a relative time string
 *
 * @param {HTMLElement} timeNode - The <time> node to be processed
 */
export function processTimeNode(timeNode) {
  const lang = document.body.getAttribute("lang") || "en";
  const datetime = timeNode.getAttribute("datetime");
  const date = new Date(datetime);
  timeNode.textContent = getRelativeTimeString(date, lang);
}

/**
 * Sets up a MutationObserver to detect when a new <time data-relative> tag has been inserted into the page,
 * and calls processTimeNode for it.
 */
export function observeTimeNodes() {
  // Create a new observer
  const observer = new MutationObserver((mutationsList) => {
    // Look through all mutations that just occured
    for(let mutation of mutationsList) {
      // If the addedNodes property has one or more nodes
      if(mutation.addedNodes.length) {
        mutation.addedNodes.forEach((node) => {
          // Check if the added node is a "time[data-relative]" element
          if(node.matches && node.matches("time[data-relative]")) {
            // If so, process it
            processTimeNode(node);
          }
        });
      }
    }
  });

  // Start observing the document with the configured parameters
  observer.observe(document, { childList: true, subtree: true });
}

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("time[data-relative]").forEach(processTimeNode);
  observeTimeNodes();
});

htmx.onLoad(function(content) {
  content.querySelectorAll("time[data-relative]").forEach(processTimeNode);
});
