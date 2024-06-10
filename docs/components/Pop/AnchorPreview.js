document.addEventListener("DOMContentLoaded", function () {
  const root = document.getElementById("pop-anchor-example");
  let popovers = Array.from(root.querySelectorAll(".ui-pop"));

  function showPopovers() {
    const pop = popovers.pop();
    pop.showPopover();
    if (popovers.length) {
      setTimeout(showPopovers, 100);
    }
  }
  showPopovers();
});