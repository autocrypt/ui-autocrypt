if (!atc) var atc = {}
atc.ready = function (atcO) {
  atcO.msgStore = this.createMailStore(atcO)
}

document.addEventListener('DOMContentLoaded', atc.ready(atc))

