import { on } from "./jxui.js";

const ATTR_TARGET = "data-pop-target";
const ATTR_ACTION = "data-pop-action";
const ATTR_DELAY = "data-delay";
const ATTR_OPEN = "data-open";
const ATTR_OPENED = "data-opened";

const SEL_BODY= "body";
const SEL_BUTTON = `[${ATTR_TARGET}]`;
const SEL_POPOVER_AUTO = '[data-popover="auto"]'
const SEL_POPOVER_AUTO_OPEN = `${SEL_POPOVER_AUTO}[${ATTR_OPEN}]`;

const ESC_KEY = "Escape";

const ACTION_OPEN = "open";
const ACTION_CLOSE = "close";
const ACTION_TOGGLE = "toggle";
const ACTIONS = [ACTION_OPEN, ACTION_CLOSE, ACTION_TOGGLE];

on("click", SEL_BUTTON, handleClickOnButton);
on("click", SEL_POPOVER_AUTO, stopEvent);
on("click", SEL_BODY, closeAll);
on("keydown", SEL_BODY, closeAllOnKey);

function handleClickOnButton(event, button) {
  console.log("handleClickOnButton");
  stopEvent(event)
  const action = button.getAttribute(ATTR_ACTION) || ACTION_TOGGLE;
  if (!ACTIONS.includes(action)) {
    console.error("Invalid action", action);
    return;
  }
  const target = button.getAttribute(ATTR_TARGET);
  const panel = document.getElementById(target);
  switch (action) {
    case ACTION_OPEN:
      openPanel(panel);
      break;
    case ACTION_CLOSE:
      closePanel(panel);
      break;
    case ACTION_TOGGLE:
      togglePanel(panel);
      break;
  }
}

export function openPanel(panel) {
  console.log("openPanel", panel.id);
  panel.setAttribute(ATTR_OPEN, "true");
  setTimeout(function(){
    console.log("openPanel opened", panel.id);
    panel.setAttribute(ATTR_OPENED, "true");
  }, 0)
}

export function closePanel(panel) {
  const delay = +(panel.getAttribute(ATTR_DELAY) || "0");
  if (isNaN(delay)) {
    console.error("Invalid delay", delay);
    return;
  }
  console.log("closePanel", panel.id, delay);
  panel.removeAttribute(ATTR_OPENED);
  setTimeout(function(){
    panel.removeAttribute(ATTR_OPEN);
  }, delay)
}

export function togglePanel(panel) {
  console.log("closePanel", panel.id);
  if (panel.hasAttribute(ATTR_OPEN)) {
    closePanel(panel);
  } else {
    openPanel(panel);
  }
}

function stopEvent(event) {
  event.stopPropagation();
  event.preventDefault();
  return false;
}

function closeAll() {
  console.log("closeAll");
  document
    .querySelectorAll(SEL_POPOVER_AUTO_OPEN)
    .forEach(closePanel)
}

function closeAllOnKey(event) {
  console.log("closeAllOnKey");
  if (event.key !== ESC_KEY) { return; }
  closeAll();
}
