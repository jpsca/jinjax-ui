/**
 * JinjaX-UI - Code for anchor-positioning popovers
 * @author Juan-Pablo Scaletti https://github.com/jpsca
 * MIT license
 */
import { on } from "./jxui.js";

const ATTR_ANCHOR = "data-anchor";
const ATTR_ANCHOR_TO = "data-anchor-to";
const SEL_ANCHORED = `[${ATTR_ANCHOR}]`;

on("beforetoggle", SEL_ANCHORED, handleTogglePopover);

function handleTogglePopover(event, popover) {
  if (event.newState === "open") {
    handleShowPopover(event, popover);
  }
}

function handleShowPopover(event, popover) {
  const anchorId = popover.getAttribute(ATTR_ANCHOR);
  if (!anchorId) { return; }
  const anchor = document.getElementById(anchorId);

  const rect = anchor.getBoundingClientRect();
  const anchorTo = popover.getAttribute(ATTR_ANCHOR_TO);
  let [anchorEdge, anchorPos] = (anchorTo || "bottom center").split(/\s+/);
  if (!["top", "right", "bottom", "left"].includes(anchorEdge)) {
    anchorEdge = "bottom";
  }
  if (!["start", "end", "center"].includes(anchorPos)) {
    anchorPos = "center";
  }
  let top, left, translateX = 0, translateY = 0;

  switch (anchorEdge) {
    case "top":
      top = rect.top;
      translateY = "-100%";
      break;
    case "bottom":
      top = rect.bottom;
      break;
    case "right":
    case "left":
      top = rect.top + rect.height / 2;
      translateY = "-50%";
      break;
  }

  switch (anchorPos) {
    case "start":
      left = rect.left;
      break;
    case "end":
      left = rect.right;
      translateX = "-100%";
      break;
    case "center":
      left = rect.left + rect.width / 2;
      translateX = "-50%";
      break;
  }

  popover.style.position = "absolute"
  popover.style.top = Math.ceil(top + window.scrollY) + "px";
  popover.style.left = Math.ceil(left + window.scrollX) + "px";
  popover.style.right = "auto"
  popover.style.bottom = "auto"

  if (translateX || translateY) {
    popover.style.translate = `${translateX} ${translateY}`;
  }
}
