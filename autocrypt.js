/* globals   messages  clients client cs atc */
// javascript implementation of essential Autocrypt UI
// var provider = atc.volatileProvider()
var ui = atc.setup.userInterface(atc)
var us = atc.setup.users()

atc.setup.atc = function (atcO) {}

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
  atc.provider.reload(user.id)
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
  atc.provider.send(msg)
  return true
}

atc.provider.receive = function (msg) {
  client.processIncoming(msg)
  messages.push(msg)
}

function resetClient (atcO) {
  // messages for the current user
  messages = []

  us = atc.setup.users()
  us.add('Alice', 'green')
  us.add('Bob', 'darkorange')

  cs = atc.setup.clients()
};

resetClient()
