/**
 * JinjaX-UI - Code for anchor-positioning popovers
 * @author Juan-Pablo Scaletti https://github.com/jpsca
 * MIT license
 */
import { on } from "./jxui.js";

const ATTR_ANCHOR = "data-anchor";
const ATTR_ANCHOR_TO = "data-anchor-to";
const SEL_ANCHORED_SUB = `[${ATTR_ANCHOR}] [${ATTR_ANCHOR}]`;
const SEL_ANCHORED_ROOT = `[${ATTR_ANCHOR}]:not(${SEL_ANCHORED_SUB})`;

on("beforetoggle", SEL_ANCHORED_ROOT, handleTogglePopover);
on("toggle", SEL_ANCHORED_SUB, handleTogglePopover);

function handleTogglePopover(event, popover) {
  if (event.newState === "open") {
    setPosition(popover);
  }
}

export function setPosition(popover) {
  const anchorId = popover.getAttribute(ATTR_ANCHOR);
  if (!anchorId) { return; }
  const anchor = document.getElementById(anchorId);
  if (!anchor.checkVisibility()){ return; }

  const rect = anchor.getBoundingClientRect();
  let anchorTo = popover.getAttribute(ATTR_ANCHOR_TO);
  let [anchorEdge, anchorPos] = (anchorTo || "bottom center").split(/\s+/);
  if (!["top", "right", "bottom", "left"].includes(anchorEdge)) {
    anchorEdge = "bottom";
  }
  if (!["start", "end", "center"].includes(anchorPos)) {
    anchorPos = "center";
  }
  anchorTo = [anchorEdge, anchorPos].join(" ")
  let top, left, translateX = 0, translateY = 0;

  switch (anchorTo) {
    case "top start":
      top = rect.top;
      translateY = "-100%";
      left = rect.left;
      break;
    case "bottom start":
      top = rect.bottom;
      left = rect.left;
      break;
    case "right start":
      top = rect.top;
      left = rect.right;
      break;
    case "left start":
      top = rect.top;
      left = rect.left;
      translateX = "-100%";
      break;

    case "top end":
      top = rect.top;
      translateY = "-100%";
      left = rect.right;
      translateX = "-100%";
      break;
    case "bottom end":
      top = rect.bottom;
      left = rect.right;
      translateX = "-100%";
      break;
    case "right end":
      top = rect.bottom;
      translateY = "-100%";
      left = rect.right;
      break;
    case "left end":
      top = rect.bottom;
      translateY = "-100%";
      left = rect.left;
      translateX = "-100%";
      break;

    case "top center":
      top = rect.top;
      translateY = "-100%";
      left = rect.left + rect.width / 2;
      translateX = "-50%";
      break;
    case "bottom center":
      top = rect.bottom;
      left = rect.left + rect.width / 2;
      translateX = "-50%";
      break;
    case "right center":
      top = rect.top + rect.height / 2;
      translateY = "-50%";
      left = rect.right;
      break;
    case "left center":
      top = rect.top + rect.height / 2;
      translateY = "-50%";
      left = rect.left;
      translateX = "-100%";
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
