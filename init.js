if (!atc) var atc = {}
atc.ready = function (e) {
  var verb = true // debug log seq
  // loop over the setup inits
  if (atc.setup.inits.length > 0) {
    var inits = atc.setup.inits
    if (verb === true) console.log(inits)
    inits.forEach(function (init) {
      if (verb === true) console.log(init.name)
      init.setup(e)
    })
  }
  // things to do once all setup ran
  atc.msgs = atc.setup.createMailStore(atc)
  if (verb === true) console.log('init done')
}

document.addEventListener('DOMContentLoaded', atc.ready)

