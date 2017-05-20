/* globals CustomEvent */
if (!atc) var atc = {}
atc.provider = (function () {
  console.log('test provider 0.0.3')
  var boxes = {}
  function send (msg) {
    atc.msgStore.sendMail(msg)
    var outbox = messages(msg.from)
    var inbox = messages(msg.to)
    // var sendEvnt = new CustomEvent('sendMsg', { 'detail': msg })
    inbox.push(msg)
    if (msg.to.toLowerCase() !== msg.from.toLowerCase()) {
      outbox.push(msg)
    }
    // document.dispatchEvent(sendEvnt)
    this.receive(msg)
    return true
  }

  function reload (name) {
    for (var x in messages(name)) {
      this.receive(messages(name)[x])
    }
  }

  function messages (name) {
    if (boxes[name.toLowerCase()] === undefined) {
      boxes[name.toLowerCase()] = []
    };
    return boxes[name.toLowerCase()]
  }

  // document.addEventListener('sendMsg', function (e) {
  //   console.log('event:sendMsg', e.detail)
  // }, false)

  return {
    send: send,
    reload: reload,
    boxes: boxes
  }
}())

// exports the module if in a common.js env
if (typeof module === 'object' && module.exports) {
  module.exports = atc.volatileProvider
}
