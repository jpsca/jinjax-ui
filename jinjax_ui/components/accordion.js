(function(){
const SEL_ACCORDION = '.UI-Accordion'
const SEL_DETAILS = 'details'
const SEL_SUMMARY = 'summary'

const KEY_SPACE = " "
const KEY_ENTER = "Enter"

const HANDLED_KEYS = [
  KEY_SPACE,
  KEY_ENTER,
]
const ELEMENT_NODE = 1

new MutationObserver( (mutationList) => {
  mutationList.forEach( (mutation) => {
    if (mutation.type !== "childList") return
    mutation.addedNodes.forEach( (node) => {
      if (node.nodeType === ELEMENT_NODE) {
        addEvents(node)
      }
    })
  })
})
.observe(document.body, {
    subtree: true,
    childList: true,
    attributes: false,
    characterData: false
})

function addEvents (root) {
  root.querySelectorAll(`${SEL_ACCORDION} ${SEL_SUMMARY}`)
  .forEach( (node) => {
    node.addEventListener("click", handleClick)
    node.addEventListener("keydown", handleKeyDown)
  })
}

addEvents(document)

/* ----------------------------- */

function handleClick(event) {
  event.preventDefault()
  const details = event.target.closest(SEL_DETAILS)
  handleOpen(details)
}

function handleKeyDown(event) {
  if (!HANDLED_KEYS.includes(event.key)) { return }
  event.preventDefault()
  const details = event.target.closest(SEL_DETAILS)

  if ([KEY_SPACE, KEY_ENTER].includes(event.key)) {
    handleOpen(details)
    return
  }
}

function handleOpen(details) {
  if (details.open) {
    details.open = false
    return
  }
  details.open = true

  querySameLevel(details.closest(SEL_ACCORDION), SEL_DETAILS)
    .forEach(el => {
      if (el === details) { return }
      el.open = false
    })
}

function querySameLevel(parent, sel) {
  const nodes = [];
  const nested = new Set(Array.from(
    parent.querySelectorAll(`:scope ${sel} ${sel}`))
  )
  parent.querySelectorAll(sel).forEach(function(node) {
    if (nested.has(node)) { return }
    nodes.push(node)
  })
  return nodes;
}
})()
