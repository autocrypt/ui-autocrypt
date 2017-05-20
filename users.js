if (!atc) var atc = {}
if (!atc.setup) atc.setup = {}
atc.setup.users = function () {
  var storage = {}
  var currentId

  function add (username, color) {
    var id = username.toLowerCase()
    if (storage[id] === undefined) {
      storage[id] = {
        name: username,
        color: color,
        id: id
      }
    }
    currentId = currentId || id
  }

  function next () {
    var ids = Object.keys(storage)
    var index = -1
    for (var x in ids) {
      if (ids[x] === currentId) {
        index = x
      }
    }
    var newindex = (Number(index) + 1) % (ids.length)
    currentId = ids[newindex]
  }

  function current () {
    return storage[currentId]
  }

  function select (name) {
    currentId = name.toLowerCase()
  }

  return {
    add: add,
    next: next,
    current: current,
    select: select
  }
}

// exports the module if in a common.js env
if (typeof module === 'object' && module.exports) {
  module.exports = atc.setup.users
}
