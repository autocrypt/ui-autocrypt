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
    dom = getElements('more', 'username', 'from', 'to',
        'encrypted', 'encryptedRow', 'showmore', 'reply', 'yes', 'no', 'enable',
        'compose', 'list', 'view', 'preferences',
        'description', 'explanation', 'settings')

    dom.list.addEventListener('selected', function (e) {
      clearCompose()
      populateList()
    })
    dom.list.addEventListener('showMessage', showMessage)

    dom.view.addEventListener('reply', function (e) {
      // just reusing the event triggers an InvalidStateError.
      // so let's have a new one...
      var reply = new CustomEvent('reply', {
        detail: e.detail
      })
      var select = new Event('select')
      dom.compose.dispatchEvent(reply)
      dom.compose.dispatchEvent(select)
    })

    dom.compose.addEventListener('toChanged', updateCompose)
    dom.compose.addEventListener('send', sendmail)

    dom.username.addEventListener('toggled', changeUser)

    updateDescription()
    setUser(atc.us.current())
  }

  function showMessage (e) {
    var show = new CustomEvent('show', {
      detail: e.detail
    })
    var select = new Event('select')
    dom.view.dispatchEvent(show)
    dom.view.dispatchEvent(select)
  }

  function populateList () {
    var populate = new CustomEvent('populate', {
      detail: {messages: atc.msgs.messages}
    })
    dom.list.dispatchEvent(populate)
  }

  function sendmail (e) {
    var select = new Event('select')
    atc.provider.addmail(e.detail.to, e.detail.subject, e.detail.body, e.detail.encrypted)
    dom.list.dispatchEvent(select)
  }

  function clearCompose () {
    dom.compose.dispatchEvent(new Event('clear'))
  }

  function updateCompose (e) {
    var update = new CustomEvent('update', {
      detail: {
        toggle: atc.client.encryptOptionTo(e.detail.to)
      }
    })
    dom.compose.dispatchEvent(update)
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

  function autocryptPreference (p) {
    var other
    if (p === 'yes') {
      other = 'no'
    } else {
      other = 'yes'
      p = 'no'
    }
    dom[other].checked = false
    if (dom.yes.checked) {
      atc.client.autocrypt.preferEncrypted = true
    } else if (dom.no.checked) {
      atc.client.autocrypt.preferEncrypted = false
    } else {
      delete atc.client.autocrypt.preferEncrypted
    }
    atc.client.selfSyncAutocryptState()
    updateDescription()
  }

  function autocryptEnable () {
    atc.client.enable(dom.enable.checked)
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

  function changeUser () {
    atc.us.next()
    setUser(atc.us.current())
  }

  function setUser (user) {
    var selectUser = new CustomEvent('select', { detail: user })
    var select = new Event('select')

    dom.username.dispatchEvent(selectUser)
    atc.client = atc.clients.get(user.id)
    atc.msgs.messages = []
    console.log(atc.msgs.msgStore)
    atc.provider.reload(user.id)

    // TODO: use events on the relevant panes to achieve this.
    dom.from.innerText = user.name
    setupprefs()
    dom.showmore.checked = false
    dom.list.dispatchEvent(select)
    updateDescription()
  }

  function setupprefs () {
    dom.enable.checked = atc.client.isEnabled()
    if (atc.client.autocrypt.preferEncrypted === undefined) {
      dom.yes.checked = false
      dom.no.checked = false
    } else if (atc.client.autocrypt.preferEncrypted === true) {
      dom.yes.checked = true
      dom.no.checked = false
    } else if (atc.client.autocrypt.preferEncrypted === false) {
      dom.yes.checked = false
      dom.no.checked = true
    }
  }

  // push setup in the inits for the DOM ready event
  if (!atc.setup.inits) atc.setup.inits = []
  atc.setup.inits.push({name: 'setup ui', setup: setup})

  return {
    updateDescription: updateDescription,
    autocryptEnable: autocryptEnable,
    autocryptPreference: autocryptPreference,
    clickencrypted: clickencrypted,
    more: more
  }
}
