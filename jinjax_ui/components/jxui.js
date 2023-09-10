(function(window){

/**
 * @typedef {function(Event, Element): void} EventCallback
 */

/**
 * @typedef {Object} EventRoute
 * @property {string} selector - The CSS selector to match elements.
 * @property {EventCallback} callback - The callback function to execute when the event is triggered.
 */

/**
 * @typedef {Object} EventRoutes
 * @property {string} evname - The name of the event.
 * @property {EventRoute[]} routes - An array of event routes.
 */

/**
 * @namespace
 * @property {function(string, string, EventCallback): void} on - Adds an event listener with a selector.
 * @property {function(string, string): void} off - Removes an event listener with a selector.
 */
window.jxui = {
  on: on,
  off: off,
}

/**
 * @type {EventRoutes}
 */
const routes = {};

/**
 * @type {Set<string>}
 */
const events = new Set();

/**
 * Adds an event listener with a selector.
 * @public
 * @param {string} evname - The name of the event.
 * @param {string} selector - The CSS selector to match elements.
 * @param {EventCallback} callback - The callback function to execute when the event is triggered.
 */
function on(evname, selector, callback) {
  if (!routes[evname]) {
    routes[evname] = [];
  }
  routes[evname].push({selector, callback});

  if (!events.has(evname)) {
    events.add(evname);
    document.addEventListener(evname, handleEvent, true);
  }
}

/**
 * Removes an event listener with a selector.
 * @public
 * @param {string} evname - The name of the event.
 * @param {string} selector - The CSS selector to match elements.
 */
function off(evname, selector) {
  if (!routes[evname]) {
    return;
  }
  routes[evname] = routes[evname].filter(route => route.selector !== selector);
  if (routes[evname].length === 0) {
    events.delete(evname);
    document.removeEventListener(evname, handleEvent);
  }
}

/**
 * Handles the event and calls the associated callback function for matching elements.
 * @param {Event} event - The event object.
 */
function handleEvent(event) {
  const {type, target} = event;
  const routesForEvent = routes[type];
  if (!routesForEvent) {
    return;
  }
  routesForEvent.forEach(route => {
    const {selector, callback} = route;
    const realTarget = target.closest(selector);
    if (realTarget) {
      callback(event, realTarget);
    }
  });
}

})(window)
