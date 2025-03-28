/**
 * JinjaX-UI - Tabs
 * @author Juan-Pablo Scaletti https://github.com/jpsca
 * MIT license
 */
import { on } from "./jxui.js";

/**
 * @typedef {HTMLElement} Tab
 * @typedef {HTMLSelectElement} TabSelect
 * @typedef {HTMLElement} TabGroup
 */

export const EVENT_SELECTED = "jxui:tab:selected";

const SEL_GROUP = ".jxui-tab-group";
const SEL_LIST = ".jxui-tab-list";
const SEL_TAB = ".jxui-tab";
const SEL_PANEL = ".jxui-tab-panel";
const SEL_SELECT = ".jxui-tab-select";

const SEL_TAB_SCOPED = `${SEL_TAB}:not(:scope ${SEL_GROUP} *)`;
const SEL_TABPANEL_SCOPED = `${SEL_PANEL}:not(:scope ${SEL_GROUP} *)`;
const SEL_SELECT_SCOPED = `${SEL_SELECT}:not(:scope ${SEL_GROUP} *)`;

const ATTR_ARIA_SELECTED = "aria-selected";
const ATTR_ARIA_HIDDEN = "aria-hidden";
const ATTR_ARIA_ORIENTATION = "aria-orientation";
const ATTR_ARIA_CONTROLS = "aria-controls";
const ATTR_TABINDEX = "tabindex";
const ATTR_MANUAL = "data-manual";

const ATTR_SELECTED = "data-selected";
const ATTR_DISABLED = "data-disabled";
const ATTR_HIDDEN = "data-hidden";

const VALUE_VERTICAL = "vertical";

const KEY_SPACE = " ";
const KEY_ENTER = "Enter";
const KEY_ARROW_LEFT = "ArrowLeft";
const KEY_ARROW_UP = "ArrowUp";
const KEY_ARROW_RIGHT = "ArrowRight";
const KEY_ARROW_DOWN = "ArrowDown";
const KEY_HOME = "Home";
const KEY_END = "End";
const KEY_PAGE_UP = "PageUp";
const KEY_PAGE_DOWN = "PageDown";
const KEYS = [
  KEY_SPACE,
  KEY_ENTER,
  KEY_ARROW_LEFT,
  KEY_ARROW_UP,
  KEY_ARROW_RIGHT,
  KEY_ARROW_DOWN,
  KEY_HOME,
  KEY_END,
  KEY_PAGE_UP,
  KEY_PAGE_DOWN,
];

on("click", SEL_TAB, handleClickOnTab);
on("keydown", SEL_TAB, handleKeyDown);
on("change", SEL_SELECT, handleChangeSelect);

/**
 * @param {MouseEvent} event
 * @param {Tab} tab
 */
function handleClickOnTab(event, tab) {
  if (tab.hasAttribute(ATTR_DISABLED)) { return; }
  selectTab(tab);
}

/**
 * @param {ChangeEvent} event
 * @param {TabSelect} select
 */
function handleChangeSelect(event, select) {
  if (!select.value) {
    return;
  }
  const tab = select
    .closest(SEL_GROUP)
    .querySelector(`${SEL_TAB_SCOPED}[${ATTR_ARIA_CONTROLS}="${select.value}"]`)
  if (tab) {
    selectTab(tab);
  }
}

/**
 * @param {KeyboardEvent} event
 * @param {Tab} tab
 */
