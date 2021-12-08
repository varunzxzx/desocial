var assertRevert = async (promise, message) => {
  let noFailureMessage;
  try {
    const res = await promise;
    if (!message) {
      noFailureMessage = "Expected revert not received";
    } else {
      noFailureMessage = message;
    }

    assert.fail();
  } catch (error) {
    if (noFailureMessage) {
      assert.fail(0, 1, message);
    }
    const revertFound = error.message.search("revert") >= 0;
    assert(revertFound, `Expected "revert", got ${error} instead`);
  }
};

module.exports = assertRevert;
