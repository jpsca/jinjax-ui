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
const CLASS_DISABLED = "ui-disabled";
const CLASS_SELECTED = "ui-selected";

const SEL_BODY= "body";
const SEL_BUTTON = `[${ATTR_TARGET}]`;
const SEL_MENU = ".ui-menu";
const SEL_MENU_OPEN = `${SEL_MENU}.${CLASS_OPEN}`;
const SEL_ITEM = ".ui-menu-item"
const SEL_ITEM_ENABLED = `${SEL_ITEM}:not(.${CLASS_DISABLED})`;
const SEL_ITEM_SELECTED = `${SEL_ITEM}.${CLASS_SELECTED}`;
const SEL_ITEM_ENABLED_NOT_SELECTED = `${SEL_ITEM_ENABLED}:not(${SEL_ITEM_SELECTED})`;

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
on("mousedown", SEL_MENU, stopEvent);
on("keydown", SEL_BODY, closeAllOnEsc);
on("keydown", SEL_BUTTON, handleKeyDown);
on("focusout", SEL_BUTTON, handleButtonBlur);
on("click", SEL_ITEM, handleItemClick);
on("mouseover", SEL_ITEM_ENABLED_NOT_SELECTED, handleItemMouseOver, 0);
on("mouseleave", SEL_ITEM_SELECTED, handleItemMouseLeave, 0);
on("mouseleave", SEL_MENU, handleMenuMouseLeave, 0);

function handleClickOnButton(event, button) {
  stopEvent(event)
  const target = button.getAttribute(ATTR_TARGET);
  const menu = document.getElementById(target);
  toggleMenu(menu);
  button.focus()
}

export function openMenu(menu, selectedItem) {
  menu.classList.add(CLASS_OPEN);
  if (!selectedItem) {
    selectedItem = menu.querySelector(SEL_ITEM_ENABLED);
  }
  if (selectedItem) {
    selectItem(menu, selectedItem);
  }

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
  menu.querySelectorAll(SEL_ITEM_SELECTED).forEach(function(item){
    item.classList.remove(CLASS_SELECTED);
  });
  menu.selected = null;

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
  if (menuIsOpen(menu)) {
    closeMenu(menu);
  } else {
    openMenu(menu);
  }
}

export function menuIsOpen(menu) {
  return menu.classList.contains(CLASS_OPEN);
}

export function menuIsClosed(menu) {
  return !menuIsOpen(menu);
}

function selectItem(menu, item) {
  item.classList.add(CLASS_SELECTED);
  if (menu.selected && menu.selected !== item) {
    menu.selected.classList.remove(CLASS_SELECTED);
  }
  menu.selected = item;
}

function stopEvent(event) {
  event.stopPropagation();
  event.preventDefault();
  return false;
}

function handleItemClick(event, item) {
  const menu = item.closest(SEL_MENU);
  closeMenu(menu);
}

function closeAll() {
  document
    .querySelectorAll(SEL_MENU_OPEN)
    .forEach(function(menu){
      closeMenu(menu);
    });
}

function closeAllOnEsc(event) {
  if (event.key !== KEY_ESC) { return; }
  closeAll();
}

function selectNextItem(menu) {
  const items = Array.from(menu.querySelectorAll(SEL_ITEM_ENABLED))
  const numItems = items.length;
  if (!numItems) { return; }

  if (menuIsClosed(menu)) {
    openMenu(menu);
    return;
  }

  const selected = menu.querySelector(SEL_ITEM_SELECTED)
  if (!selected) {
    items[0].classList.add(CLASS_SELECTED);
    menu.selected = items[0];
    return;
  }

  selected.classList.remove(CLASS_SELECTED);
  const index = items.indexOf(selected);
  if (index > -1 && index + 1 < numItems) {
    items[index + 1].classList.add(CLASS_SELECTED);
    menu.selected = items[index + 1];
  } else {
    items[0].classList.add(CLASS_SELECTED);
    menu.selected = items[0];
  }
}

function selectPrevItem(menu) {
  const items = Array.from(menu.querySelectorAll(SEL_ITEM_ENABLED))
  const numItems = items.length;
  if (!numItems) { return; }

  if (menuIsClosed(menu)) {
    openMenu(menu, items[numItems - 1]);
    return
  }

  const selected = menu.querySelector(SEL_ITEM_SELECTED)
  if (!selected) {
    items[numItems - 1].classList.add(CLASS_SELECTED);
    menu.selected = items[numItems - 1];
    return;
  }

  selected.classList.remove(CLASS_SELECTED);
  const index = items.indexOf(selected);
  if (index - 1 >= 0) {
    items[index - 1].classList.add(CLASS_SELECTED);
    menu.selected = items[index - 1];
  } else {
    items[numItems - 1].classList.add(CLASS_SELECTED);
    menu.selected = items[numItems - 1];
  }
}

function handleKeyDown(event, button) {
  if (!KEYS.includes(event.key)) return;

  const target = button.getAttribute(ATTR_TARGET);
  const menu = document.getElementById(target);

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

function handleButtonBlur(event, button) {
  const target = button.getAttribute(ATTR_TARGET);
  const menu = document.getElementById(target);
  if (menuIsOpen(menu)) {
    closeMenu(menu);
  }
}

function handleItemMouseOver(event, item) {
  const menu = item.closest(SEL_MENU);
  selectItem(menu, item)
}

function handleItemMouseLeave(event, item) {
  item.classList.remove(CLASS_SELECTED)
  if (menu.selected === item) {
    menu.selected = null;
  }
}

function handleMenuMouseLeave(event, menu) {
  menu.querySelectorAll(SEL_ITEM_SELECTED).forEach(function(item){
    item.classList.remove(CLASS_SELECTED);
  });
  menu.selected = null;
}
