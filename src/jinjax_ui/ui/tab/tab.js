/**
 * JinjaX-UI - Tabs
 * @author Juan-Pablo Scaletti https://github.com/jpsca
 * MIT license
 */
import { Controller } from "../stimulus.js";

const ATTR_SELECTED = "data-selected";
const ATTR_DISABLED = "data-disabled";
const ATTR_HIDDEN = "data-hidden";

const ATTR_ARIA_CONTROLS = "aria-controls";
const ATTR_ARIA_SELECTED = "aria-selected";
const ATTR_ARIA_HIDDEN = "aria-hidden";
const ATTR_MANUAL = "data-manual";
const ATTR_TABINDEX = "tabindex";

const SEL_GROUP = ".jxui-tab-group";
const SEL_LIST = ".jxui-tab-list";
const SEL_TAB = ".jxui-tab";
const SEL_TAB_SCOPED = `${SEL_TAB}:not(:scope ${SEL_GROUP} *)`;

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

function isSelected(tab) {
  return tab.hasAttribute(ATTR_SELECTED);
}
function isEnabled(tab) {
  return !tab.hasAttribute(ATTR_DISABLED);
}
function hasFocus(tab) {
  return document.activeElement === tab;
}

export class TabsController extends Controller {
  static targets = ["tab", "panel", "select"];
  static values = {
    manual: { type: Boolean, default: false },
  }

  initialize() {
    this._selectTab = this._selectTab.bind(this);
  }

  connect() {
    const tab =
      this.tabTargets.find((tab) => isSelected(tab) && isEnabled(tab))
      || this.tabTargets.find(isEnabled);
    // We want to select the default tabs to set the right attributes,
    // but we do not want to change the focus to them.
    if (tab) { this._selectTab(tab, false); }
  }

  keydown(event) {
    if (!KEYS.includes(event.key)) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    switch (event.key) {
      case KEY_SPACE:
      case KEY_ENTER:
        this.selectTab(event);
        break;
      case KEY_ARROW_LEFT:
      case KEY_ARROW_UP:
        this.prevTab(event);
        break;
      case KEY_ARROW_RIGHT:
      case KEY_ARROW_DOWN:
        this.nextTab(event);
        break;
      case KEY_HOME:
      case KEY_PAGE_UP:
        this.firstTab();
        break;
      case KEY_END:
      case KEY_PAGE_DOWN:
        this.lastTab();
        break;
    }
  }

  selectTab(event) {
    const tab = event.target.closest(SEL_TAB);
    if (tab && isEnabled(tab)) { this._selectTab(tab); }
  }

  firstTab() {
    const tab = this.tabTargets.find(isEnabled);
    if (!tab) return;
    this.manualValue ? tab.focus() : this._selectTab(tab);
  }

  lastTab() {
    const revTabs = [...this.tabTargets.filter(isEnabled)].reversed()
    const tab = revTabs[0];
    if (!tab) return;
    this.manualValue ? tab.focus() : this._selectTab(tab);
  }

  prevTab(event) {
    const tabList = event.target.closest(SEL_LIST);
    const tabs = [
      ...tabList.querySelectorAll(`${SEL_TAB_SCOPED}:not([${ATTR_DISABLED}])`)
    ];
    const currIndex = tabs.findIndex(this.manualValue ? hasFocus : isSelected) || 0;

    let newIndex = currIndex - 1;
    if (newIndex < 0) {
      newIndex = tabs.length - 1;
    }
    const tab = tabs[newIndex];
    this.manualValue ? tab.focus() : this._selectTab(tab);
  }

  nextTab(event) {
    const tabList = event.target.closest(SEL_LIST);
    const tabs = [
      ...tabList.querySelectorAll(`${SEL_TAB_SCOPED}:not([${ATTR_DISABLED}])`)
    ];
    const currIndex = tabs.findIndex(this.manualValue ? hasFocus : isSelected) || 0;

    let newIndex = currIndex + 1;
    if (newIndex > (tabs.length - 1)) {
      newIndex = 0;
    }
    const tab = tabs[newIndex];
    this.manualValue ? tab.focus() : this._selectTab(tab);
  }

  chooseTab(event) {
    if (!event.target.value) { return; }
    const tab = event.target.closest(SEL_GROUP)
      .querySelector(`${SEL_TAB_SCOPED}[${ATTR_ARIA_CONTROLS}="${event.target.value}"]`)
    if (tab) { this._selectTab(tab); }
  }

  _selectTab(tab, setFocus=true) {
    this.dispatch("tab:selected", { target: tab });

    const panelId = tab.getAttribute(ATTR_ARIA_CONTROLS);

    this.tabTargets.forEach((otab) => {
      if (otab !== tab) {
        otab.removeAttribute(ATTR_SELECTED);
        otab.removeAttribute(ATTR_ARIA_SELECTED);
        otab.setAttribute(ATTR_TABINDEX, "-1");
      }
    });

    tab.setAttribute(ATTR_SELECTED, "1");
    tab.setAttribute(ATTR_ARIA_SELECTED, "1");
    tab.setAttribute(ATTR_TABINDEX, "0");
    if (setFocus) { tab.focus(); }


    this.panelTargets.forEach((panel) => {
      if (panel.id === panelId) {
        panel.removeAttribute(ATTR_HIDDEN);
        panel.removeAttribute(ATTR_ARIA_HIDDEN);
      } else {
        panel.setAttribute(ATTR_HIDDEN, "1");
        panel.setAttribute(ATTR_ARIA_HIDDEN, "1");
      }
    });

    if (this.hasSelectTarget) {
      this.selectTarget.value = panelId;
    }
  }
}

window.Stimulus.register("ui--tabs", TabsController);
