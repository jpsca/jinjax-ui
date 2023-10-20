/**
 * JinjaX-UI - Menu component
 * @author Juan-Pablo Scaletti https://github.com/jpsca
 * MIT license
 */
import { on } from "./jxui.js";

const ATTR_TARGET = "data-menu-target";
const ATTR_CLOSE_DELAY = "data-close-delay";
const ATTR_ARIA_EXPANDED = "aria-expanded";
const CLASS_OPEN = "ui-open";
const CLASS_OPENED = "ui-opened";
const SEL_BODY= "body";
const SEL_BUTTON = `[${ATTR_TARGET}]`;
const SEL_MENU = '.ui-menu'
const SEL_MENU_OPEN = `${SEL_MENU}.${CLASS_OPEN}`;

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

export function openMenu(menu) {
  menu.classList.add(CLASS_OPEN);
  setTimeout(function(){
    menu.classList.add(CLASS_OPENED);
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
  menu.classList.remove(CLASS_OPENED);
  setTimeout(function(){
    menu.classList.remove(CLASS_OPEN);
  }, delay)

  document
    .querySelectorAll(`[${ATTR_TARGET}="${menu.id}"]`)
    .forEach(function(button){
      button.removeAttribute(ATTR_ARIA_EXPANDED);
    });
}

export function toggleMenu(menu) {
  if (menu.classList.contains(CLASS_OPEN)) {
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
