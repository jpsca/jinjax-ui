---
title: Accordion
description: Component for grouping <details> HTML elements where only one of them can be open at the same time.
---

<Header title="Accordion" section="Components">
  Component for grouping <code>details</code> HTML elements where only one of them can be open at the same time.
</Header>

An accordion is a vertically stacked group of collapsible sections. HTML has already a native element for this: the `<details>` element, so is what this component uses internally. It also include JavaScript code to ensure only one section is open at a time, if you want that.

<ExampleTabs
  prefix="d1"
  :panels="{
    'Result': 'ui.Accordion.DemoResult',
    'HTML': 'ui.Accordion.DemoHTML',
    'CSS': 'ui.Accordion.DemoCSS',
  }"
/>


## Events

The `Accordion` doesn't emit or listen to any events, but the `<details>` elements inside do.

In addition to the usual events supported by HTML elements, the `<details>` element supports the `toggle` event, which is dispatched to the `<details>` element whenever its state changes between open and closed. The `Accordion` component listen to it to be able to close the other `<details>` elements when one is opened.

The `toggle` event is sent *after* the state is changed, although if the state changes multiple times before the browser can dispatch the event, the events are coalesced so that only one is sent.

```js
details.addEventListener("toggle", (event) => {
  if (details.open) {
    /* the element was toggled open */
  } else {
    /* the element was toggled closed */
  }
});
```
