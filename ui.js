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
    dom = getElements('username', 'device', 'to',
        'compose', 'list', 'view', 'preferences', 'setup',
        'explanation')

    dom.list.addEventListener('showMessage', showMessage)
    dom.list.addEventListener('selected', function (e) {
      clearCompose()
      populateList()
    })

    dom.view.addEventListener('reply', function (e) {
      send(dom.compose, 'reply', e.detail)
      send(dom.compose, 'select')
    })

    dom.compose.addEventListener('toChanged', updateCompose)
    dom.compose.addEventListener('send', sendmail)

    dom.preferences.addEventListener('togglePrefer', togglePrefer)
    dom.preferences.addEventListener('toggleEnable', toggleEnable)
    dom.preferences.addEventListener('setupMessage', setupMessage)

    dom.setup.addEventListener('initialSetup', initialSetup)
    dom.setup.addEventListener('multiSetup', multiSetup)
    dom.setup.addEventListener('multiImport', multiImport)

    dom.username.addEventListener('toggled', changeUser)
    dom.device.addEventListener('toggled', changeDevice)

    initClient()
  }

  function showMessage (e) {
    var message = e.detail.message;
    atc.client.decryptMessage(message)
    var from_me = (message.from == atc.us.current().name)
    send(dom.view, 'show', {
      message: message,
      from_me: from_me
    })
    send(dom.view, 'select')
  }

  function populateList () {
    send(dom.list, 'populate', {messages: atc.msgs.messages})
  }

  function togglePrefer(e) {
    atc.client.prefer(e.detail.prefer)
  }

  function toggleEnable(e) {
    if (e.detail.enable) {
      send(dom.setup, 'select')
    }
    else {
      atc.client.enable(e.detail.enable)
    }
  }

  function initialSetup(e) {
    atc.client.enable(true)
    send(dom.preferences, 'select')
  }

  function multiSetup(e) {
    if (atc.client.hasSetupMail()) {
      send(dom.setup, 'import')
    } else
    {
      send(dom.setup, 'check')
    }
  }

  function multiImport(e) {
    atc.client.importSecretKey()
    send(dom.list, 'select')
  }

  function sendmail (e) {
    var msg = {
      from: atc.us.current().name,
      to: e.detail.to,
      subject: e.detail.subject,
      body: e.detail.body,
      encrypted: e.detail.encrypted,
      date: new Date()
    }
    atc.client.prepareOutgoing(msg)
    atc.provider.send(msg)
    send(dom.list, 'select')
  }

  function setupMessage (e) {
    var msg = {
      from: atc.us.current().name,
      to: atc.us.current().name,
      subject: 'Autocrypt Setup Message',
      body: 'This message allows setting up autocrypt using the setup code',
      date: new Date(),
      encrypted: false,
      setupMessage: true
    }
    atc.client.prepareOutgoing(msg)
    atc.provider.send(msg)
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

  function toggleEncrypted (e) {
    var enc = e.detail

    if (enc.checked && atc.client.isEnabled() === false) {
      if (confirm('Please only enable Autocrypt on one device.\n\n' +
          'Are you sure you want to enable Autocrypt on this device?')) {
        atc.client.enable(true)
        send(dom.preferences, 'reset', atc.client)
      } else {
        enc.checked = false
      }
    }

    send(dom.compose, 'set', {
      explanation: atc.client.explain(enc) || '',
      checked: enc.checked
    })
  }

  function changeDevice () {
    atc.dev.next()
    send(dom.device, 'select', atc.dev.current())
    initClient()
  }

  function changeUser () {
    atc.us.next()
    send(dom.username, 'select', atc.us.current())
    initClient()
  }

  function initClient () {
    var user = atc.us.current()
    var device = atc.dev.current()
    atc.client = atc.clients.get(user.id, device.id)
    atc.msgs.messages = []
    // console.log(atc.msgs.msgStore)
    atc.provider.reload(user.id)

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
}
