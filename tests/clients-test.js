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
      var msg = { to: 'other' }
      client.prepareOutgoing(msg)
      assert((msg.autocrypt === undefined),
          'Clients start without an autocrypt header')
    })

    it('can be enabled', function () {
      var msg = { to: 'other' }
      client.enable(true)
      client.prepareOutgoing(msg)
      assert((msg.autocrypt !== undefined),
          'Enabled clients has an autocrypt header')
    })
  })
})()
