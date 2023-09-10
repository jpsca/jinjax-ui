(function(){
const SEL_ACCORDION = "[data-accordion]"
const SEL_DETAILS = "details"
const SEL_DETAILS_IN_ACCORDION = `${SEL_ACCORDION} ${SEL_DETAILS}`
const SEL_DETAILS_SCOPED = `${SEL_DETAILS}:not(:scope ${SEL_DETAILS} ${SEL_DETAILS})`

jxui.on("toggle", SEL_DETAILS_IN_ACCORDION, handleToggle)


function handleToggle(event, details) {
  if (details.open) {
    closeOthers(details)
  }
}

function closeOthers(details) {
  details
    .closest(SEL_ACCORDION)
    .querySelectorAll(SEL_DETAILS_SCOPED)
    .forEach((det) => {
    if (det !== details) {
      det.removeAttribute("open")
    }
  })
}

})()
