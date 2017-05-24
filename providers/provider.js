/* globals localStorage */
if (!atc) var atc = {}
atc.provider = (function () {
  var boxes = {}

  var storage = (function () {
    var uid = new Date()
    var result
    try {
      localStorage.setItem(uid, uid)
      result = localStorage.getItem(uid) == uid // == intended here use === to test if false
      localStorage.removeItem(uid)
      return result && localStorage
    } catch (exception) { return false /* some brower throw */ }
  }())
  function clearStorage () {
    if (storage) {
      storage.clear()
      console.log('storage cleared')
    }
  }
  function send (msg) {
    atc.msgs.sendMail(msg)
    var outbox = getMsgs(msg.from)
    var inbox = getMsgs(msg.to)
    // var sendEvnt = new CustomEvent('sendMsg', { 'detail': msg })
    inbox.push(msg)
    if (msg.to.toLowerCase() !== msg.from.toLowerCase()) {
      outbox.push(msg)
    }
    // document.dispatchEvent(sendEvnt)
    this.receive(msg)
    return true
  }
  function receive (msg) {
    atc.client.processIncoming(msg)
    atc.msgs.messages.push(msg)
  }

  function reload (name) {
    for (var x in getMsgs(name)) {
      this.receive(getMsgs(name)[x])
    }
  }

  function getMsgs (name) {
    if (boxes[name.toLowerCase()] === undefined) {
      boxes[name.toLowerCase()] = []
    };
    return boxes[name.toLowerCase()]
  }

  // document.addEventListener('sendMsg', function (e) {
  //   console.log('event:sendMsg', e.detail)
  // }, false)

  function addmail (to, subj, body, encrypted) {
    var msg = {
      from: atc.us.current().name,
      to: to,
      subject: subj,
      body: body,
      encrypted: encrypted,
      autocrypt: atc.client.makeHeader(),
      date: new Date()
    }
    atc.provider.send(msg)
    return true
  }

  return {
    send: send,
    reload: reload,
    boxes: boxes,
    storage: storage,
    addmail: addmail,
    receive: receive,
    clearStorage: clearStorage
  }
}())

// exports the module if in a common.js env
if (typeof module === 'object' && module.exports) {
  module.exports = atc.provider
}
