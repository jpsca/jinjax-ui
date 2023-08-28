(function(){

const ATTR_TOGGLE_CLASS = "data-toggle";
const SEL_TOGGLE = `[${ATTR_TOGGLE_CLASS}]`;

const ATTR_TOGGLE_MODAL = "data-toggle-modal";
const SEL_SHOW_MODAL = `[${ATTR_TOGGLE_MODAL}]`;

jxui.on("click", SEL_TOGGLE, onToggleClick);
jxui.on("click", SEL_SHOW_MODAL, onShowModalClick);

function onToggleClick (event, target) {
  const [ sel, value ] = (target.getAttribute(ATTR_TOGGLE_CLASS) || "").split("|");
  if (!!sel && !!value) {
    toggle(sel, value)
  }
}

function toggle (sel, value) {
  for (const node of document.querySelectorAll(sel)) {
    toggleAttribute(node, value);
  }
}

function toggleAttribute (node, value) {
  if (value[0] == "[") {
    node.toggleAttribute(value.slice(1, -1));
  } else if (value[0] == ".") {
    node.classList.toggle(value.slice(1));
  }
}

function onShowModalClick (event, target) {
  const sel = target.getAttribute(ATTR_TOGGLE_MODAL) || "";
  for (const dialog of document.querySelectorAll(sel)) {
    if (dialog.open) {
      dialog.close();
     } else {
      dialog.showModal();
     }
  }
}

})()
