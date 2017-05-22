/* globals atc CustomEvent */
(function () {
  // the two dom elements we care about
  var name    // #username - also used to emit events
  var toggle  // #usertoggle

  function change(e) {
    name.innerText = e.detail.name
    name.style.color = e.detail.color
  }

  function toggled () {
    name.dispatchEvent(new Event('toggled'))
  }

  // run when the dom is loaded
  function setup (event) {
    name = document.getElementById('username')
    toggle = document.getElementById('usertoggle')
    if (toggle) {
      toggle.addEventListener('click', toggled, false)
    }
    name.addEventListener('select', change, false)
  }

  if (!atc.setup.inits) atc.setup.inits = []
  atc.setup.inits.push({name: 'setup user switch', setup: setup})
})()
