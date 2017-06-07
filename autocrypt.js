/* globals  atc */
// javascript implementation of essential Autocrypt UI

atc.setup.atc = function (atcO) {
  atc.msgs.messages = []
  console.log(atc.provider.boxes)
  function resetClient () {
    // messages for the current user
    atcO.msgs.messages = atc.provider.makeUserMsgStore('Alice')
    console.log('atcO.msgs.messages')
    console.log(atcO.msgs.messages)

    // atcO.provider.clearStorage()
    atcO.us = atc.setup.users()
    atcO.us.add('Alice', 'green')
    atcO.us.add('Bob', 'darkorange')

    atcO.clients = atc.setup.clients()
    // cs = atc.setup.clients()
  }
  return {
    resetClient: resetClient
  }
}
