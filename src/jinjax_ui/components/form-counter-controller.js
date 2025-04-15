/**
 * JinjaX-UI - Form counter
 * @author Juan-Pablo Scaletti https://github.com/jpsca
 * MIT license
 */
import { on } from "./jxui.js";

const SEL = ".jxui-form-counter";
const ATTR_READY = "data-ready";
const ATTR_VALIDATION = "data-validation";
const VALID = "valid";
const INVALID = "invalid";

function setupCounter(el) {
  const seltarget = el.getAttribute("data-target");
    if (!seltarget) {
      console.error("Form counter element missing data-target attribute", el);
      return;
    }
    const target = document.getElementById(seltarget);
    if (!target) {
      return;
    }
    let minlen = +el.getAttribute("data-minlen");
    minlen = isNaN(minlen) ? 0 : minlen;
    let maxlen = +el.getAttribute("data-maxlen");
    maxlen = isNaN(maxlen) ? 0 : maxlen;
    if (!minlen && !maxlen) {
      console.error("Form counter element missing data-minlen or data-maxlen attribute", el);
      return;
    }

    const counter = el.querySelector(".jxui-form-counter-current");

    function updateCounter() {
      const len = target.value.length;
      counter.textContent = len;
      if (len === 0) {
        el.removeAttribute(ATTR_VALIDATION);
        return;
      }
      if ((minlen && len < minlen) || (maxlen && len > maxlen)) {
        el.setAttribute(ATTR_VALIDATION, INVALID);
      } else {
        el.setAttribute(ATTR_VALIDATION, VALID);
      }
    }

    updateCounter();
    on("input", `#${seltarget}`, updateCounter, 10);
}

function setup() {
  document.querySelectorAll(`${SEL}:not([${ATTR_READY}])`).forEach(function (el) {
    setupCounter(el);
    el.setAttribute(ATTR_READY, "");
  });
}

document.addEventListener("DOMContentLoaded", setup);
setup();