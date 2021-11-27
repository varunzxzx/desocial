import React, { useEffect, useMemo, useState } from "react";
import { useMoralis } from "react-moralis";
import MoralisDappContext from "./context";
import { ethers } from "ethers";

import UserContract from "../../contracts/Users.json";
import NFTContract from "../../contracts/NFT.json";
import NFTMarketContract from "../../contracts/NFTMarket.json";

import { useWalletConnect } from "../../WalletConnect";

function MoralisDappProvider({ children }) {
  const { web3, Moralis, user } = useMoralis();
  const [walletAddress, setWalletAddress] = useState();
  const [chainId, setChainId] = useState();
  const [userContract, setUserContract] = useState();
  const [nFTContract, setNFTContract] = useState();
  const [nFTMarketContract, setNFTMarketContract] = useState();
  const [provider, setProvider] = useState();

  const connector = useWalletConnect();

  useEffect(() => {
    Moralis.onChainChanged(function (chain) {
      setChainId(chain);
    });

    Moralis.onAccountsChanged(function (address) {
      setWalletAddress(address[0]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => setChainId(web3.givenProvider?.chainId));
  useMemo(
    () =>
      setWalletAddress(
        web3.givenProvider?.selectedAddress || user?.get("ethAddress")
      ),
    [web3, user]
  );

  useEffect(() => {
    async function init() {
      const provider = new ethers.providers.JsonRpcProvider(
        "https://speedy-nodes-nyc.moralis.io/72789e8bb5a803a7c00478b7/polygon/mumbai"
      );
      // const privateKey =
      //   "0xa2c51aa9a241a2a9f25c13cf31f431ee8869ec405e695af59b7938418b208828";
      // const signer = new ethers.Wallet(privateKey, provider);
      const { chainId } = await provider.getNetwork();
      const userContract = new ethers.Contract(
        UserContract.networks[chainId].address,
        UserContract.abi,
        provider
      );

      const nFTContract = new ethers.Contract(
        NFTContract.networks[chainId].address,
        NFTContract.abi,
        provider
      );

      const nFTMarketContract = new ethers.Contract(
        NFTMarketContract.networks[chainId].address,
        NFTMarketContract.abi,
        provider
      );

      setUserContract(userContract);
      setNFTContract(nFTContract);
      setNFTMarketContract(nFTMarketContract);
      setProvider(provider);
    }
    if (!provider) init();
  }, [provider]);

  async function sendTransaction(tx) {
    const txFinal = {
      ...tx,
      from: walletAddress,
      gasPrice: "0x0218711a00",
      nonce: "0x0114",
    };

    if (tx.value) {
      txFinal["value"] = tx.value.toHexString();
    }

    const txHash = await connector.sendTransaction(txFinal);
    return await provider.waitForTransaction(txHash);
  }

  return (
    <MoralisDappContext.Provider
      value={{
        walletAddress,
        chainId: "0x1",
        sendTransaction,
        userContract,
        nFTContract,
        nFTMarketContract,
      }}
    >
      {children}
    </MoralisDappContext.Provider>
  );
}

function useMoralisDapp() {
  const context = React.useContext(MoralisDappContext);
  if (context === undefined) {
    throw new Error("useMoralisDapp must be used within a MoralisDappProvider");
  }
  return context;
}

export { MoralisDappProvider, useMoralisDapp };
