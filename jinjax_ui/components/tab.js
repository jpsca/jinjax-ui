(function(){

const SEL_TAB = '.UITab';
const SEL_TABLIST = '.UITabList';
const SEL_TABGROUP = '.UITabGroup';
const SEL_TABPANEL = '.UITabPanel';

const OPEN = "open";
const ARIA_SELECTED = "aria-selected";
const HIDDEN = "hidden";
const DISABLED = "disabled";

const ACTIVATED_EVENT = OPEN;

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

addEvents(document)

function addEvents (root) {
  root.querySelectorAll(SEL_TAB)
    .forEach( (node) => {
      node.addEventListener("click", handleSelection);
      node.addEventListener("keydown", handleKeyDown);
    });
}

function handleSelection(event) {
  const tab = event.currentTarget;
  if (tab.getAttribute(DISABLED)) return;
  select(tab);
}

function handleKeyDown(event) {
  if (!HANDLED_KEYS.includes(event.key)) return;

  const tab = event.currentTarget;
  const tabList = tab.closest(SEL_TABLIST);
  const manual = tabList.hasAttribute("manual");
  const tabs = tabList.querySelectorAll(`${SEL_TAB}:not([${DISABLED}]`);
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
  tab.dispatchEvent(new CustomEvent(ACTIVATED_EVENT));

  tab
    .closest(SEL_TABLIST)
    .querySelectorAll(`${SEL_TAB}[${OPEN}]`)
    .forEach(el => {
      if (el === tab) return;
      el.removeAttribute(OPEN);
      el.removeAttribute(ARIA_SELECTED);
      el.setAttribute("tabindex", "-1");
    });

  tab.focus();
  tab.setAttribute(OPEN, true);
  tab.setAttribute(ARIA_SELECTED, "true");
  tab.setAttribute("tabindex", "0");

  const panelId = tab.getAttribute("aria-controls");
  const panel = document.getElementById(panelId);

  querySameLevel(panel.closest(SEL_TABGROUP), SEL_TABPANEL)
    .forEach(el => {
      if (el === panel) return;
      el.classList.add(HIDDEN);
    });

  panel.classList.remove(HIDDEN);
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

/* ----------------------------- */

new MutationObserver( (mutationList) => {
  mutationList.forEach( (mutation) => {
    if (mutation.type !== "childList") return;
    mutation.addedNodes.forEach( (node) => {
      if (node.nodeType === 1) {  // Element node
        addEvents(node);
      }
    });
  })
})
.observe(document.body, {
    subtree: true,
    childList: true,
    attributes: false,
    characterData: false
});

})()
