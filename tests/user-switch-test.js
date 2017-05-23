/* global Tests */
(function () {
  var describe = Tests.describe

  describe('User switch', function (it, assert) {
    var usertoggle = document.getElementById('usertoggle')
    this.setup = function () {
      atc.ac.resetClient()
      // make sure user display is okay and we are set on alice
      usertoggle.click()
      usertoggle.click()
    }
    it('starts with Alice', function () {
      assert.content('Alice', 'username')
    })
    it('switches to Bob', function () {
      usertoggle.click()
      assert.content('Bob', 'username')
    })
    it('switches back to Alice', function () {
      usertoggle.click()
      usertoggle.click()
      assert.content('Alice', 'username')
    })
  })
})()
