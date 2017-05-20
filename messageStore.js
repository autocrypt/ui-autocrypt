/* globals localStorage */
if (!atc) var atc = {}
if (!atc.setup) atc.setup = {}
atc.setup.createMailStore = function () {
  // test for local storage and make a ref to it if true
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


  var usersMailsStore = {}

  // if there is a storage build initial store from it
  if (storage) {
    for (var key in storage) {
      var userData = locGet(key, storage)
      usersMailsStore[key] = userData
    }
  }
  console.log(storage)

  function createUser (user) {
    var uName = user.toLowerCase()
    if (!usersMailsStore[uName]) usersMailsStore[uName] = createUserStore()
    else {
      console.log('userExist', uName)
    }
  }

  function createUserStore (uName) {
    var store
    if (storage && storage[uName] !== undefined) {
      store = locGet(uName, storage)
    } else store = {inbox: [], outbox: []}
    return store
  }

  function locSet (user, data, locStore) {
    locStore.setItem(user.toLowerCase(), JSON.stringify(data))
    console.log(locStore)
  }
  function locGet (user, locStore) {
    return JSON.parse(locStore[user.toLowerCase()])
  }

  function getMails (user) {
    var uName = user.toLowerCase()
    if (!usersMailsStore[uName]) {
      console.log('newUserMail')
      return createUserStore(uName)
    } else return usersMailsStore[uName]
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
