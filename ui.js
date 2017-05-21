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
    dom = getElements('more', 'listReplacement', 'msgtable',
        'username', 'from', 'to', 'subject', 'body', 'msglist',
        'encrypted', 'encryptedRow', 'showmore', 'reply', 'yes', 'no', 'enable',
        'compose', 'list', 'view', 'preferences',
        'description', 'explanation', 'settings')

    dom.encrypted.parentNode.insertBefore(img('lock'), dom.encrypted)

    dom.list.addEventListener("selected", function (e) {
      populateList()
      clearcompose()
    })

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

  function showMsg (msg) {
    var show = new CustomEvent('show', {
      detail: {message: msg}
    })
    dom.view.dispatchEvent(show)
    dom.view.dispatchEvent(select)
  }

  function populateList () {
    while (dom.msglist.hasChildNodes()) { dom.msglist.removeChild(dom.msglist.lastChild) }

    if (messages.length) {
      for (var x in messages) {
        dom.msglist.appendChild(generateListEntryFromMsg(messages[x]))
      }
      dom.listReplacement.style.display = 'none'
      dom.msgtable.style.display = 'table'
    } else {
      dom.listReplacement.style.display = 'block'
      dom.msgtable.style.display = 'none'
    }
  }

  function sendmail (e) {
    addmail(e.detail.to, e.detail.subject, e.detail.body, e.detail.encrypted)
    dom.list.dispatchEvent(select)
  }

  function clearcompose () {
    dom.compose.dispatchEvent(new Event('clear'))
  }

  function updateCompose (e) {
    var update = new CustomEvent('update', {
      detail: {
        client: client,
        peer: client.getPeerAc(e.detail.to)
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

  function generateListEntryFromMsg (msg) {
    var ret = document.createElement('tr')
    ret.classList.add('message')
    ret.onclick = function () { showMsg(msg) }

    var e = document.createElement('td')
    if (msg['encrypted']) { e.appendChild(img('lock')) }
    if (msg['to'].toLowerCase() === dom.username.innerText.toLowerCase()) {
      e.appendChild(img('back'))
    }
    if (msg['from'].toLowerCase() === dom.username.innerText.toLowerCase()) {
      e.appendChild(img('forward'))
    }
    ret.appendChild(e)

    var f = document.createElement('td')
    f.innerText = msg['from']
    ret.appendChild(f)

    var t = document.createElement('td')
    t.innerText = msg['to']
    ret.appendChild(t)

    var s = document.createElement('td')
    s.innerText = msg['subject']
    ret.appendChild(s)

    var d = document.createElement('td')
    d.innerText = msg['date']
    ret.appendChild(d)

    return ret
  }

  function img (what) {
    var index = {
      lock: 'assets/images/emblem-readonly.png',
      back: 'assets/images/back.png',
      forward: 'assets/images/forward.png'
    }
    var lock = document.createElement('img')
    lock.src = index[what]
    return lock
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
