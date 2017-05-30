/* global Event CustomEvent */

if (!atc) var atc = {}
if (!atc.setup) atc.setup = {}

atc.setup.userInterface = function () {
  var dom = {}

  function getElements () {
    var collection = {}
    for (var id of arguments) {
      collection[id] = document.getElementById(id)
    }
    return collection
  }

  // run when the dom is loaded
  function setup (event) {
    dom = getElements('username', 'to',
        'encrypted', 'encryptedRow', 'reply',
        'compose', 'list', 'view', 'preferences',
        'explanation')

    dom.list.addEventListener('selected', function (e) {
      clearCompose()
      populateList()
    })
    dom.list.addEventListener('showMessage', showMessage)

    dom.view.addEventListener('reply', function (e) {
      send(dom.compose, 'reply', e.detail)
      send(dom.compose, 'select')
    })

    dom.compose.addEventListener('toChanged', updateCompose)
    dom.compose.addEventListener('send', sendmail)

    dom.preferences.addEventListener('togglePrefer', togglePrefer)
    dom.preferences.addEventListener('toggleEnable', toggleEnable)

    dom.username.addEventListener('toggled', changeUser)

    send(dom.preferences, 'reset', atc.client)
    setUser(atc.us.current())
  }

  function showMessage (e) {
    send(dom.view, 'show', {
      message: e.detail.message,
      viewer: atc.us.current()
    })
    send(dom.view, 'select')
  }

  function populateList () {
    send(dom.list, 'populate', {messages: atc.msgs.messages})
  }

  function togglePrefer(e) {
    var prefer = e.detail.prefer
    // TODO: move into client.autocrypt model
    if (prefer === undefined) {
      delete atc.client.autocrypt.preferEncrypted
    }
    else {
      atc.client.autocrypt.preferEncrypted = prefer
    }
    atc.client.selfSyncAutocryptState()
  }

  function toggleEnable(e) {
    atc.client.enable(e.detail.enable)
  }

  function sendmail (e) {
    atc.provider.addmail(e.detail.to, e.detail.subject, e.detail.body, e.detail.encrypted)
    send(dom.list, 'select')
  }

  function clearCompose () {
    send(dom.compose, 'clear')
  }

  function updateCompose (e) {
    send(dom.compose, 'update', {
      toggle: atc.client.encryptOptionTo(e.detail.to)
    })
  }

  function clickencrypted () {
    var to = dom.to.value
    var ac = atc.client.getPeerAc(to)
    var encrypted = dom.encrypted.checked

    // FIXME: if autocrypt is disabled and we've set encrypt, prompt the user about it.
    if (encrypted && atc.client.isEnabled === false) {
      if (confirm('Please only enable Autocrypt on one device.\n\n' +
          'Are you sure you want to enable Autocrypt on this device?')) {
        atc.client.enable(true)
        setupprefs()
        updateDescription()
      } else {
        dom.encrypted.checked = false
        encrypted = false
      }
    }
    if (!atc.client.isEnabled && !dom.encrypted.disabled) {
      dom.explanation.innerText = 'enable Autocrypt to encrypt'
    } else if (encrypted && ac.preferEncrypted === false) {
      dom.explanation.innerText = to + ' prefers to receive unencrypted mail.  It might be hard for them to read.'
    } else if (!encrypted && ac.preferEncrypted === true) {
      dom.explanation.innerText = to + ' prefers to receive encrypted mail!'
    } else {
      dom.explanation.innerText = ''
    }
  }

  function changeUser () {
    atc.us.next()
    setUser(atc.us.current())
  }

  function setUser (user) {
    atc.client = atc.clients.get(user.id)
    atc.msgs.messages = []
    atc.provider.reload(user.id)

    send(dom.username, 'select', user)
    send(dom.compose, 'reset', user)
    send(dom.preferences, 'reset', atc.client)
    send(dom.list, 'select')
  }

  function send (element, type, detail) {
    var e = new CustomEvent(type, { detail: detail || {} })
    element.dispatchEvent(e)
  }

  // push setup in the inits for the DOM ready event
  if (!atc.setup.inits) atc.setup.inits = []
  atc.setup.inits.push({name: 'setup ui', setup: setup})

  return {
    clickencrypted: clickencrypted,
  }
}
