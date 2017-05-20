/* globals localStorage */
if (!atc) var atc = {}
if (!atc.setup) atc.setup = {}
atc.setup.createMailStore = function (atcO) {
  var storage = (function () {
    var uid = new Date()
    var result
    try {
      localStorage.setItem(uid, uid)
      result = localStorage.getItem(uid) === uid
      console.log(localStorage)
      localStorage.removeItem(uid)
      return result && localStorage
    } catch (exception) {}
  }())
  var usersMailsStore = {}
  function createUser (user) {
    var uName = user.toLowerCase()
    if (!usersMailsStore[uName]) usersMailsStore[uName] = createUserStore()
    else {
      console.log('userExist', uName)
    }
  }
  function createUserStore () {
    return {inbox: [], outbox: []}
  }
  function getMails (user) {
    var uName = user.toLowerCase()
    if (!usersMailsStore[uName]) {
      console.log('newUserMail')
      return createUserStore()
    } else return usersMailsStore[uName]
  }

  function sendMail (msg) {
    // test if the user boxes exist, and create them if not
    if (!usersMailsStore[msg.to.toLowerCase()]) usersMailsStore[msg.to.toLowerCase()] = createUserStore()
    if (!usersMailsStore[msg.from.toLowerCase()]) usersMailsStore[msg.from.toLowerCase()] = createUserStore()

    // push mail in inbox
    usersMailsStore[msg.to.toLowerCase()].inbox.push(msg)
    usersMailsStore[msg.from.toLowerCase()].outbox.push(msg)
  }

  return {
    usersStore: usersMailsStore,
    createUser: createUser,
    getMail: getMails,
    sendMail: sendMail,
    storage: storage
  }
}

atc.setup.init = function (atcO) {
  atcO.msgStore = this.createMailStore()
}
