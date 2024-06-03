/**
 * JinjaX-UI - Menus
 * @author Juan-Pablo Scaletti https://github.com/jpsca
 * MIT license
 */
import { on } from "./jxui.js";

const ATTR_TARGET = "data-menu-target";
const ATTR_CLOSE_DELAY = "data-close-delay";
const ATTR_ARIA_EXPANDED = "aria-expanded";

const CLASS_OPEN = "ui-open";
const CLASS_OPENED = "ui-opened";
const CLASS_DISABLED = "ui-disabled";

const SEL_BODY= "body";
const SEL_BUTTON = `[${ATTR_TARGET}]`;
const SEL_MENU = ".ui-menu";
const SEL_MENU_OPEN = `${SEL_MENU}.${CLASS_OPEN}`;
const SEL_ITEM = ".ui-menu-item"
const SEL_ITEM_ENABLED = `${SEL_ITEM}:not(.${CLASS_DISABLED})`;

const KEY_ESC = "Escape";
const KEY_SPACE = " ";
const KEY_ENTER = "Enter";
const KEY_ARROW_DOWN = "ArrowDown";
const KEY_ARROW_UP = "ArrowUp";
const KEYS = [
  KEY_SPACE,
  KEY_ENTER,
  KEY_ARROW_UP,
  KEY_ARROW_DOWN,
];

on("click", SEL_BUTTON, handleClickOnButton);
on("keydown", SEL_BUTTON, handleButtonKeyDown);
on("keydown", SEL_MENU, handleMenuKeyDown);

on("click", SEL_ITEM, handleItemClick);
on("mouseover", SEL_ITEM_ENABLED, handleItemMouseOver, 0);
on("mouseleave", SEL_MENU, handleMenuMouseLeave, 0);

on("keydown", SEL_BODY, closeAllOnEsc);
on("mousedown", SEL_BODY, closeAll);
on("mousedown", SEL_MENU, stopEvent);

function handleClickOnButton(event, button) {
  stopEvent(event)
  const target = button.getAttribute(ATTR_TARGET);
  const menu = document.getElementById(target);
  menu.openedBy = button;
  toggleMenu(menu);
}

function handleButtonKeyDown(event, button) {
  if (!KEYS.includes(event.key)) return;

  const target = button.getAttribute(ATTR_TARGET);
  const menu = document.getElementById(target);
  menu.openedBy = button;

  switch (event.key) {
    case KEY_SPACE:
    case KEY_ENTER:
      event.preventDefault()
      toggleMenu(menu);
      return;

    case KEY_ARROW_DOWN:
      event.preventDefault()
      event.stopPropagation();
      selectNextItem(menu);
      return;

    case KEY_ARROW_UP:
      event.preventDefault()
      event.stopPropagation();
      selectPrevItem(menu);
      return;
  }
}

function handleMenuKeyDown(event, menu) {
  if (!KEYS.includes(event.key)) return;

  switch (event.key) {
    case KEY_SPACE:
    case KEY_ENTER:
      event.preventDefault()
      event.stopPropagation();
      if (menu.selected) {
        menu.selected.click();
      }
      return;
    case KEY_ARROW_DOWN:
      event.preventDefault()
      event.stopPropagation();
      selectNextItem(menu);
      return;

    case KEY_ARROW_UP:
      event.preventDefault()
      event.stopPropagation();
      selectPrevItem(menu);
      return;
  }
}

function handleItemClick(event, item) {
  const menu = item.closest(SEL_MENU);
  closeMenu(menu);
}

function handleMenuMouseLeave(event, menu) {
  if (menu.selected) {
    menu.selected.blur();
  }
  menu.selected = null;
}

function handleItemMouseOver(event, item) {
  const menu = item.closest(SEL_MENU);
  if (menu.select === item){ return;}
  selectItem(menu, item)
}

function closeAllOnEsc(event) {
  if (event.key !== KEY_ESC) { return; }
  closeAll();
}

function closeAll() {
  document
    .querySelectorAll(SEL_MENU_OPEN)
    .forEach(function(menu){
      closeMenu(menu);
    });
}

function stopEvent(event) {
  event.stopPropagation();
  event.preventDefault();
  return false;
}

export function toggleMenu(menu) {
  if (menuIsOpen(menu)) {
    closeMenu(menu);
  } else {
    openMenu(menu);
  }
}

export function menuIsOpen(menu) {
  return menu.classList.contains(CLASS_OPEN);
}

export function openMenu(menu) {
  menu.classList.add(CLASS_OPEN);
  setTimeout(function(){
    menu.classList.add(CLASS_OPENED);
  }, 0)

  // Update button(s) state
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

  if (menu.openedBy) {
    menu.openedBy.focus();
  } else if (menu.selected) {
    menu.selected.blur();
  }
  menu.openedBy = null;
  menu.selected = null;

  setTimeout(function(){
    menu.classList.remove(CLASS_OPEN);
    document
      .querySelectorAll(`[${ATTR_TARGET}="${menu.id}"]`)
      .forEach(function(button){
        button.removeAttribute(ATTR_ARIA_EXPANDED);
      });
  }, delay)
}

export function selectNextItem(menu) {
  const items = Array.from(menu.querySelectorAll(SEL_ITEM_ENABLED))
  const numItems = items.length;
  if (!numItems) { return; }

  if (menuIsClosed(menu)) {
    openMenu(menu);
  }

  if (!menu.selected) {
    menu.selected = items[0];
    items[0].focus();
    return;
  }

  const index = items.indexOf(menu.selected);
  if (index > -1 && index + 1 < numItems) {
    menu.selected = items[index + 1];
    items[index + 1].focus();
  } else {
    menu.selected = items[0];
    items[0].focus();
  }
}

export function selectPrevItem(menu) {
  const items = Array.from(menu.querySelectorAll(SEL_ITEM_ENABLED))
  const numItems = items.length;
  if (!numItems) { return; }

  if (menuIsClosed(menu)) {
    openMenu(menu);
  }

  if (!menu.selected) {
    menu.selected = items[numItems - 1];
    items[numItems - 1].focus();
    return;
  }

  const index = items.indexOf(menu.selected);
  if (index - 1 >= 0) {
    menu.selected = items[index - 1];
    items[index - 1].focus();
  } else {
    menu.selected = items[numItems - 1];
    items[numItems - 1].focus();
  }
}

export function selectItem(menu, item) {
  item.focus();
  menu.selected = item;
}

export function menuIsClosed(menu) {
  return !menuIsOpen(menu);
}