const NFT = artifacts.require("NFT");
const NFTMarketBuildDir =
  require("../truffle-config").contracts_build_directory;
const networks = require("../truffle-config").networks;
let network = null;

if (!process.argv[4]) {
  network = "development";
} else {
  network = process.argv[4];
}

const chainID = require("../truffle-config").networks[network].network_id;

const NFTMarketAddress = require(NFTMarketBuildDir + "/NFTMarket.json")
  .networks[chainID].address;

module.exports = function (deployer) {
  deployer.deploy(NFT, NFTMarketAddress);
};
