/**
 * JinjaX-UI - Menus
 * @author Juan-Pablo Scaletti https://github.com/jpsca
 * MIT license
 */
import { on } from "./jxui.js";

const SEL_BUTTON = "ui-menubutton";
const SEL_MENU = ".ui-menu";
const SEL_ITEM = ".ui-menu-item"
const SEL_ITEM_ENABLED = `${SEL_ITEM}:not(.ui-disabled)`;

const KEY_ARROW_DOWN = "ArrowDown";
const KEY_ARROW_UP = "ArrowUp";
const KEYS = [KEY_ARROW_UP, KEY_ARROW_DOWN];

on("keydown", SEL_BUTTON, handleMenuButtonKeyDown);
on("keydown", SEL_MENU, handleMenuKeyDown);
on("beforetoggle", SEL_MENU, handleToggleMenu);
on("click", SEL_ITEM, handleItemClick);
on("mouseover", SEL_ITEM_ENABLED, handleItemMouseOver, 0);
on("mouseleave", SEL_MENU, handleMenuMouseLeave, 0);

function handleMenuButtonKeyDown(event, button) {
  if (!KEYS.includes(event.key)) return;

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

  if (!menu.is(":popover-open")) {
    menu.showPopover();
  }
}

function handleMenuKeyDown(event, menu) {
  if (!KEYS.includes(event.key)) return;

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

function handleToggleMenu(event, popover) {
  if (event.newState === "open") {
    selectNextItem(menu);
  } else {
    if (menu.selectedItem) {
      menu.selectedItem.blur();
    }
    menu.selectedItem = null;
  }
}

function handleItemClick(event, item) {
  const menu = item.closest(SEL_MENU);
  menu.hidePopover();
}

function handleMenuMouseLeave(event, menu) {
  if (menu.selectedItem) {
    menu.selectedItem.blur();
  }
  menu.selectedItem = null;
}

function handleItemMouseOver(event, item) {
  const menu = item.closest(SEL_MENU);
  if (menu.select === item){ return;}
  selectItem(menu, item)
}

export function selectNextItem(menu) {
  const items = Array.from(menu.querySelectorAll(SEL_ITEM_ENABLED))
  const numItems = items.length;
  if (!numItems) { return; }

  if (!menu.selectedItem) {
    menu.selectedItem = items[0];
    items[0].focus();
    return;
  }

  const index = items.indexOf(menu.selectedItem);
  if (index > -1 && index + 1 < numItems) {
    menu.selectedItem = items[index + 1];
    items[index + 1].focus();
  } else {
    menu.selectedItem = items[0];
    items[0].focus();
  }
}

export function selectPrevItem(menu) {
  const items = Array.from(menu.querySelectorAll(SEL_ITEM_ENABLED))
  const numItems = items.length;
  if (!numItems) { return; }

  if (!menu.selectedItem) {
    menu.selectedItem = items[numItems - 1];
    items[numItems - 1].focus();
    return;
  }

  const index = items.indexOf(menu.selectedItem);
  if (index - 1 >= 0) {
    menu.selectedItem = items[index - 1];
    items[index - 1].focus();
  } else {
    menu.selectedItem = items[numItems - 1];
    items[numItems - 1].focus();
  }
}

export function selectItem(menu, item) {
  item.focus();
  menu.selectedItem = item;
}
