/* global Event */
if (!atc) var atc = {}
function Panes (atcO) {
  var panes = {}

  function getElements () {
    var collection = {}
    for (var id of arguments) {
      collection[id] = document.getElementById(id)
    }
    return collection
  }


  // run when the dom is loaded
  function setup (event) {
    panes = getElements('compose', 'list', 'msgView', 'preferences')
    if (!atc.DOM) atc.DOM = {}
    atc.DOM.panes = panes
    console.log(atc)
    function assignListener (id) {
      var link = document.getElementById('tab-' + id)
      if (link) {
        link.addEventListener('click', function () {
          return select(id)
        }, false)
      }
    }
    Object.keys(panes).forEach(assignListener)
  }

  var selected = new Event('selected')

  function select (choice) {
    for (var x in panes) {
      panes[x].style.display = 'none'
      var e = document.getElementById('tab-' + x)
      if (e) {
        e.classList.remove('selected')
      }
    }
    panes[choice].style.display = 'block'
    var n = 'tab-' + choice
    e = document.getElementById(n)
    if (e) {
      e.classList.add('selected')
      e.dispatchEvent(selected)
    }
  }

  return {
    setup: setup,
    select: select
  }
}

// exports the module if in a common.js env
if (typeof module === 'object' && module.exports) {
  module.exports = Panes
} else {
  atc.uiPanes = Panes
}
