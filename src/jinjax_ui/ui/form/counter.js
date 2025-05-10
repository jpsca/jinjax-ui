/**
 * JinjaX-UI - Form counter
 * @author Juan-Pablo Scaletti https://github.com/jpsca
 * MIT license
 */
import { Controller } from "../stimulus.js";

export class FormCounterController extends Controller {
  static targets = [ "counter", "input", "count" ];
  static values = {
    minlen: Number,
    maxlen: Number
  };

  initialize() {
    this.update = this.update.bind(this);
  }

  connect() {
    this.update();
    this.inputTarget.addEventListener("input", this.update);
  }

  disconnect() {
    this.inputTarget.removeEventListener("input", this.update);
  }

  update() {
    const count = this.count;
    const minlen = this.minlenValue;
    const maxlen = this.maxlenValue;

    this.countTarget.innerHTML = count.toLocaleString();

    if ((minlen && count < minlen) || (maxlen && count > maxlen)) {
      this.counterTarget.setAttribute("data-validation", "invalid");
    } else {
      this.counterTarget.setAttribute("data-validation", "valid");
    }
  }

  get count() {
    return this.inputTarget.value.length;
  }
}
window.Stimulus.register("ui--form-counter", FormCounterController);
