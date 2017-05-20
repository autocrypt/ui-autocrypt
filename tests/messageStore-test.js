/* globals atc, Tests */
/* unit test for users */

if (!tests) var tests = []
function msgTests (atcO, describe) {
  describe('Messages', function (it, assert) {
    var msgStore = atcO.msgs.msgStore
    var msgs = atcO.msgs
    var uName = 'abcd'
    var sampleMsg = {
      from: 'testUser',
      to: uName,
      subject: 'testMsg',
      encrypted: false,
      body: 'this is a test message'
    }

    this.setup = function () {
      msgs.createUser('testuser')
    }

    it('create a user in the mailStore', function () {
      assert.equal(msgs[uName], undefined,
          'the user should not exists yet')
      msgs.createUser(uName)
      assert.exist(uName, msgStore)
    })

    it('send an email to the store', function () {
      msgs.sendMail(sampleMsg)
      var testOut = msgStore['testuser'].outbox
      var testIn = msgStore[uName].inbox
      assert.ok(testOut.length > 0, 'outbox of testuser is empty')
      assert.ok(testIn.length > 0, 'inbox for ' + uName + ' is empty')
      assert.ok(testOut[0].subject === testIn[0].subject, 'messages in inbox and outbox differs')
    })

    it('get the mail of an existing user', function () {
      var mails = msgs.getMail(uName)
      console.log(mails)
    })
  })
}
msgTests(atc, Tests.describe)

tests.push(msgTests)
