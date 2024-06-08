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
const SEL_OPEN_MENU = `${SEL_MENU}:popover-open`;
const SEL_CLOSED_MENU = `${SEL_MENU}:not(:popover-open)`;
const SEL_ITEM = `${SEL_OPEN_MENU} .ui-menuitem`;
const SEL_ITEMSUB = `${SEL_OPEN_MENU} .ui-menuitem-sub`;
const SEL_ITEM_ENABLED = `${SEL_ITEM}:not(.${CLASS_DISABLED})`;
const SEL_ITEMSUB_ENABLED = `${SEL_ITEMSUB}:not(.${CLASS_DISABLED})`;
const SEL_SCOPED_ITEM_ENABLED = `${SEL_ITEM_ENABLED}:not(:scope ${SEL_MENU} ${SEL_ITEM})`;
const SEL_ROOT_MENU = `${SEL_OPEN_MENU}:not(${SEL_OPEN_MENU} ${SEL_OPEN_MENU})`;

const KEY_ARROW_DOWN = "ArrowDown";
const KEY_ARROW_UP = "ArrowUp";
const KEY_ARROW_RIGHT = "ArrowRight";
const KEY_ARROW_LEFT = "ArrowLeft";
const KEY_SPACE = " ";
const KEY_ENTER = "Enter";

const KEYS = [KEY_ARROW_UP, KEY_ARROW_DOWN, KEY_ARROW_RIGHT, KEY_ARROW_LEFT, KEY_SPACE, KEY_ENTER];

on("toggle", SEL_ROOT_MENU, handleToggle);
on("keydown", SEL_BUTTON, handleButtonKeyDown);
on("keydown", SEL_OPEN_MENU, handleMenuKeyDown);
on("mouseover", SEL_ITEM_ENABLED, handleItemMouseOver, 0);
on("mouseout", SEL_ITEMSUB_ENABLED, handleSubmenuMouseOut, 0);

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
  handleMenuKeyDown(event, menu)
}

function handleMenuKeyDown(event, menu) {
  if (!KEYS.includes(event.key)) { return; }
  event.preventDefault()
  event.stopPropagation();

  if ([KEY_ARROW_DOWN, KEY_ARROW_UP].includes(event.key)) {

    if (!menu.matches(SEL_OPEN_MENU)) {
      menu.showPopover();
    }
    switch (event.key) {
      case KEY_ARROW_DOWN:
        console.log("case KEY_ARROW_DOWN:");
        selectNextItem(menu);
        break;

      case KEY_ARROW_UP:
        selectPrevItem(menu);
        break;
    }
    return;
  }

  if (menu.selectedItem && menu.selectedItem.matches(SEL_ITEMSUB_ENABLED)) {
  console.log("menu.selectedItem.matches(SEL_ITEMSUB_ENABLED)");
    handleSubmenuKeyDown(event, menu);
  }
}

function handleSubmenuKeyDown(event, menu) {
  const submenu = menu.selectedItem.querySelector(SEL_MENU);
  console.log("submenu", submenu);
  if (!submenu) { return; }

  switch (event.key) {
    case KEY_ARROW_RIGHT:
    case KEY_SPACE:
    case KEY_ENTER:
      console.log("KEY open submenu");
      submenu.showPopover();
      submenu.focus();
      selectNextItem(submenu);
      break;

    case KEY_ARROW_LEFT:
      console.log("KEY close submenu");
      submenu.hidePopover();
      menu.focus();
      break;
  }
}

function handleItemMouseOver(event, item) {
  const menu = item.closest(SEL_MENU);
  selectItem(menu, item)

  if (item.matches(SEL_ITEMSUB_ENABLED)) {
  const submenu = item.querySelector(SEL_CLOSED_MENU);
    if (submenu) {
      submenu.showPopover();
      submenu.focus();
      selectNextItem(submenu);
    }
  }
}

function handleSubmenuMouseOut(event, item) {
  const submenu = item.querySelector(SEL_OPEN_MENU);
  if (submenu) {
    submenu.blur();
    submenu.hidePopover();
  }
}

// ------------------------------------------------------------

export function clearSelection(menu) {
  if (!menu.selectedItem) { return; }
  if (menu.selectedItem.matches(SEL_ITEMSUB)) {
  const submenu = menu.selectedItem.querySelector(SEL_OPEN_MENU)
    if (submenu) { submenu.hidePopover(); }
  }

  menu.selectedItem.classList.remove(CLASS_SELECTED);
  menu.selectedItem = null;
}

export function selectItem(menu, item) {
  if (menu.selectedItem === item){ return; }
  clearSelection(menu);
  item.classList.add(CLASS_SELECTED);
  menu.selectedItem = item;
}

export function selectNextItem(menu) {
  const items = Array.from(menu.querySelectorAll(SEL_SCOPED_ITEM_ENABLED))
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
  const items = Array.from(menu.querySelectorAll(SEL_SCOPED_ITEM_ENABLED))
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
