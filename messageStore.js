if (!atc) var atc = {}
if (!atc.setup) atc.setup = {}
atc.setup.createMailStore = function () {
  // test for local storage and make a ref to it if true
  var storage = atc.provider.storage


  var usersMailsStore = {}

  // if there is a storage build initial store from it
  if (storage) {
    for (var key in storage) {
      var userData = locGet(key, storage)
      usersMailsStore[key] = userData
    }
  }

  function createUser (user) {
    var uName = user.toLowerCase()
    if (usersMailsStore[uName]) return
    usersMailsStore[uName] = createUserStore()
  }

  function createUserStore (uName) {
    if (storage && storage[uName] !== undefined) {
      return locGet(uName, storage)
    } else return {inbox: [], outbox: []}
  }

  function locSet (user, data, locStore) {
    locStore.setItem(user.toLowerCase(), JSON.stringify(data))
  }
  function locGet (user, locStore) {
    return JSON.parse(locStore[user.toLowerCase()])
  }

  function getMails (user) {
    var uName = user.toLowerCase()
    if (!usersMailsStore[uName]) return createUserStore(uName)
    else return usersMailsStore[uName]
  }

  function sendMail (msg) {
    var from = msg.from.toLowerCase()
    var to = msg.to.toLowerCase()
    // test if the user boxes exist, and create them if not
    if (!usersMailsStore[to]) usersMailsStore[to] = createUserStore()
    if (!usersMailsStore[from]) usersMailsStore[from] = createUserStore()

    // push mail in inbox
    usersMailsStore[to].inbox.push(msg)
    usersMailsStore[from].outbox.push(msg)
    // set if localstorage if available
    if (storage) locSet(from, getMails(from), storage)
  }

  return {
    msgStore: usersMailsStore,
    createUser: createUser,
    getMail: getMails,
    sendMail: sendMail,
    storage: storage
  }
}

atc.setup.init = function (atcO) {
  atcO.msgStore = this.createMailStore()
}
