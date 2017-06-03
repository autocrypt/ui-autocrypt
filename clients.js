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

  function get (user, device) {
    id = user + '/' + device
    if (storage[id] === undefined) {
      storage[id] = {
        id: id,
        enabled: false,
        state: {}
      }
    }
    var autocrypt = storage[id]

    function prepareOutgoing(msg) {
      var peer = getPeerAc(msg.to)
      msg.autocrypt = makeHeader()
      if (msg.encrypted) {
        msg.encryptedTo = [
          autocrypt.key,
          peer.key
        ]
      }
    }

    function decryptMessage(msg) {
      if (!msg.encrypted) { return }
      if (msg.encryptedTo.indexOf(autocrypt.key) == -1) {
        msg.body = 'The message could not be decrypted.'
        msg.unreadable = true
      }
    }

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

    function prefer (preferNow) {
      if (preferNow === undefined) {
        delete autocrypt.preferEncrypted
      }
      else {
        autocrypt.preferEncrypted = prefer
      }
      selfSyncAutocryptState()
    }

    function isEnabled () {
      return autocrypt.enabled
    }

    function preferEncrypted () {
      return (autocrypt.preferEncrypted === true)
    }

    function preferUnencrypted () {
      return (autocrypt.preferEncrypted === false)
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

    // returns the explanation for the encrypt toggle during composition
    function explain(enc) {
      var to = enc.to
      var disabled = enc.disabled
      var peer = getPeerAc(to)
      if (!isEnabled() && !enc.disabled) {
        return('enable Autocrypt to encrypt')
      }
      if (enc.checked && peer.preferEncrypted === false) {
        return(to + ' prefers to receive unencrypted mail. ' +
          'It might be hard for them to read.')
      }
      if (!enc.checked && peer.preferEncrypted === true) {
        return(to + ' prefers to receive encrypted mail!')
      }
    }


    return {
      processIncoming: processIncoming,
      prepareOutgoing: prepareOutgoing,
      decryptMessage: decryptMessage,
      explain: explain,
      enable: enable,
      prefer: prefer,
      isEnabled: isEnabled,
      preferEncrypted: preferEncrypted,
      preferUnencrypted: preferUnencrypted,
      encryptOptionTo: encryptOptionTo
    }
  }

  return {
    get: get
  }
}
