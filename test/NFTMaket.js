const NFTMarket = artifacts.require("../contracts/NFTMarket.sol");
const NFT = artifacts.require("../contracts/NFT.sol");
const ethers = require("ethers");
const assertRevert = require("./utils/assertRevert");
const Users = artifacts.require("../contracts/Users.sol");

contract("NFTMarket", function (accounts) {
  let market;

  beforeEach(async () => {
    market = await NFTMarket.new();
    nft = await NFT.new(market.address);
    users = await Users.new();
  });

  it("Should create and execute market sales", async function () {
    await users.signup(ethers.utils.formatBytes32String("Varun"), "Yo boi");
    const user = await users.fetchUserByAddress();

    const nftContractAddress = nft.address;

    let listingPrice = await market.getListingPrice();
    listingPrice = listingPrice.toString();

    const auctionPrice = ethers.utils.parseUnits("1", "ether");

    await nft.createToken("https://www.mytokenlocation.com");
    await nft.createToken("https://www.mytokenlocation2.com");

    await market.createMarketItem(
      nftContractAddress,
      1,
      auctionPrice,
      user.id,
      false,
      0,
      {
        value: listingPrice,
      }
    );
    await market.createMarketItem(
      nftContractAddress,
      2,
      auctionPrice,
      user.id,
      true,
      1638489600,
      {
        value: listingPrice,
      }
    );

    await market.createMarketSale(nftContractAddress, 1, {
      from: accounts[1],
      value: auctionPrice,
    });

    items = await market.fetchMarketItems();
    items = await Promise.all(
      items.map(async (i) => {
        const tokenUri = await nft.tokenURI(i.tokenId);
        let item = {
          price: i.price.toString(),
          tokenId: i.tokenId.toString(),
          seller: i.seller,
          owner: i.owner,
          tokenUri,
        };
        return item;
      })
    );
    console.log("items: ", items);

    // create Bids
    const auctionPrice2 = ethers.utils.parseUnits("2", "ether");
    const auctionPrice3 = ethers.utils.parseUnits("0.5", "ether");
    await assertRevert(
      market.createBid(2, auctionPrice3, accounts[2]),
      "Lower Bid from Min. price got accepted"
    );
    await market.createBid(2, auctionPrice, accounts[2], {
      value: auctionPrice,
    });
    await market.createBid(2, auctionPrice2, accounts[3], {
      value: auctionPrice2,
    });
    await assertRevert(
      market.createBid(2, auctionPrice3, accounts[3]),
      "Lower Bid got accepted"
    );
    const data = await market.fetchBids(2);
    console.log("<<<<< BIDS >>>>>", data);

    // Selling Item for Max. bid
    await market.createBidSale(2);
  });
});
