(function(){
const SEL_ACCORDION = '[data-accordion]'
const SEL_DETAILS = 'details'
const SEL_SUMMARY = `${SEL_ACCORDION} summary`

const KEY_SPACE = " "
const KEY_ENTER = "Enter"

const HANDLED_KEYS = [
  KEY_SPACE,
  KEY_ENTER,
]

jxui.on("click", SEL_SUMMARY, handleClick)
jxui.on("keydown", SEL_SUMMARY, handleKeyDown)

function handleClick(event, summary) {
  event.preventDefault()
  const details = summary.closest(SEL_DETAILS)
  handleOpen(details)
}

function handleKeyDown(event, summary) {
  if (!HANDLED_KEYS.includes(event.key)) { return }
  event.preventDefault()
  const details = summary.closest(SEL_DETAILS)

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
