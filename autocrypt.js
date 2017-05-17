/* globals  volatileProvider messages userInterface clients client cs*/
if (!atc) var atc = {}

// javascript implementation of essential Autocrypt UI
var provider = volatileProvider

var ui = userInterface(atc)
var us = atc.users()

var autocryptSwitch = function (isEnabled) {
  client.enable(isEnabled)
}

var changeUser = function (name) {
  if (name) {
    us.select(name)
  } else {
    us.next()
  }
  switchuser(us.current())
  return false
}

var switchuser = function (user) {
  client = cs.get(user.id)
  messages = []
  provider.reload(user.id)
  ui.switchuser(user)
}

var addmail = function (to, subj, body, encrypted) {
  var msg = {
    from: us.current().name,
    to: to,
    subject: subj,
    body: body,
    encrypted: encrypted,
    autocrypt: client.makeHeader(),
    date: new Date()
  }
  provider.send(msg)
  return true
}

provider.receive = function (msg) {
  client.processIncoming(msg)
  messages.push(msg)
}

function resetClient (atcO) {
    // messages for the current user
  messages = []

  us = atc.users()
  us.add('Alice', 'green')
  us.add('Bob', 'darkorange')

  cs = clients()
};

resetClient()
