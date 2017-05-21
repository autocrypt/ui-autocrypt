/* global messages addmail confirm client user us */
console.log('ui v0.0.6')

function userInterface () {
  var dom = {}
  var select = new Event('select')

  function getElements() {
    collection = {}
    for (id of arguments) {
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

    dom.list.addEventListener("selected", function (e) {
      clearCompose()
      populateList()
    })
    dom.list.addEventListener("showMessage", showMessage)

    dom.view.addEventListener("reply", function (e) {
      // just reusing the event triggers an InvalidStateError.
      // so let's have a new one...
      var reply = new CustomEvent('reply', {
        detail: e.detail
      })
      dom.compose.dispatchEvent(reply)
      dom.compose.dispatchEvent(select)
    })

    dom.compose.addEventListener("toChanged", updateCompose)
    dom.compose.addEventListener("send", sendmail)

    changeUser('Alice')
    updateDescription()
  }

  function showMessage (e) {
    var show = new CustomEvent('show', {
      detail: e.detail
    })
    dom.view.dispatchEvent(show)
    dom.view.dispatchEvent(select)
  }

  function populateList () {
    var populate = new CustomEvent('populate', {
      detail: {messages: messages}
    })
    dom.list.dispatchEvent(populate)
  }

  function sendmail (e) {
    addmail(e.detail.to, e.detail.subject, e.detail.body, e.detail.encrypted)
    dom.list.dispatchEvent(select)
  }

  function clearCompose () {
    dom.compose.dispatchEvent(new Event('clear'))
  }

  function updateCompose (e) {
    var update = new CustomEvent('update', {
      detail: {
        toggle: client.encryptOptionTo(e.detail.to)
      }
    })
    dom.compose.dispatchEvent(update)
  }

  function clickencrypted () {
    var to = dom.to.value
    var ac = client.getPeerAc(to)
    var encrypted = dom.encrypted.checked

    // FIXME: if autocrypt is disabled and we've set encrypt, prompt the user about it.
    if (encrypted && client.isEnabled === false) {
      if (confirm('Please only enable Autocrypt on one device.\n\n' +
          'Are you sure you want to enable Autocrypt on this device?')) {
        client.enable(true)
        setupprefs()
        updateDescription()
      } else {
        dom.encrypted.checked = false
        encrypted = false
      }
    }
    if (!client.isEnabled && !dom.encrypted.disabled) {
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
      client.autocrypt.preferEncrypted = true
    } else if (dom.no.checked) {
      client.autocrypt.preferEncrypted = false
    } else {
      delete client.autocrypt.preferEncrypted
    }
    console.log('prefer encrypted set to:', client.autocrypt.preferEncrypted)
    client.selfSyncAutocryptState()
    updateDescription()
  }

  function autocryptEnable () {
    client.enable(dom.enable.checked)
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

  function switchuser (user) {
    dom.username.innerText = user.name
    dom.username.style.color = user.color
    dom.from.innerText = user.name
    setupprefs()
    dom.showmore.checked = false
    dom.list.dispatchEvent(select)
    updateDescription()
  }

  function setupprefs () {
    dom.enable.checked = client.isEnabled()
    if (client.autocrypt.preferEncrypted === undefined) {
      dom.yes.checked = false
      dom.no.checked = false
    } else if (client.autocrypt.preferEncrypted === true) {
      dom.yes.checked = true
      dom.no.checked = false
    } else if (client.autocrypt.preferEncrypted === false) {
      dom.yes.checked = false
      dom.no.checked = true
    }
  }

  document.addEventListener("DOMContentLoaded", setup)

  return {
    updateDescription: updateDescription,
    switchuser: switchuser,
    autocryptEnable: autocryptEnable,
    autocryptPreference: autocryptPreference,
    clickencrypted: clickencrypted,
    more: more
  }
}

function why () {
  console.log('why placeholder')
}

// exports the module if in a common.js env
if (typeof module === 'object' && module.exports) {
  module.exports = userInterface
} else {
  window.userInterface = userInterface
}
