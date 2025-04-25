/**
 * JinjaX-UI - Alert
 * @author Juan-Pablo Scaletti https://github.com/jpsca
 * MIT license
 */
import { on } from "./jxui.js";

const SEL_ALERT = ".jxui-alert";
const SEL_BUTTON = `${SEL_ALERT}[data-dismissible] .jxui-alert-dismiss`;
const CLASS_DISMISSED = "dismissed";


function dismissAlert(e) {
  const alert = e.target.closest(SEL_ALERT);
  if (!alert) { return; }
  alert.classList.add(CLASS_DISMISSED);
  setTimeout(() => { alert.remove(); }, 300);
}

function setup() {
  on("click", SEL_BUTTON, dismissAlert, 10);
}

document.addEventListener("DOMContentLoaded", setup);
setup();