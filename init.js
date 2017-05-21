if (!atc) var atc = {}
atc.ready = function (atcO) {
  atcO.msgs = this.setup.createMailStore(atcO)
}

document.addEventListener('DOMContentLoaded', atc.ready(atc))

