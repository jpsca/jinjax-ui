/**
 * JinjaX-UI - Code for anchor-positioning popovers
 * @author Juan-Pablo Scaletti https://github.com/jpsca
 * MIT license
 */
import { on } from "./jxui.js";

const ATTR_ANCHOR = "data-anchor";
const ATTR_ANCHOR_LEFT = "data-anchor-left";
const ATTR_ANCHOR_RIGHT = "data-anchor-right";
const ATTR_ANCHOR_TOP = "data-anchor-top";
const ATTR_ANCHOR_BOTTOM = "data-anchor-bottom";
const SEL_ANCHOR = `[${ATTR_ANCHOR}]`;

on("beforetoggle", SEL_ANCHOR, handleShowPopover);

function handleShowPopover(event, popover) {
  if (event.newState !== "open") {
    return
  }
  const anchorId = popover.getAttribute(ATTR_ANCHOR);
  const anchor = document.getElementById(anchorId);
  const anchorLeft = popover.getAttribute(ATTR_ANCHOR_LEFT);
  const anchorRight = popover.getAttribute(ATTR_ANCHOR_RIGHT);
  const anchorTop = popover.getAttribute(ATTR_ANCHOR_TOP);
  const anchorBottom = popover.getAttribute(ATTR_ANCHOR_BOTTOM);

  const rect = anchor.getBoundingClientRect();
  let left = null, right = null, top = null, bottom = null;

  if (anchorLeft) {
    switch (anchorLeft) {
      case "left":
        left = rect.left;
        break;
      case "right":
        left = rect.right;
        break;
      case "center":
        left = rect.left + rect.width / 2;
        break;
    }
  }

  if (anchorRight) {
    switch (anchorRight) {
      case "left":
        right = rect.left;
        break;
      case "right":
        right = rect.right;
        break;
      case "center":
        right = rect.right - rect.width / 2;
        break;
    }
  }

  if (anchorTop) {
    switch (anchorTop) {
      case "top":
        top = rect.top;
        break;
      case "bottom":
        top = rect.bottom
        break;
      case "center":
        top = rect.top + rect.height / 2;
        break;
    }
  }

  if (anchorBottom) {
    switch (anchorBottom) {
      case "top":
        bottom = rect.top;
        break;
      case "bottom":
        bottom = rect.bottom
        break;
      case "center":
        bottom = rect.bottom - rect.height / 2;
        break;
    }
  }

  popover.style.position = "absolute";

  if (top !== null) {
    top = Math.ceil(top + window.scrollY);
    popover.style.top = `${top}px`;
  } else {
    delete popover.style.top;
  }

  if (bottom != null) {
    bottom = Math.ceil(bottom + window.scrollY);
    popover.style.bottom = `${bottom}px`;
  } else {
    delete popover.style.bottom;
  }

  if (left != null) {
    left = Math.ceil(left + window.scrollX);
    popover.style.left = `${left}px`;
  } else {
    delete popover.style.left;
  }

  if (right != null) {
    right = Math.ceil(right + window.scrollX);
    popover.style.right = `${right}px`;
  } else {
    delete popover.style.right;
  }
}
