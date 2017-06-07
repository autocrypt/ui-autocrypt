/* globals atc CustomEvent */
(function () {
  // the two dom elements we care about
  var device  // #device - also used to emit events
  var toggle  // #devicetoggle

  function change (e) {
    device.src = 'assets/images/' + e.detail.src
    device.alt = e.detail.name
  }

  function toggled () {
    device.dispatchEvent(new Event('toggled'))
  }

  // run when the dom is loaded
  function setup (event) {
    device = document.getElementById('device')
    toggle = document.getElementById('devicetoggle')
    if (toggle) {
      toggle.addEventListener('click', toggled, false)
    }
    device.addEventListener('select', change, false)
  }

  if (!atc.setup.inits) atc.setup.inits = []
  atc.setup.inits.push({device: 'setup device switch', setup: setup})
})()
