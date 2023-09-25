import { on } from "./jxui.js";

const ATTR_TARGET = "data-pop-target";
const ATTR_ACTION = "data-pop-action";
const ATTR_CLOSE_DELAY = "data-ui-close-delay";
const ATTR_OPEN = "data-ui-open";
const ATTR_OPENED = "data-ui-opened";
const ATTR_ARIA_EXPANDED = "aria-expanded";

const SEL_BODY= "body";
const SEL_BUTTON = `[${ATTR_TARGET}]`;
const SEL_POP_AUTO = '[data-pop="auto"]'
const SEL_POP_AUTO_OPEN = `${SEL_POP_AUTO}[${ATTR_OPEN}]`;

const ESC_KEY = "Escape";

const ACTION_OPEN = "open";
const ACTION_CLOSE = "close";
const ACTION_TOGGLE = "toggle";
const ACTIONS = [ACTION_OPEN, ACTION_CLOSE, ACTION_TOGGLE];

on("click", SEL_BUTTON, handleClickOnButton);
on("click", SEL_POP_AUTO, stopEvent);
on("click", SEL_BODY, closeAll);
on("keydown", SEL_BODY, closeAllOnKey);

function handleClickOnButton(event, button) {
  stopEvent(event)
  const action = button.getAttribute(ATTR_ACTION) || ACTION_TOGGLE;
  if (!ACTIONS.includes(action)) {
    console.error("Invalid action", action);
    return;
  }
  const target = button.getAttribute(ATTR_TARGET);
  const pop = document.getElementById(target);
  switch (action) {
    case ACTION_OPEN:
      openPop(pop);
      break;
    case ACTION_CLOSE:
      closePop(pop);
      break;
    case ACTION_TOGGLE:
      togglePop(pop);
      break;
  }
}

export function openPop(pop) {
  pop.setAttribute(ATTR_OPEN, "true");
  setTimeout(function(){
    pop.setAttribute(ATTR_OPENED, "true");
  }, 0)

  document
    .querySelectorAll(`[${ATTR_TARGET}="${pop.id}"]`)
    .forEach(function(button){
      button.setAttribute(ATTR_ARIA_EXPANDED, "true");
    });
}

export function closePop(pop) {
  const delay = +(pop.getAttribute(ATTR_CLOSE_DELAY) || "0");
  if (isNaN(delay)) {
    console.error("Invalid delay", delay);
    return;
  }
  pop.removeAttribute(ATTR_OPENED);
  setTimeout(function(){
    pop.removeAttribute(ATTR_OPEN);
  }, delay)

  document
    .querySelectorAll(`[${ATTR_TARGET}="${pop.id}"]`)
    .forEach(function(button){
      button.removeAttribute(ATTR_ARIA_EXPANDED);
    });
}

export function togglePop(pop) {
  if (pop.hasAttribute(ATTR_OPEN)) {
    closePop(pop);
  } else {
    openPop(pop);
  }
}

function stopEvent(event) {
  event.stopPropagation();
  event.preventDefault();
  return false;
}

function closeAll() {
  document
    .querySelectorAll(SEL_POP_AUTO_OPEN)
    .forEach(function(pop){
      closePop(pop);
    });
}

function closeAllOnKey(event) {
  if (event.key !== ESC_KEY) { return; }
  closeAll();
}
