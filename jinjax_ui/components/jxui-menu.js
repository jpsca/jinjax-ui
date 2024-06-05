/**
 * JinjaX-UI - Menus
 * @author Juan-Pablo Scaletti https://github.com/jpsca
 * MIT license
 */
import { on } from "./jxui.js";

const CLASS_OPEN = "ui-open";
const CLASS_OPENED = "ui-opened";
const CLASS_DISABLED = "ui-disabled";

const SEL_MENU = ".ui-menu";
const SEL_MENU_OPEN = `${SEL_MENU}.${CLASS_OPEN}`;
const SEL_ITEM = ".ui-menu-item"
const SEL_ITEM_ENABLED = `${SEL_ITEM}:not(.${CLASS_DISABLED})`;

const KEY_ARROW_DOWN = "ArrowDown";
const KEY_ARROW_UP = "ArrowUp";
const KEYS = [
  KEY_SPACE,
  KEY_ENTER,
  KEY_ARROW_UP,
  KEY_ARROW_DOWN,
];

on("keydown", SEL_MENU, handleMenuKeyDown);
on("click", SEL_ITEM, handleItemClick);
on("mouseover", SEL_ITEM_ENABLED, handleItemMouseOver, 0);
on("mouseleave", SEL_MENU, handleMenuMouseLeave, 0);

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

function closeMenu(menu) {

}

export function menuIsOpen(menu) {
  return menu.classList.contains(CLASS_OPEN);
}

export function menuIsClosed(menu) {
  return !menuIsOpen(menu);
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
