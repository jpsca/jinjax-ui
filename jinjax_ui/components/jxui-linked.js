/**
 * JinjaX-UI - Linked lists
 * @author Juan-Pablo Scaletti https://github.com/jpsca
 * MIT license
 */
import { on } from "./jxui.js";

const ATTR_LINKED = "data-linked-to";
const ATTR_ACTIVE = "data-linked-active";
const ATTR_SORTED = "data-linked-sorted";

const SEL_LIST = `[${ATTR_LINKED}]`;
const SEL_ITEM = `${SEL_LIST} > li`;
const SEL_ACTIVE_ITEM = `${SEL_ITEM}:not([disabled])`;
const SEL_CHECKBOX = `${SEL_ITEM} input[type=checkbox]:not([disabled])`;

const EVENT_SEND_ALL = "jxui:linked:sendall"

const KEY_SPACE = " ";
const KEY_ENTER = "Enter";
const KEYS = [KEY_SPACE, KEY_ENTER];

on("click", SEL_ACTIVE_ITEM, handleClick);
on("click", SEL_CHECKBOX, handleCheckboxClick);
on("keydown", SEL_ACTIVE_ITEM, handleKeyDown);
on(EVENT_SEND_ALL, SEL_LIST, handleSendAll);

/** Event handlers **/

function handleClick (event, item) {
  event.preventDefault();
  return sendItem(item);
}

function handleCheckboxClick (event, checkbox) {
  event.preventDefault();
  event.stopPropagation();
  const item = checkbox.closest(SEL_ACTIVE_ITEM);
  return sendItem(item, checkbox);
}

function handleKeyDown(event, item) {
  if (!KEYS.includes(event.key)) return;
  event.preventDefault();
  event.stopPropagation();
  return handleClick(event, item);
}

function handleSendAll(event, list) {
  return sendAllItems(list);
}

/** Helpers **/

function comparator (a, b) {
  const aText = a.textContent.trim();
  const bText = b.textContent.trim();
  // asc
  return aText > bText ? 1 : -1;
};


export function sendItem (item, checkbox) {
  if (!item) { return; }
  checkbox = checkbox || item.querySelector(SEL_CHECKBOX);
  const srcList = item.closest(SEL_LIST);
  const destList = document.getElementById(srcList.getAttribute(ATTR_LINKED));
  const active = destList.hasAttribute(ATTR_ACTIVE);
  const sorted = destList.hasAttribute(ATTR_SORTED);

  srcList.removeChild(item);
  if (!sorted) {
    destList.appendChild(item);
    return;
  }

  const items = Array.from(destList.querySelectorAll(SEL_ITEM));
  items.push(item);
  items.sort(comparator)
  items.forEach(el => {
    destList.appendChild(el);
  });
  setTimeout(function(){
    checkbox.checked = active;
  }, 0);
}

export function sendAllItems(srcList) {
  const destList = document.getElementById(srcList.getAttribute(ATTR_LINKED));
  const active = destList.hasAttribute(ATTR_ACTIVE);
  const sorted = destList.hasAttribute(ATTR_SORTED);

  const srcItems = Array.from(destList.querySelectorAll(SEL_ITEM));
  const newItems = Array.from(srcList.querySelectorAll(SEL_ACTIVE_ITEM));
  const items = [...srcItems, ...newItems]
  if (sorted) {
    items.sort(comparator);
  }
  items.forEach(item => {
    destList.appendChild(item);
  });

  const checkboxes = Array.from(destList.querySelectorAll(SEL_CHECKBOX));
  checkboxes.forEach(checkbox => {
    checkbox.checked = active;
  });
}
