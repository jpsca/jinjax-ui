const originalStopPropagation = Event.prototype.stopPropagation;
/**
 * Extends the Event prototype to track whether propagation has been stopped.
 * @function
 * @name Event.prototype.stopPropagation
 * @memberOf Event
 */
Event.prototype.stopPropagation = function() {
    this.propagationStopped = true;
    originalStopPropagation.apply(this, arguments);
};

const originalStopImmediatePropagation = Event.prototype.stopImmediatePropagation;
/**
 * Extends the Event prototype to track whether immediate propagation has been stopped.
 * @function
 * @name Event.prototype.stopImmediatePropagation
 * @memberOf Event
 */
Event.prototype.stopImmediatePropagation = function() {
    this.immediatePropagationStopped = true;
    originalStopImmediatePropagation.apply(this, arguments);
};

/**************************************************************/

/**
 * @typedef {function(Event, Element): void} EventCallback
 */

/**
 * @typedef {Object} EventRoute
 * @property {string} selector - The CSS selector to match elements.
 * @property {EventCallback[]} callback - An array of callback functions to execute when the event is triggered.
 */

/**
 * @typedef {Object} EventRoutes
 * @property {string} type - The name of the event.
 * @property {Object.<string, EventRoute>} routes - A hash of routes for the event.
 */

/**
 * @typedef {Object} KeydownRoutes
 * @property {string} key - The name of the key.
 * @property {Object.<string, EventRoute>} routes - A hash of routes for the event.
 */

/**
 * @typedef {Object} KeyOptions
 * @property {boolean} altKey
 * @property {boolean} ctrlKey
 * @property {boolean} metaKey
 * @property {boolean} shiftKey
 */

/**
 * Dispatches an event to matching elements along with their associated callbacks.
 *
 * This function walks up the DOM tree from the event target, checking each element
 * against the specified CSS selectors in the given event route. For each matching element,
 * it calls the associated callback functions.
 *
 * @param {Event} event - The event object to dispatch.
 * @param {EventRoute} route - The event route to use.
 */
function dispatchEvent(event, route) {
  const selectors = Object.keys(route);
  let target = event.target;

  while (target && !event.propagationStopped && !event.immediatePropagationStopped) {
    // More than one selector could match the element, so we
    // need to check all of them everytime.
    for (let selector of selectors) {
      if (!target.matches(selector)) {
        continue;
      }
      const callbacks = route[selector];
      for (let callback of callbacks) {
        callback(event, target);
        if (event.immediatePropagationStopped) {
          break;
        }
      }

      // Stopping immediate propagation also prevent
      // the event to be handled by other selectors.
      if (event.immediatePropagationStopped) {
        break;
      }
    }

    target = target.parentElement;
  };
}

/**************************************************************/

/**
 * @type {EventRoutes}
*/
const routes = {};

/**
 * Adds an event listener with a selector.
 * @public
 * @param {string} type - The type of the event.
 * @param {string} selector - The CSS selector to match elements.
 * @param {EventCallback} callback - The callback function to execute when the event is triggered.
 */
export function on(type, selector, callback) {
  if (!routes[type]) {
    routes[type] = {};
    document.addEventListener(type, handleEvent, true);
  }
  if (!routes[type][selector]) {
    routes[type][selector] = [];
  }
  routes[type][selector].push(callback);
}

/**
 * Removes an event listener with a selector.
 * @public
 * @param {string} type - The name of the event.
 * @param {string} selector - The CSS selector to match elements.
 */
export function off(type, selector) {
  if (!routes[type] || !routes[type][selector]) {
    return;
  }
  delete routes[type][selector];

  if (Object.keys(routes[type]).length === 0) {
    delete routes[type]
    document.removeEventListener(type, handleEvent);
  }
}

/**
 * Handles the event and calls the associated callback function for matching elements.
 * @param {Event} event - The event object.
 */
function handleEvent(event) {
  const route = routes[event.type];
  if (!route) { return; }
  dispatchEvent(event, route);
}

/**************************************************************/

/**
 * @type {KeydownRoutes}
*/
const keydownRoutes = {};

const KEYDOWN = "keydown";

/**
 * Adds an keydown event listener with a selector.
 * @public
 * @param {string} key - The name of the key.
 * @param {string} selector - The CSS selector to match elements.
 * @param {EventCallback} callback - The callback function to execute when the event is triggered.
 * @param {KeyOptions} opts - The options to match the key.
 */
export function onKeydown(key, selector, callback, opts) {
  const hash = hashKey(key, opts || {});
  if (!keydownRoutes[hash]) {
    keydownRoutes[hash] = {};
  }
  if (!keydownRoutes[hash][selector]) {
    keydownRoutes[hash][selector] = [];
  }
  keydownRoutes[hash][selector].push(callback);
}

/**
 * Removes an keydown event listener with a selector.
 * @public
 * @param {string} key - The name of the event.
 * @param {string} selector - The CSS selector to match elements.
 * @param {KeyOptions} opts - The options to match the key.
 */
export function offKeydown(key, selector, opts) {
  const hash = hashKey(key, opts || {});
  if (!keydownRoutes[hash] || !keydownRoutes[hash][selector]) {
    return;
  }
  delete keydownRoutes[hash][selector];

  if (Object.keys(keydownRoutes[hash]).length === 0) {
    delete keydownRoutes[hash]
  }
}

/**
 * Takes a key name and options and returns a hash key.
 * @param {string} key - The name of the key.
 * @param {KeyOptions} opts - The options to match the key.
 * @returns {string} - The hash key.
 */
function hashKey(key, opts) {
  let tail = '';
  if (opts.altKey) { tail += "a"; }
  if (opts.ctrlKey) { tail += "c"; }
  if (opts.metaKey) { tail += "m"; }
  if (opts.shiftKey) { tail += "s"; }
  if (tail) {
    return `${key}:${tail}`;
  }
  return key;
}

/**
 * Handles the keydown event and calls the associated callback function for matching elements.
 * @param {KeyboardEvent} event - The keydown event object.
 */
function handleKeyDown(event) {
  const hash = hashKey(event.key, event);
  const route = keydownRoutes[hash];
  if (!route) { return; }
  dispatchEvent(event, route);
}

document.addEventListener(KEYDOWN, handleKeyDown, true);
