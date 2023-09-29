import { on } from "./jxui.js";

const ATTR_TARGET = "data-menu-target";
const ATTR_CLOSE_DELAY = "data-ui-close-delay";
const ATTR_OPEN = "data-ui-open";
const ATTR_OPENED = "data-ui-opened";
const ATTR_ARIA_EXPANDED = "aria-expanded";
const SEL_BODY= "body";
const SEL_BUTTON = `[${ATTR_TARGET}]`;
const SEL_MENU = '[data-menu]'
const SEL_MENU_OPEN = `${SEL_MENU}[${ATTR_OPEN}]`;

const ESC_KEY = "Escape";

on("click", SEL_BUTTON, handleClickOnButton);
on("click", SEL_MENU, stopEvent);
on("click", SEL_BODY, closeAll);
on("keydown", SEL_BODY, closeAllOnKey);

function handleClickOnButton(event, button) {
  stopEvent(event)
  const target = button.getAttribute(ATTR_TARGET);
  const menu = document.getElementById(target);
  toggleMenu(menu);
}

export function openPop(menu) {
  menu.setAttribute(ATTR_OPEN, "true");
  setTimeout(function(){
    menu.setAttribute(ATTR_OPENED, "true");
  }, 0)

  document
    .querySelectorAll(`[${ATTR_TARGET}="${menu.id}"]`)
    .forEach(function(button){
      button.setAttribute(ATTR_ARIA_EXPANDED, "true");
    });
}

export function closeMenu(menu) {
  const delay = +(menu.getAttribute(ATTR_CLOSE_DELAY) || "0");
  if (isNaN(delay)) {
    console.error("Invalid delay", delay);
    return;
  }
  menu.removeAttribute(ATTR_OPENED);
  setTimeout(function(){
    menu.removeAttribute(ATTR_OPEN);
  }, delay)

  document
    .querySelectorAll(`[${ATTR_TARGET}="${menu.id}"]`)
    .forEach(function(button){
      button.removeAttribute(ATTR_ARIA_EXPANDED);
    });
}

export function toggleMenu(menu) {
  if (menu.hasAttribute(ATTR_OPEN)) {
    closeMenu(menu);
  } else {
    openMenu(menu);
  }
}

function stopEvent(event) {
  event.stopPropagation();
  event.preventDefault();
  return false;
}

function closeAll() {
  document
    .querySelectorAll(SEL_MENU_OPEN)
    .forEach(function(menu){
      closeMenu(menu);
    });
}

function closeAllOnKey(event) {
  if (event.key !== ESC_KEY) { return; }
  closeAll();
}
