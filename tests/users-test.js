/* globals atc, Tests */
/* unit test for users */

if (!tests) var tests = []
function userTests (atcO, describe) {
  describe('Users', function (it, assert) {
    var us

    this.setup = function () {
      us = atcO.users()
      us.add('Alice', 'green')
      us.add('Bob', 'darkorange')
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

    it('has constant ids for the same user', function () {
      var id = us.current().id
      us.next()
      us.next()
      assert.equal(id, us.current().id)
    })

    it('has different ids for different users', function () {
      var id = us.current().id
      us.next()
      assert.notEqual(id, us.current().id)
    })
  })
}
userTests(atc, Tests.describe)

tests.push(userTests)
