/**
 * JinjaX-UI - Menus
 * @author Juan-Pablo Scaletti https://github.com/jpsca
 * MIT license
 */
import { on } from "./jxui.js";

const CLASS_SELECTED = "ui-selected";
const CLASS_DISABLED = "ui-disabled";

const SEL_BUTTON = ".ui-menubutton";
const SEL_MENU = ".ui-menu";
const SEL_ITEM = ".ui-menuitem"
const SEL_ITEM_ENABLED = `${SEL_ITEM}:not(.${CLASS_DISABLED})`;

const KEY_ARROW_DOWN = "ArrowDown";
const KEY_ARROW_UP = "ArrowUp";
const KEYS = [KEY_ARROW_UP, KEY_ARROW_DOWN];

on("toggle", SEL_MENU, handleToggle);
on("keydown", SEL_BUTTON, handleButtonKeyDown);
on("keydown", SEL_MENU, handleMenuKeyDown);
on("mouseover", SEL_ITEM_ENABLED, handleItemMouseOver, 0);

function handleToggle(event, menu) {
  if (event.newState === "open") {
    if (!menu.selectedItem) {
      selectNextItem(menu);
    }
  } else {
    clearSelection(menu);
  }
}

function handleButtonKeyDown(event, button) {
  if (!KEYS.includes(event.key)) { return; }

  const menuId = button.getAttribute("popovertarget");
  const menu = document.getElementById(menuId);

  switch (event.key) {
    case KEY_ARROW_DOWN:
      event.preventDefault()
      event.stopPropagation();
      selectNextItem(menu);
      break;

    case KEY_ARROW_UP:
      event.preventDefault()
      event.stopPropagation();
      selectPrevItem(menu);
      break;
  }

  if (!menu.matches(":popover-open")) {
    menu.showPopover();
  }
}

function handleMenuKeyDown(event, menu) {
  if (!KEYS.includes(event.key)) { return };

  switch (event.key) {
    case KEY_ARROW_DOWN:
      event.preventDefault()
      event.stopPropagation();
      selectNextItem(menu);
      break;

    case KEY_ARROW_UP:
      event.preventDefault()
      event.stopPropagation();
      selectPrevItem(menu);
      break;
  }
}

function handleItemMouseOver(event, item) {
  const menu = item.closest(SEL_MENU);
  selectItem(menu, item)
}

// ------------------------------------------------------------

export function clearSelection(menu) {
  if (menu.selectedItem) {
    menu.selectedItem.classList.remove(CLASS_SELECTED);
    menu.selectedItem = null;
  }
}

export function selectItem(menu, item) {
  if (menu.selectedItem === item){ return; }
  clearSelection(menu);
  item.classList.add(CLASS_SELECTED);
  menu.selectedItem = item;
}

export function selectNextItem(menu) {
  const items = Array.from(menu.querySelectorAll(SEL_ITEM_ENABLED))
  const numItems = items.length;
  if (!numItems) { return; }

  if (!menu.selectedItem) {
    selectItem(menu, items[0]);
    return;
  }

  const index = items.indexOf(menu.selectedItem);
  if (index > -1 && index + 1 < numItems) {
    selectItem(menu, items[index + 1]);
  } else {
    selectItem(menu, items[0]);
  }
}

export function selectPrevItem(menu) {
  const items = Array.from(menu.querySelectorAll(SEL_ITEM_ENABLED))
  const numItems = items.length;
  if (!numItems) { return; }

  if (!menu.selectedItem) {
    selectItem(menu, items[numItems - 1]);
    return;
  }

  const index = items.indexOf(menu.selectedItem);
  if (index - 1 >= 0) {
    selectItem(menu, items[index - 1]);
  } else {
    selectItem(menu, items[numItems - 1]);
  }
}