function handleKeyDown(event, tab) {
  if (!KEYS.includes(event.key)) return;

  const tabList = tab.closest(SEL_LIST);
  const manual = tabList.hasAttribute(ATTR_MANUAL);
  const tabs = tabList.querySelectorAll(`${SEL_TAB_SCOPED}:not([${ATTR_DISABLED}])`);
  const lastIndex = tabs.length - 1;
  let newTab;

  switch (event.key) {
    case KEY_SPACE:
    case KEY_ENTER:
      event.preventDefault()
      event.stopPropagation();
      selectTab(tab);
      return;

    case KEY_HOME:
    case KEY_PAGE_UP:
      event.preventDefault();
      event.stopPropagation();
      newTab = tabs[0];
      manual ? newTab.focus() : selectTab(newTab);
      return;

    case KEY_END:
    case KEY_PAGE_DOWN:
      event.preventDefault();
      event.stopPropagation();
      newTab = tabs[lastIndex];
      manual ? newTab.focus() : selectTab(newTab);
      return;
  }

  const vertical = tabList.getAttribute(ATTR_ARIA_ORIENTATION) === VALUE_VERTICAL;
  const prevKey = vertical ? KEY_ARROW_UP : KEY_ARROW_LEFT;
  const nextKey = vertical ? KEY_ARROW_DOWN : KEY_ARROW_RIGHT;
  const currIndex = Array.prototype.indexOf.call(tabs, tab) || 0;
  let newIndex;

  switch (event.key) {
    case prevKey:
      event.preventDefault();
      event.stopPropagation();
      newIndex = currIndex - 1;
      if (newIndex < 0) {
        newIndex = lastIndex;
      }
      newTab = tabs[newIndex];
      manual ? newTab.focus() : selectTab(newTab);
      return;

    case nextKey:
      event.preventDefault();
      event.stopPropagation();
      newIndex = currIndex + 1;
      if (newIndex > lastIndex) {
        newIndex = 0;
      }
      newTab = tabs[newIndex];
      manual ? newTab.focus() : selectTab(newTab);
      return;
  }
}

/**
 * @param {Tab} tab
 */
function selectTab(tab, focus = true) {
  tab.dispatchEvent(new CustomEvent(EVENT_SELECTED));

  const target = tab.getAttribute(ATTR_ARIA_CONTROLS);
  const tablist = tab.closest(SEL_LIST);

  tablist
    .querySelectorAll(`${SEL_TAB_SCOPED}[${ATTR_SELECTED}]`)
    .forEach(el => {
      if (el === tab) return;
      el.removeAttribute(ATTR_SELECTED);
      el.removeAttribute(ATTR_ARIA_SELECTED);
      el.setAttribute(ATTR_TABINDEX, "-1");
    });

  const tabselect = tablist.closest(SEL_GROUP).querySelector(SEL_SELECT_SCOPED)
  if (tabselect) {
    tabselect.value = target;
  }

  if (focus) { tab.focus(); }
  tab.setAttribute(ATTR_SELECTED, "1");
  tab.setAttribute(ATTR_ARIA_SELECTED, "1");
  tab.setAttribute(ATTR_TABINDEX, "0");
  selectPanel(target);
}

/**
 * @param {string} panelId
 */
function selectPanel(panelId) {
  const panel = document.getElementById(panelId);
  panel
  .closest(SEL_GROUP)
  .querySelectorAll(`${SEL_TABPANEL_SCOPED}:not([${ATTR_HIDDEN}])`)
  .forEach(el => {
    el.setAttribute(ATTR_HIDDEN, "1");
    el.setAttribute(ATTR_ARIA_HIDDEN, "1");
  });

  panel.removeAttribute(ATTR_HIDDEN);
  panel.removeAttribute(ATTR_ARIA_HIDDEN);
}

/**
 * Select the default Tab for this TabGroup.
 * @param {TabGroup} tabGroup
 */
function selectDefault(tabGroup) {
  let tab = tabGroup.querySelector(`${SEL_TAB_SCOPED}[${ATTR_SELECTED}]`);
  if (!tab) {
    tab = tabGroup.querySelector(SEL_TAB_SCOPED);
  }
  if (tab) {
    tabGroup.querySelectorAll(SEL_TABPANEL_SCOPED).forEach(el => {
      el.setAttribute(ATTR_HIDDEN, "1");
      el.setAttribute(ATTR_ARIA_HIDDEN, "1");
    });
    selectTab(tab, false);
  }
}

function setup() {
  document.querySelectorAll(SEL_GROUP).forEach(selectDefault);
}
document.addEventListener("DOMContentLoaded", setup);
setup();
