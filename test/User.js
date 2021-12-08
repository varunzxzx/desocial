const Users = artifacts.require("../contracts/Users.sol");
const ethers = require("ethers");
const assertRevert = require("./utils/assertRevert");
contract("Users", function (accounts) {
  let users;

  beforeEach(async () => {
    users = await Users.new();
  });

  it("should create user", async function () {
    await users.signup(ethers.utils.formatBytes32String("Varun"), "Yo boi!!");
  });

  it("should not create same user more than once", async function () {
    await users.signup(ethers.utils.formatBytes32String("Harry"), "Yo boi");
    await assertRevert(
      users.signup(ethers.utils.formatBytes32String("Harry"), "Yoss"),
      "Multiple user created with same address"
    );
  });

  it("should fetch all users", async function () {
    // Create two users
    await users.signup(ethers.utils.formatBytes32String("Harry"), "Yo Bois", {
      from: accounts[1],
    });
    await users.signup(ethers.utils.formatBytes32String("Ron"), "Yo Bois", {
      from: accounts[2],
    });

    const res = await users.fetchAllUsers();
    assert(res.length === 2);
    assert(res[0].uAddress === accounts[1]);
    assert(res[1].uAddress === accounts[2]);
  });

  it("should follow user", async function () {
    // Create two users
    await users.signup(ethers.utils.formatBytes32String("Harry"), "Yo Bois", {
      from: accounts[3],
    });
    const user1 = await users.fetchUserByAddress({
      from: accounts[3],
    });

    await users.signup(ethers.utils.formatBytes32String("Ron"), "yo bois", {
      from: accounts[4],
    });
    const user2 = await users.fetchUserByAddress({
      from: accounts[4],
    });
    await users.followUser(user2.id, { from: accounts[3] });

    const res = await users.fetchUserByAddress({ from: accounts[3] });
    const res1 = await users.fetchUserByAddress({ from: accounts[4] });

    console.log(res, res1);
    // Full testing TBD
  });
});
