/* globals atc, Tests */
/* unit test for users */

if (!tests) var tests = []
function msgTests (atcO, describe) {
  describe('Messages', function (it, assert) {
    var msgStore = atcO.msgStore.usersStore
    var mstM = atcO.msgStore
    var uName = Math.floor(Math.random() * 99 + 1).toString()
    var sampleMsg = {
      from: 'testUser',
      to: uName,
      subject: 'testMsg',
      msg: 'this is a test message'
    }

    this.setup = function () {
      mstM.createUser('testuser')
    }

    it('create a user in the mailStore', function () {
      assert.equal(mstM[uName], undefined,
          'the user should not exists yet')
      mstM.createUser(uName)
      assert.exist(uName, msgStore)
    })

    it('send an email to the store', function () {
      mstM.sendMail(sampleMsg)
      var testOut = msgStore['testuser'].outbox
      var testIn = msgStore[uName].inbox
      assert.ok(testOut.length > 0, 'outbox of testuser is empty')
      assert.ok(testIn.length > 0, 'inbox for ' + uName + ' is empty')
      assert.ok(testOut[0].subject === testIn[0].subject, 'messages in inbox and outbox differs')
    })

    it('get the mail of an existing user', function () {
      var mails = mstM.getMail(uName)
      console.log(mails)
    })
  })
}
msgTests(atc, Tests.describe)

tests.push(msgTests)
