/* globals  */
if (!atc) var atc = {}
atc.provider = (function () {
  var boxes = {}
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

  return {
    send: send,
    reload: reload,
    boxes: boxes
  }
}())

// exports the module if in a common.js env
if (typeof module === 'object' && module.exports) {
  module.exports = atc.provider
}
