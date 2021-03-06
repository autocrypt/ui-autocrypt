/* globals atc us CustomEvent */
(function () {
  var dom
  var pane

  // run when the dom is loaded
  function setup (event) {
    pane = document.getElementById('view')
    dom = getViewElements(
      'From', 'To', 'Subject', 'Date',
      'Body', 'Encrypted')
    dom.reply = document.getElementById('reply')

    if (pane) {
      pane.addEventListener('show', show, false)
    }
  }

  function show (e) {
    var msg = e.detail.message
    dom.from.innerText = msg.from
    dom.to.innerText = msg.to
    dom.subject.innerText = msg.subject
    dom.date.innerText = msg.date
    dom.body.innerText = msg.body
    dom.encrypted.replaceChild(getEncryptionStatusNode(msg.encrypted), dom.encrypted.childNodes[0])
    dom.reply.onclick = function () { replyToMsg(msg) }
    if (e.detail.from_me) {
      dom.reply.style.display = 'none'
    } else {
      dom.reply.style.display = 'inline'
    }
  }

  function replyToMsg (msg) {
    var reply = new CustomEvent('reply', {
      detail: {message: msg}
    })
    pane.dispatchEvent(reply)
  }

  function getEncryptionStatusNode (encrypted) {
    var x = document.createElement('span')
    if (encrypted) {
      let sub = document.createElement('span')
      let lock = document.createElement('img')
      lock.src = 'assets/images/emblem-readonly.png'
      x.appendChild(lock)
      sub.innerText = 'Message was encrypted'
      x.appendChild(sub)
    } else {
      x.innerText = 'Message was not encrypted'
    }

    return x
  }

  function getViewElements () {
    var collection = {}
    for (var id of arguments) {
      let key = id.toLowerCase()
      let domId = 'view' + id
      collection[key] = document.getElementById(domId)
    }
    return collection
  }
  if (!atc.setup.inits) atc.setup.inits = []
  atc.setup.inits.push({name: 'setup view', setup: setup})
})()
