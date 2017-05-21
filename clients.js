/* Clients - keeping track of the client state for different users
 *
 * In the long run we will have multiple clients per user.
 *
 * For now this only keeps track of the autocrypt state on the client. We
 * might want to expand this to mails on the client etc.
 *
 * */
if (!atc) var atc = {}
if (!atc.setup) atc.setup = {}
atc.setup.clients = function () {
  var storage = {}

  function get (id) {
    if (storage[id] === undefined) {
      storage[id] = {
        id: id,
        enabled: false,
        state: {}
      }
    }
    var autocrypt = storage[id]

    function makeHeader () {
      if (autocrypt.enabled === false) { return undefined }
      return { 'key': autocrypt.key,
        'preferEncrypted': autocrypt.preferEncrypted
      }
    }

    function getPeerAc (peer) {
      var ac = autocrypt.state[peer.toLowerCase()]
      ac = ac || { 'date': new Date('1970') }
      return ac
    }

    function processIncoming (msg) {
      var peer = msg.from
      var ac = getPeerAc(peer)
      var newac = {
        'date': msg.date
      }
      if (msg.autocrypt === undefined) {
        // TODO remove
      } else {
        newac.preferEncrypted = msg['autocrypt']['preferEncrypted']
        newac.key = msg['autocrypt']['key']
      }
      if (ac.date.getTime() < newac.date.getTime()) {
        autocrypt.state[peer.toLowerCase()] = newac
      }
    }

    function selfSyncAutocryptState () {
      if (autocrypt.enabled) {
        autocrypt.state[autocrypt.id] = {
          date: new Date(),
          key: autocrypt.key,
          preferEncrypted: autocrypt.preferEncrypted
        }
      } else {
        autocrypt.state[autocrypt.id] = {
          'date': new Date()
        }
      }
    }

    function enable (enableNow) {
      autocrypt.enabled = enableNow
      if (enableNow) {
        autocrypt.key = autocrypt.key || String(Math.random())
      }
      selfSyncAutocryptState()
    }

    function isEnabled () {
      return autocrypt.enabled
    }

    function encryptOptionTo (recipient) {
      var peer = getPeerAc(recipient)
      function explanation () {
        if (isEnabled()) {
          if (peer.key) { return }
          if (recipient === '') {
            return 'please choose a recipient'
          }
          return 'If you want to encrypt to ' + recipient +
            ', ask ' + recipient +
            ' to enable Autocrypt and send you an e-mail'
        }
        if (peer.preferEncrypted) {
          return 'enable Autocrypt to encrypt'
        }
      }

      return {
        visible: isEnabled() || peer.preferEncrypted,
        enabled: (isEnabled() && peer.key) || (peer.key && peer.preferEncrypted),
        preferred: isEnabled() && peer.key && peer.preferEncrypted,
        explanation: explanation() || ''
      }
    }

    return {
      autocrypt: autocrypt,
      processIncoming: processIncoming,
      makeHeader: makeHeader,
      getPeerAc: getPeerAc,
      enable: enable,
      isEnabled: isEnabled,
      selfSyncAutocryptState: selfSyncAutocryptState,
      encryptOptionTo: encryptOptionTo
    }
  }

  return {
    get: get
  }
}
