/* globals  atc */
// javascript implementation of essential Autocrypt UI
// var provider = atc.volatileProvider()
// var ui = atc.setup.userInterface(atc)
// var us = atc.setup.users()

atc.setup.atc = function (atcO) {
  atc.msgs.messages = []
  function resetClient () {
    // messages for the current user
    atcO.msgs.messages = []
    atcO.provider.clearStorage()

    atcO.us = atc.setup.collection()
    atcO.us.add('Alice', {color: 'green'})
    atcO.us.add('Bob', {color: 'darkorange'})

    atcO.dev = atc.setup.collection()
    atcO.dev.add('Laptop', {src: 'laptop.png'})
    atcO.dev.add('Phone', {src: 'smartphone.png'})

    atcO.clients = atc.setup.clients()
    // cs = atc.setup.clients()
  }
  return {
    resetClient: resetClient
  }
}
