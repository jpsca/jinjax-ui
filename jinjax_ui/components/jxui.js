/**
 * Extends the Event prototype to track whether propagation has been stopped.
 * @function
 * @name Event.prototype.stopPropagation
*/
const originalStopPropagation = Event.prototype.stopPropagation;
Event.prototype.stopPropagation = function() {
    this.propagationStopped = true;
    originalStopPropagation.apply(this, arguments);
};

/**
 * Extends the Event prototype to track whether immediate propagation has been stopped.
 * @function
 * @name Event.prototype.stopImmediatePropagation
 */
const originalStopImmediatePropagation = Event.prototype.stopImmediatePropagation;
Event.prototype.stopImmediatePropagation = function() {
    this.inmediatePropagationStopped = true;
    originalStopImmediatePropagation.apply(this, arguments);
};

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
 * @property {EventRoute} routes - A hash of routes for the event.
 */

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

  const selectors = Object.keys(route);
  let target = event.target;

  while (target && !event.propagationStopped && !event.inmediatePropagationStopped) {
    // More than one selector could match the element, so we
    // need to check all of them everytime.
    for (let selector of selectors) {
      if (!target.matches(selector)) {
        continue;
      }
      const callbacks = route[selector];
      for (let callback of callbacks) {
        callback(event, target);
        if (event.inmediatePropagationStopped) {
          break;
        }
      }

      // Stopping inmediate propagation also prevent
      // the event to be handled by other selectors.
      if (event.inmediatePropagationStopped) {
        break;
      }
    }

    target = target.parentElement;
  };
}
