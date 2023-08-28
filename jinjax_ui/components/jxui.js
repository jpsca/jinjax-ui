(function(window){

// Public interface
window.jxui = {
  on: on,
  off: off,
}

const routes = {};
const events = new Set();

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
