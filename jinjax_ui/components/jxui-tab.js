(function(){
/**
 * @typedef {HTMLElement} Tab
 * @typedef {HTMLSelectElement} TabSelect
 * @typedef {HTMLElement} TabGroup
 */

const SEL_TABGROUP = '[data-type="tabgroup"]';
const SEL_TABLIST = '[data-type="tablist"]';
const SEL_TAB = '[data-type="tab"]';
const SEL_TABPANEL = '[data-type="tabpanel"]';
const SEL_TABSELECT = '[data-type="tabselect"]';

const SEL_TAB_SCOPED = `${SEL_TAB}:not(:scope ${SEL_TABGROUP} ${SEL_TAB})`;
const SEL_TABPANEL_SCOPED = `${SEL_TABPANEL}:not(:scope ${SEL_TABGROUP} ${SEL_TABPANEL})`;
const SEL_TABSELECT_SCOPED = `${SEL_TABSELECT}:not(:scope ${SEL_TABGROUP} ${SEL_TABSELECT})`;

const ARIA_SELECTED_ATTR = "aria-selected";
const ARIA_ORIENTATION_ATTR = "aria-orientation";
const VERTICAL_VALUE = "vertical";
const ARIA_CONTROLS_ATTR = "aria-controls";
const TABINDEX_ATTR = "tabindex";

const SELECTED_ATTR = "data-selected";
const DISABLED_ATTR = "data-disabled";
const HIDDEN_ATTR = "data-hidden";
const MANUAL_ATTR = "data-manual";

const EVENT_SELECTED = "jxui:tab:selected";

const SPACE_KEY = " ";
const ENTER_KEY = "Enter";
const ARROW_LEFT_KEY = "ArrowLeft";
const ARROW_UP_KEY = "ArrowUp";
const ARROW_RIGHT_KEY = "ArrowRight";
const ARROW_DOWN_KEY = "ArrowDown";
const HOME_KEY = "Home";
const END_KEY = "End";
const PAGE_UP_KEY = "PageUp";
const PAGE_DOWN_KEY = "PageDown";
const HANDLED_KEYS = [
  SPACE_KEY,
  ENTER_KEY,
  ARROW_LEFT_KEY,
  ARROW_UP_KEY,
  ARROW_RIGHT_KEY,
  ARROW_DOWN_KEY,
  HOME_KEY,
  END_KEY,
  PAGE_UP_KEY,
  PAGE_DOWN_KEY,
];

jxui.on("click", SEL_TAB, handleClickOnTab);
jxui.on("keydown", SEL_TAB, handleKeyDown);
jxui.on("change", SEL_TABSELECT, handleChangeSelect);

/**
 * @param {MouseEvent} event
 * @param {Tab} tab
 */
function handleClickOnTab(event, tab) {
  if (tab.hasAttribute(DISABLED_ATTR)) return;
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
    .closest(SEL_TABGROUP)
    .querySelector(`${SEL_TAB_SCOPED}[${ARIA_CONTROLS_ATTR}="${select.value}"]`)
  if (tab) {
    selectTab(tab);
  }
}

/**
 * @param {KeyboardEvent} event
 * @param {Tab} tab
 */
function handleKeyDown(event, tab) {
  if (!HANDLED_KEYS.includes(event.key)) return;

  const tabList = tab.closest(SEL_TABLIST);
  const manual = tabList.hasAttribute(MANUAL_ATTR);
  const tabs = tabList.querySelectorAll(`${SEL_TAB_SCOPED}:not([${DISABLED_ATTR}])`);
  const lastIndex = tabs.length - 1;
  let newTab;

  switch (event.key) {
    case SPACE_KEY:
    case ENTER_KEY:
      event.preventDefault()
      event.stopPropagation()
      selectTab(tab);
      return;

    case HOME_KEY:
    case PAGE_UP_KEY:
      event.preventDefault();
      event.stopPropagation();
      newTab = tabs[0];
      manual ? newTab.focus() : selectTab(newTab);
      return;

    case END_KEY:
    case PAGE_DOWN_KEY:
      event.preventDefault();
      event.stopPropagation();
      newTab = tabs[lastIndex];
      manual ? newTab.focus() : selectTab(newTab);
      return;
  }

  const vertical = tabList.getAttribute(ARIA_ORIENTATION_ATTR) === VERTICAL_VALUE;
  const prevKey = vertical ? ARROW_UP_KEY : ARROW_LEFT_KEY;
  const nextKey = vertical ? ARROW_DOWN_KEY : ARROW_RIGHT_KEY;
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
function selectTab(tab) {
  tab.dispatchEvent(new CustomEvent(EVENT_SELECTED));

  const target = tab.getAttribute(ARIA_CONTROLS_ATTR);
  const tablist = tab.closest(SEL_TABLIST);

  tablist
    .querySelectorAll(`${SEL_TAB_SCOPED}[${SELECTED_ATTR}]`)
    .forEach(el => {
      if (el === tab) return;
      el.removeAttribute(SELECTED_ATTR);
      el.removeAttribute(ARIA_SELECTED_ATTR);
      el.setAttribute(TABINDEX_ATTR, "-1");
    });

  const tabselect = tablist.closest(SEL_TABGROUP).querySelector(SEL_TABSELECT_SCOPED)
  if (tabselect) {
    tabselect.value = target;
  }

  tab.focus();
  el.setAttribute(SELECTED_ATTR, "true");
  tab.setAttribute(ARIA_SELECTED_ATTR, "true");
  tab.setAttribute(TABINDEX_ATTR, "0");
  selectPanel(target);
}

/**
 * @param {string} panelId
 */
function selectPanel(panelId) {
  const panel = document.getElementById(panelId);
  panel
  .closest(SEL_TABGROUP)
  .querySelectorAll(`${SEL_TABPANEL_SCOPED}:not([${HIDDEN_ATTR}])`)
  .forEach(el => {
    el.setAttribute(HIDDEN_ATTR, "true");
  });

  panel.setAttribute(SELECTED_ATTR, "true");
}

/**
 * Select the default Tab for this TabGroup.
 * @param {TabGroup} tabGroup
 */
function selectDefault(tabGroup) {
  let tab = tabGroup.querySelector(`${SEL_TAB_SCOPED}[${SELECTED_ATTR}]`);
  if (!tab) {
    tab = tabGroup.querySelector(SEL_TAB_SCOPED);
  }
  if (tab) {
    tabGroup.querySelectorAll(SEL_TABPANEL_SCOPED).forEach(el => {
      el.setAttribute(HIDDEN_ATTR, "true");
    });
    selectTab(tab);
  }
}

/**
 * Select the default Tab for each TabGroup on the page.
 */
function selectAllDefaults() {
  document.querySelectorAll(SEL_TABGROUP).forEach(selectDefault);
}

document.addEventListener("DOMContentLoaded", selectAllDefaults);

})()
