/**
 * JinjaX-UI - Pop component
 * @author Juan-Pablo Scaletti https://github.com/jpsca
 * MIT license
 */
import { on } from "./jxui.js";

const ATTR_TARGET = "data-pop-target";
const ATTR_ACTION = "data-pop-action";
const ATTR_CLOSE_DELAY = "data-ui-close-delay";
const ATTR_ARIA_EXPANDED = "aria-expanded";

const CLASS_OPEN = "ui-open";
const CLASS_OPENED = "ui-opened";

const SEL_BODY= "body";
const SEL_BUTTON = `[${ATTR_TARGET}]`;
const SEL_POP_AUTO = '[data-pop="auto"]'
const SEL_POP_AUTO_OPEN = `${SEL_POP_AUTO}.${CLASS_OPEN}`;

const ESC_KEY = "Escape";

const ACTION_OPEN = "open";
const ACTION_CLOSE = "close";
const ACTION_TOGGLE = "toggle";
const ACTIONS = [ACTION_OPEN, ACTION_CLOSE, ACTION_TOGGLE];

const openEvent = new CustomEvent("ui-open");
const closeEvent = new CustomEvent("ui-close");

on("click", SEL_BUTTON, handleClickOnButton);
on("click", SEL_BODY, closeAll);
on("keydown", SEL_BODY, closeAllOnKey);

function handleClickOnButton(event, button) {
  const action = button.getAttribute(ATTR_ACTION) || ACTION_TOGGLE;
  if (!ACTIONS.includes(action)) {
    console.error("Invalid action", action);
    return;
  }
  const target = button.getAttribute(ATTR_TARGET);
  const pop = document.getElementById(target);
  if (!pop) {
    console.error("Invalid target", target);
    return;
  }
  switch (action) {
    case ACTION_OPEN:
      openPop(pop);
      button.dispatchEvent(openEvent);
      break;
    case ACTION_CLOSE:
      closePop(pop);
      button.dispatchEvent(closeEvent);
      break;
    case ACTION_TOGGLE:
      if (pop.classList.contains(CLASS_OPEN)) {
        closePop(pop);
        button.dispatchEvent(closeEvent);
      } else {
        openPop(pop);
        button.dispatchEvent(openEvent);
      }
      break;
  }
}

export function openPop(pop) {
  pop.classList.add(CLASS_OPEN);
  setTimeout(function(){
    pop.classList.add(CLASS_OPENED);
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
  pop.classList.remove(CLASS_OPEN);
  setTimeout(function(){
    pop.classList.remove(CLASS_OPENED);
  }, delay)

  document
    .querySelectorAll(`[${ATTR_TARGET}="${pop.id}"]`)
    .forEach(function(button){
      button.removeAttribute(ATTR_ARIA_EXPANDED);
    });
}

export function togglePop(pop) {
  if (pop.classList.contains(CLASS_OPEN)) {
    closePop(pop);
  } else {
    openPop(pop);
  }
}

function closeAll(event) {
  if (event.target.closest(SEL_BUTTON) || event.target.closest(SEL_POP_AUTO)) {
    return;
  }
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
