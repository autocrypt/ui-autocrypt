(function () {
  var dom;
  var pane;

  // run when the dom is loaded
  function setup (event) {
    pane = document.getElementById('compose')
    dom = getElements(
      'to', 'subject', 'body', 'encrypted', 'encryptedRow', 'explanation'
      )
    if (pane) {
      pane.addEventListener('clear', clear, false)
      pane.addEventListener('update', update, false)
      pane.addEventListener('reply', reply, false)
    }
  }

  function clear (e) {
    dom.to.value = ''
    dom.body.value = ''
    dom.subject.value = ''
    dom.encrypted.checked = false
  }

  function update (e) {
    var client = e.detail.client
    var to = dom.to.value
    var ac = client.getPeerAc(to)

    if (!client.isEnabled()) {
      if (ac.preferEncrypted) {
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
      if (ac.key !== undefined) {
        dom.encrypted.checked = dom.encrypted.checked || ac.preferEncrypted
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

  function getElements() {
    collection = {}
    for (id of arguments) {
      collection[id] = document.getElementById(id)
    }
    return collection
  }

  function enablecheckbox (box, enabled) {
    box.disabled = !enabled
    if (enabled) { box.parentElement.classList.remove('disabled') } else { box.parentElement.classList.add('disabled') }
  }

  document.addEventListener("DOMContentLoaded", setup)

})()
