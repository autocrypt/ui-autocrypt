/* globals atc, Tests */
/* unit test for collections */

(function collectionTests (atcO, describe) {
  describe('Collection', function (it, assert) {
    var us

    this.setup = function () {
      us = atcO.setup.collection()
      us.add('Alice', {color: 'green'})
      us.add('Bob', {color: 'darkorange'})
    }

    it('starts with Alice', function () {
      assert.equal('Alice', us.current().name)
    })

    it('switches to Bob', function () {
      us.next()
      assert.equal('Bob', us.current().name)
    })

    it('allows selecting Bob', function () {
      us.select('Bob')
      assert.equal('darkorange', us.current().color)
    })

    it('switches back to Alice', function () {
      us.next()
      us.next()
      assert.equal('Alice', us.current().name)
    })

    it('has constant ids for the same element', function () {
      var id = us.current().id
      us.next()
      us.next()
      assert.equal(id, us.current().id)
    })

    it('has different ids for different elements', function () {
      var id = us.current().id
      us.next()
      assert.notEqual(id, us.current().id)
    })
  })
})(atc, Tests.describe)

