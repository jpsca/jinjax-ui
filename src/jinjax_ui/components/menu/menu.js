/**
 * JinjaX-UI - Menus
 * @author Juan-Pablo Scaletti https://github.com/jpsca
 * MIT license
 */
import { on } from "./jxui.js";

const CLASS_SELECTED = "jxui-selected";
const CLASS_DISABLED = "jxui-disabled";

const SEL_BUTTON = ".jxui-menu-button";
const SEL_MENU = ".jxui-menu";
const SEL_SUBMENU = `${SEL_MENU} ${SEL_MENU}`;
const SEL_OPEN_MENU = `${SEL_MENU}:popover-open`;
const SEL_CLOSED_MENU = `${SEL_MENU}:not(:popover-open)`;
const SEL_ITEM = `.jxui-menuitem`;
const SEL_ITEMSUB = `.jxui-menuitem-sub`;
const SEL_ITEM_ENABLED = `${SEL_ITEM}:not(.${CLASS_DISABLED})`;
const SEL_ITEMSUB_ENABLED = `${SEL_ITEMSUB}:not(.${CLASS_DISABLED})`;
const SEL_SCOPED_ITEM_ENABLED = `${SEL_ITEM_ENABLED}:not(:scope ${SEL_ITEM} ${SEL_ITEM})`;

const KEY_ARROW_DOWN = "ArrowDown";
const KEY_ARROW_UP = "ArrowUp";
const KEY_ARROW_RIGHT = "ArrowRight";
const KEY_ARROW_LEFT = "ArrowLeft";
const KEY_SPACE = " ";
const KEY_ENTER = "Enter";

const KEYS = [KEY_ARROW_UP, KEY_ARROW_DOWN, KEY_ARROW_RIGHT, KEY_ARROW_LEFT, KEY_SPACE, KEY_ENTER];

on("keydown", SEL_BUTTON, handleButtonKeyDown);
on("keydown", SEL_OPEN_MENU, handleMenuKeyDown);
on("mouseover", SEL_ITEM_ENABLED, handleItemMouseOver, 0);

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

  if (!menu.matches(SEL_OPEN_MENU)) {
    menu.showPopover();
  }
  menu.focus();

  switch (event.key) {
    case KEY_ARROW_DOWN:
      selectNextItem(menu);
      return;

    case KEY_ARROW_UP:
      selectPrevItem(menu);
      return;

    case KEY_ARROW_RIGHT:
    case KEY_SPACE:
    case KEY_ENTER:
      if (menu.selectedItem && menu.selectedItem.matches(SEL_ITEMSUB_ENABLED)
      ) {
        const submenu = menu.selectedItem.querySelector(SEL_MENU);
        if (!submenu) { return; }
        submenu.showPopover();
        submenu.focus();
        selectNextItem(submenu);
        return;
      }

    case KEY_ARROW_LEFT:
      if (!menu.matches(SEL_SUBMENU)) { return; }
      const parent = menu.parentNode.closest(SEL_MENU);
      parent.focus();
      clearSelection(menu);
      menu.hidePopover()
      return;
  }
}

function handleItemMouseOver(event, item) {
  const menu = item.closest(SEL_MENU);
  selectItem(menu, item)

  if (item.matches(SEL_ITEMSUB_ENABLED)) {
    const submenu = item.querySelector(SEL_CLOSED_MENU);
    if (submenu) {
      submenu.showPopover();
    }
  }
}

// ------------------------------------------------------------

export function clearSelection(menu) {
  if (!menu.selectedItem) { return; }
  if (menu.selectedItem.matches(SEL_ITEMSUB)) {
    const submenu = menu.selectedItem.querySelector(SEL_OPEN_MENU);
    if (submenu) {
      clearSelection(submenu);
      submenu.hidePopover();
    }
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
