/**
 * JinjaX-UI - Alert
 * @author Juan-Pablo Scaletti https://github.com/jpsca
 * MIT license
 */
import { Controller } from "../stimulus.js";

export class AlertController extends Controller {
  dismiss(event) {
    const alert = event.target.closest(".jxui-alert");
    if (!alert) return;
    alert.addEventListener("transitionend", (e) => {
      if (e.target === alert && e.propertyName === "opacity") {
        alert.remove();
      }
    });
    alert.classList.add("dismissed");
  }
}
window.Stimulus.register("ui--alert", AlertController);
