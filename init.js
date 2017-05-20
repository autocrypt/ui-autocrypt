if (!atc) var atc = {}
atc.ready = function (atcO) {
  atcO.msgs = this.setup.createMailStore(atcO)
  console.log(us.current())
}

document.addEventListener('DOMContentLoaded', atc.ready(atc))

