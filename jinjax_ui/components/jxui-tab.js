(function(){

const SEL_TABGROUP = '[data-tabgroup]';
const SEL_TABLIST = '[data-tablist]';
const SEL_TAB = '[data-tab]';
const SEL_TABPANEL = '[data-tabpanel]';

const SELECTED_CLASS = "selected";
const HIDDEN_CLASS = "hidden";
const ARIA_SELECTED_ATTR = "aria-selected";
const DISABLED_ATTR = "disabled";
const TABINDEX_ATTR = "tabindex";

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

jxui.on("click", SEL_TAB, handleSelection);
jxui.on("keydown", SEL_TAB, handleKeyDown);

function handleSelection(event, tab) {
  if (tab.getAttribute(DISABLED_ATTR)) return;
  select(tab);
}

function handleKeyDown(event, tab) {
  if (!HANDLED_KEYS.includes(event.key)) return;

  const tabList = tab.closest(SEL_TABLIST);
  const manual = tabList.hasAttribute("manual");
  const tabs = tabList.querySelectorAll(`${SEL_TAB}:not([${DISABLED_ATTR}]`);
  const lastIndex = tabs.length;
  let newTab;

  switch (event.key) {
    case SPACE_KEY:
    case ENTER_KEY:
      event.preventDefault()
      event.stopPropagation()
      select(tab);
      return;

    case HOME_KEY:
    case PAGE_UP_KEY:
      event.preventDefault();
      event.stopPropagation();
      newTab = tabs[0];
      manual ? newTab.focus() : select(newTab);
      return;

    case END_KEY:
    case PAGE_DOWN_KEY:
      event.preventDefault();
      event.stopPropagation();
      newTab = tabs[lastIndex];
      manual ? newTab.focus() : select(newTab);
      return;
  }

  const vertical = tab.getAttribute("aria-orientation") === "vertical";
  const prevKey = vertical ? ARROW_UP_KEY : ARROW_LEFT_KEY;
  const nextKey = vertical ? ARROW_DOWN_KEY : ARROW_RIGHT_KEY;
  const currIndex = Array.prototype.indexOf.call(tabs, tab) || 0;
  let newIndex;

  switch (event.key) {
    case prevKey:
      newIndex = currIndex - 1;
      if (newIndex < 0) {
        newIndex = lastIndex;
      }
      newTab = tabs[newIndex];
      manual ? newTab.focus() : select(newTab);
      return;

    case nextKey:
      newIndex = currIndex + 1;
      if (newIndex > lastIndex) {
        newIndex = 0;
      }
      newTab = tabs[newIndex];
      manual ? newTab.focus() : select(newTab);
      return;
  }
}

function select(tab) {
  tab.dispatchEvent(new CustomEvent(EVENT_SELECTED));

  tab
    .closest(SEL_TABLIST)
    .querySelectorAll(`${SEL_TAB}.${SELECTED_CLASS}`)
    .forEach(el => {
      if (el === tab) return;
      el.classList.remove(SELECTED_CLASS);
      el.removeAttribute(ARIA_SELECTED_ATTR);
      el.setAttribute(TABINDEX_ATTR, "-1");
    });

  tab.focus();
  tab.classList.add(SELECTED_CLASS);
  tab.setAttribute(ARIA_SELECTED_ATTR, "true");
  tab.setAttribute(TABINDEX_ATTR, "0");

  const panelId = tab.getAttribute("aria-controls");
  const panel = document.getElementById(panelId);

  querySameLevel(panel.closest(SEL_TABGROUP), SEL_TABPANEL)
    .forEach(el => {
      el.classList.add(HIDDEN_CLASS);
      if (el === panel) return;
    });
    panel.classList.remove(HIDDEN_CLASS);

}

function querySameLevel(parent, sel) {
  const nodes = [];
  const nested = new Set(Array.from(
    parent.querySelectorAll(`:scope ${sel} ${sel}`))
  );
  parent.querySelectorAll(sel).forEach(function(node) {
    if (nested.has(node)) return;
    nodes.push(node);
  });
  return nodes;
}

function selectDefault(tabGroup) {
  let tab = tabGroup.querySelector(`${SEL_TAB}.${SELECTED_CLASS}`);
  if (!tab) {
    tab = tabGroup.querySelector(SEL_TAB);
  }
  if (tab) {
    tabGroup.querySelectorAll(SEL_TABPANEL).forEach(el => {
      el.classList.add(HIDDEN_CLASS);
    });
    select(tab);
  }
}

function selectAllDefaults() {
  document.querySelectorAll(SEL_TABGROUP).forEach(selectDefault);
}

document.addEventListener("DOMContentLoaded", selectAllDefaults);

})()
