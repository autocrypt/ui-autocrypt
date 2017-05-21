(function () {
  var dom;
  var pane;

  function populate (e) {
    var messages = e.detail.messages
    clear()
    appendMessages(messages)
    if (messages.length) {
      showMessages()
    }
    else {
      showMessageReplacement()
    }
  }

  function clear () {
    while (dom.msglist.hasChildNodes()) {
      dom.msglist.removeChild(dom.msglist.lastChild)
    }
  }

  function appendMessages () {
    for (let message of messages) {
      dom.msglist.appendChild(generateListEntryFromMsg(message))
    }
  }

  function generateListEntryFromMsg (msg) {
    var ret = document.createElement('tr')
    ret.classList.add('message')
    ret.onclick = function () {
      emit('showMessage', { message: msg })
    }

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

  function showMessages () {
    dom.listReplacement.style.display = 'none'
    dom.msgtable.style.display = 'table'
  }

  function showMessageReplacement() {
    dom.listReplacement.style.display = 'block'
    dom.msgtable.style.display = 'none'
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
    pane = document.getElementById('list')
    dom = getElements(
      'listReplacement', 'msgtable', 'msglist', 'username'
      )
    if (pane) {
      pane.addEventListener('populate', populate, false)
    }
  }

  document.addEventListener("DOMContentLoaded", setup)

})()
