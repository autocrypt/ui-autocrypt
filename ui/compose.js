(function () {
  var dom;
  var pane;

  function clear (e) {
    dom.to.value = ''
    dom.body.value = ''
    dom.subject.value = ''
    dom.encrypted.checked = false
  }

  function update (e) {
    var to = dom.to.value
    var client = e.detail.client
    var peer = e.detail.peer
    var toggle = {}

    function enableCheckbox (enabled) {
      var box = dom.encrypted
      box.disabled = !enabled
      if (enabled) {
        box.parentElement.classList.remove('disabled')
      } else {
        box.parentElement.classList.add('disabled')
      }
    }

    if (!client.isEnabled()) {
      if (peer.preferEncrypted) {
        toggle.visible = true
        toggle.checked = false
        toggle.enabled = true
        toggle.explanation = 'enable Autocrypt to encrypt'
      }
      else {
        toggle.visible = false
        toggle.checked = false
        toggle.enabled = false
        toggle.explanation = ''
      }
    }
    else {
      toggle.visible = true
      dom.encryptedRow.style.display = 'table-row'
      if (peer.key) {
        toggle.checked = dom.encrypted.checked || peer.preferEncrypted
        toggle.enabled = true
        toggle.explanation = ''
      }
      else {
        toggle.checked = false
        toggle.enabled = false
        if (to === '') {
          toggle.explanation = 'please choose a recipient'
        }
        else {
          toggle.explanation = 'If you want to encrypt to ' + to +
            ', ask ' + to + ' to enable Autocrypt and send you an e-mail'
        }
      }
    }
    dom.encryptedRow.style.display = toggle.visible ? 'table-row' : 'none'
    enableCheckbox(toggle.enabled)
    dom.encrypted.checked = toggle.checked
    dom.explanation.innerText = toggle.explanation

  }

  function reply(e){
    var msg = e.detail.message

    function indent (str) {
      return str.split('\n').map(function (y) { return '> ' + y }).join('\n')
    }

    dom.to.value = msg.from
    dom.subject.value = 'Re: ' + msg.subject
    dom.body.value = indent(msg.body)
    dom.encrypted.checked = dom.encrypted.checked || msg.encrypted
  }

  function send (){
    emit('send', {
      to: dom.to.value,
      subject: dom.subject.value,
      body: dom.body.value,
      encrypted: dom.encrypted.checked
    })
  }

  function toChanged (){
    emit('toChanged', { to: dom.to.value })
  }

  function emit(name, detail){
    var emitEvent = new CustomEvent(name, { detail: detail } )
    pane.dispatchEvent(emitEvent)
  }

  function getElements() {
    collection = {}
    for (id of arguments) {
      collection[id] = document.getElementById(id)
    }
    return collection
  }

  // run when the dom is loaded
  function setup (event) {
    pane = document.getElementById('compose')
    dom = getElements(
      'to', 'subject', 'body', 'encrypted', 'encryptedRow', 'explanation',
      'send'
      )
    if (pane) {
      pane.addEventListener('clear', clear, false)
      pane.addEventListener('update', update, false)
      pane.addEventListener('reply', reply, false)
      pane.addEventListener("selected", dom.to.focus, false)
      pane.addEventListener("selected", toChanged, false)
    }

    dom.send.addEventListener('click', send, false)
    dom.to.addEventListener('change', toChanged, false)
  }

  document.addEventListener("DOMContentLoaded", setup)

})()
