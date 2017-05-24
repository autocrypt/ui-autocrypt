/* global Tests Event localStorage resetClient changeUser */
(function () {
  var describe = Tests.describe

  function click (id) {
    document.getElementById(id).click()
  }

  function enableAutocrypt () {
    click('tab-preferences')
    click('enable')
  }

  function composeTo (recipient) {
    click('tab-compose')
    document.getElementById('to').value = recipient
    document.getElementById('to').dispatchEvent(new Event('change'))
    document.getElementById('subject').value = 'subject'
    document.getElementById('body').value = 'body'
  }

  function sleep (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  function checkEncrypt () {
    click('encrypted')
  }

  function send () {
    click('send')
  }

  function switchUser () {
    click('usertoggle')
  }

  describe('Smoke test', function (it, assert) {
    function assertHasEncryptedEmail () {
      click('tab-list')
      assert.selector('#msgtable img[src*="readonly"]')
    }

    this.setup = function () {
      try {
        localStorage.clear()
      } catch (err) {}
      resetClient()
      // make sure user display is okay and we are set on alice
      switchUser()
      switchUser()
    }

    it('autocrypts when enabled', async function () {
      enableAutocrypt()
      composeTo('Bob')
      send()
      switchUser()
      enableAutocrypt()
      composeTo('Alice')
            // work around a firefox bug that prevents clicking an
            // element that was just enabled.
      await sleep(10)
      checkEncrypt()
      send()
      assertHasEncryptedEmail()
    })
  })
})()
