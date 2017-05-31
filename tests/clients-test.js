/* unit test for clients */
/* globals atc Tests */

(function () {
  var describe = Tests.describe

  describe('Clients', function (it, assert) {
    var client

    this.setup = function () {
      client = atc.setup.clients().get('me', 'laptop')
    }

    it('starts blank', function () {
      assert((client.makeHeader() === undefined),
          'Clients start without an autocrypt header')
    })

    it('can be enabled', function () {
      client.enable(true)
      assert((client.makeHeader() !== undefined),
          'Enabled clients has an autocrypt header')
    })
  })
})()
