/* global Tests Event localStorage atc */
(function () {
  var describe = Tests.describe

  function click (id) {
    document.getElementById(id).click()
  }

  function enableAutocrypt () {
    click('tab-preferences')
    click('enable')
    click('initial')
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

  function switchDevice () {
    click('devicetoggle')
  }

  function sendSetupMail () {
    click('tab-preferences')
    click('transfer')
  }

  function setupMulti () {
    click('enable')
    click('multi')
    click('finish')
  }

  describe('Smoke test', function (it, assert) {
    function assertCanReadEncryptedEmail () {
      click('tab-list')
      var elem = document.querySelector('#msgtable img[src*="readonly"]')
      elem.click()
      assert.content('Message was encrypted', 'viewEncrypted')
      assert.content('body', 'viewBody')
    }

    this.setup = function () {
      try {
        localStorage.clear()
      } catch (err) {}
      atc.ac.resetClient()
      // make sure user display is okay and we are set on alice
      switchUser()
      switchUser()
    }

    // full lucky path...
    // setup autocrypt for both users,
    // setup multidevice for alice,
    // read encrypted email on second device
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
      switchUser()
      sendSetupMail()
      switchDevice()
      setupMulti()
      assertCanReadEncryptedEmail()
    })
  })
})()
