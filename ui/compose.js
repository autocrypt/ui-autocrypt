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

    function enablecheckbox (box, enabled) {
      box.disabled = !enabled
        if (enabled) { box.parentElement.classList.remove('disabled') } else { box.parentElement.classList.add('disabled') }
    }

    if (!client.isEnabled()) {
      if (peer.preferEncrypted) {
        dom.encryptedRow.style.display = 'table-row'
        dom.encrypted.checked = false
        enablecheckbox(dom.encrypted, true)
        dom.explanation.innerText = 'enable Autocrypt to encrypt'
      } else {
        dom.encryptedRow.style.display = 'none'
        dom.encrypted.checked = false
      }
    } else {
      dom.encryptedRow.style.display = 'table-row'
      if (peer.key !== undefined) {
        dom.encrypted.checked = dom.encrypted.checked || peer.preferEncrypted
        enablecheckbox(dom.encrypted, true)
        dom.explanation.innerText = ''
      } else {
        dom.encrypted.checked = false
        enablecheckbox(dom.encrypted, false)
        if (to === '') { dom.explanation.innerText = 'please choose a recipient' } else { dom.explanation.innerText = 'If you want to encrypt to ' + to + ', ask ' + to + ' to enable Autocrypt and send you an e-mail' }
      }
    }
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
