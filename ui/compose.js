/* globals atc CustomEvent */
(function () {
  var dom
  var pane

  function clear (e) {
    dom.to.value = ''
    dom.body.value = ''
    dom.subject.value = ''
    dom.encrypted.checked = false
  }

  function reset (e) {
    var user = e.detail
    dom.from.innerText = user.name
  }

  function set (e) {
    dom.explanation.innerText = e.detail.explanation
    dom.encrypted.checked = e.detail.checked
  }

  function update (e) {
    var toggle = e.detail.toggle

    function enableCheckbox (enabled) {
      var box = dom.encrypted
      box.disabled = !enabled
      if (enabled) {
        box.parentElement.classList.remove('disabled')
      } else {
        box.parentElement.classList.add('disabled')
      }
    }

    dom.encryptedRow.style.display = toggle.visible ? 'table-row' : 'none'
    enableCheckbox(toggle.enabled)
    // On replies this may already be checked. So do not uncheck.
    dom.encrypted.checked = dom.encrypted.checked || toggle.preferred
    dom.explanation.innerText = toggle.explanation
  }

  function reply (e) {
    var msg = e.detail.message

    function indent (str) {
      return str.split('\n').map(function (y) { return '> ' + y }).join('\n')
    }

    dom.to.value = msg.from
    dom.subject.value = 'Re: ' + msg.subject
    dom.body.value = indent(msg.body)
    dom.encrypted.checked = dom.encrypted.checked || msg.encrypted
  }

  function send () {
    emit('send', {
      to: dom.to.value,
      subject: dom.subject.value,
      body: dom.body.value,
      encrypted: dom.encrypted.checked
    })
  }

  function toChanged () {
    emit('toChanged', { to: dom.to.value })
  }

  function toggleEncrypted () {
    emit('toggleEncrypted', {
      to: dom.to.value,
      checked: dom.encrypted.checked,
      disabled: dom.encrypted.disabled
    })
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
    pane = document.getElementById('compose')
    dom = getElements(
      'from', 'to', 'subject', 'body',
      'encrypted', 'encryptedRow', 'explanation',
      'send'
      )
    if (pane) {
      pane.addEventListener('clear', clear, false)
      pane.addEventListener('reset', reset, false)
      pane.addEventListener('update', update, false)
      pane.addEventListener('set', set, false)
      pane.addEventListener('reply', reply, false)
      pane.addEventListener('selected', dom.to.focus, false)
      pane.addEventListener('selected', toChanged, false)
    }

    dom.encrypted.addEventListener('click', toggleEncrypted, false)
    dom.send.addEventListener('click', send, false)
    dom.to.addEventListener('change', toChanged, false)

    var lock = document.createElement('img')
    lock.src = 'assets/images/emblem-readonly.png'
    dom.encrypted.parentNode.insertBefore(lock, dom.encrypted)
  }
  if (!atc.setup.inits) atc.setup.inits = []
  atc.setup.inits.push({name: 'setup compose', setup: setup})
})()
