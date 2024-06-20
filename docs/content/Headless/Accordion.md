---
title: Accordion
---

<Header title="Accordion" section="Headless">
  Component for grouping <code>details</code> HTML elements where only one of them can be open at the same time.
</Header>

An accordion is a vertically stacked group of collapsible sections. HTML has already a native element for this, the `<details>` element, but it doesn't support the "only one open at a time" behavior, so we need to add some JS to make it work, and that's what this component does.

If you don't need to ensure only one section is open at a time, you don't need this component at all, just use the `<details>` element directly.

<Example
  prefix="demo"
  :tabs="{
    'Result': 'Accordion.DemoResult',
    'HTML': 'Accordion.DemoHTML',
    'CSS': 'Accordion.DemoCSS',
  }"
  bgfrom="#fcd34d"
  bgto="#fb923c"
/>


The `Accordion` is a simple wrapper plus some JS logic, so it doesn't uses any arguments and it's as accesible as the `details` element you put inside.


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
