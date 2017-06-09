/* globals atc Event CustomEvent */
(function () {
  var dom
  var pane

  function reset (e) {
    var client = e.detail;
    dom.showmore.checked = false
    setupprefs(client)
    updateDescription()
  }

  function setupprefs (client) {
    dom.enable.checked = client.isEnabled()
    dom.yes.checked = client.preferEncrypted()
    dom.no.cheched = client.preferUnencrypted()
  }

  function autocryptPreference (e) {
    var p = e.target.value
    var other
    if (p === 'yes') {
      other = 'no'
    } else {
      other = 'yes'
      p = 'no'
    }
    dom[other].checked = false
    if (dom.yes.checked || dom.no.checked) {
      emit('togglePrefer', { prefer: dom.yes.checked })
    } else {
      emit('togglePrefer', { prefer: undefined })
    }
    updateDescription()
  }

  function transfer (e) {
    emit('setupMessage')
  }

  function autocryptEnable (e) {
    emit('toggleEnable', { enable: e.target.checked })
    updateDescription()
  }

  function updateDescription () {
    var disabled = !dom['enable'].checked
    dom.yes.disabled = disabled
    dom.no.disabled = disabled
    if (dom.showmore.checked) {
      dom.settings.style.display = 'block'
      dom.showmore.innerText = 'Hide Advanced Settings'
    } else {
      dom.settings.style.display = 'none'
      dom.showmore.innerText = 'Advanced Settings...'
    }
    if (disabled) {
      dom.yes.parentElement.classList.add('disabled')
      dom.no.parentElement.classList.add('disabled')
      dom.more.style.display = 'none'
    } else {
      dom.yes.parentElement.classList.remove('disabled')
      dom.no.parentElement.classList.remove('disabled')
      dom.more.style.display = 'block'
    }
    dom.description.innerText = getDescription()
  }

  function more () {
    dom.showmore.checked = !dom.showmore.checked
    updateDescription()
    return false
  }

  function getDescription () {
    if (!dom.enable.checked) {
      return 'Autocrypt is disabled on this device.'
    }
    if (dom.yes.checked) {
      return 'Autocrypt will encourage your peers to send you encrypted mail.'
    }
    if (dom.no.checked) {
      return 'Autocrypt will discourage your peers from sending you encrypted mail.'
    }
    return 'Autocrypt lets your peers choose whether to send you encrypted mail.'
  }

  function emit (name, detail) {
    var emitEvent = new CustomEvent(name, { detail: detail })
    pane.dispatchEvent(emitEvent)
  }

  function getElements () {
    var collection = {}
    for (var id of arguments) {
      collection[id] = document.getElementById(id)
    }
    return collection
  }

  // run when the dom is loaded
  function setup (event) {
    pane = document.getElementById('preferences')
    dom = getElements(
      'yes', 'no', 'showmore', 'more', 'description', 'enable', 'settings',
      'transfer'
      )
    if (pane) {
      pane.addEventListener('reset', reset, false)
    }
    dom.yes.addEventListener('click', autocryptPreference)
    dom.no.addEventListener('click', autocryptPreference)
    dom.showmore.addEventListener('click', more)
    dom.transfer.addEventListener('click', transfer)
    dom.enable.addEventListener('click', autocryptEnable)
  }
  if (!atc.setup.inits) atc.setup.inits = []
  atc.setup.inits.push({name: 'setup preferences', setup: setup})
})()
