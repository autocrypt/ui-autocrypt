/* globals Tests */
if (!atc) var atc = {}
atc.setup.init = function (atcO) {
  atc.setup.userInterface(atcO)
  atcO.us = atc.setup.users()
  atcO.msgs = atc.setup.createMailStore(atcO)
  atcO.ac = atc.setup.atc(atcO)
}
atc.setup.ready = function (e) {
  var dbg = true // debug log seq and run tests
  atc.ac.resetClient()
  // loop over the setup inits
  if (atc.setup.inits.length > 0) {
    var inits = atc.setup.inits
    if (dbg === true) console.log(inits)
    inits.forEach(function (init) {
      if (dbg === true) console.log(init.name)
      init.setup(e)
    })
  }
  // things to do once all setup ran
  if (dbg === true) console.log('%cinit loop done', 'color:green')

  if (dbg === true) console.log('%cinit done', 'color:green')
  // if (dbg === true) Tests.run()
}
atc.setup.init(atc)
document.addEventListener('DOMContentLoaded', atc.setup.ready)
