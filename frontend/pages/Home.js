import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import MyCard from "../component/Card";

import { useMoralisDapp } from "../providers/MoralisDappProvider/MoralisDappProvider";
import { ethers } from "ethers";
import { LoaderScreen } from "react-native-ui-lib";

function Home(props) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const {
    nFTMarketContract,
    userContract,
    nFTContract,
    nFTContractAddress,
    sendTransaction,
  } = useMoralisDapp();

  async function fetchPosts() {
    const data = await nFTMarketContract.fetchMarketItems();
    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await nFTContract.tokenURI(i.tokenId);
        const meta = await fetch(tokenUri).then((response) => response.json());
        const price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let sellerName = await userContract.fetchUserByAddress({
          from: i.seller,
        });
        sellerName = ethers.utils.parseBytes32String(sellerName.name);
        return {
          price,
          tokenId: i.tokenId.toNumber(),
          itemId: i.itemId.toNumber(),
          seller: i.seller,
          sellerName,
          owner: i.owner,
          sold: i.sold,
          image: meta.image,
          name: meta.name,
          description: meta.description,
        };
      })
    );
    setPosts(items);
  }
  useEffect(() => {
    fetchPosts();
  }, []);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchPosts().then(() => setRefreshing(false));
  }, []);

  async function buyNFT(nft) {
    setLoading(true);
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const transaction = await nFTMarketContract.populateTransaction.createMarketSale(
      ethers.utils.getAddress(nFTContractAddress),
      nft.itemId,
      {
        value: price,
      }
    );
    await sendTransaction(transaction);
    console.log("NFT sold");
    setLoading(false);
  }

  return (
    <Layout {...props} refreshing={refreshing} onRefresh={onRefresh}>
      {posts.map((post, i) => (
        <MyCard key={i} post={post} buyNFT={buyNFT} />
      ))}
      {loading && (
        <LoaderScreen
          backgroundColor="rgba(255,255,255,0.9)"
          color="#6356E5"
          message="Transferring NFT..."
          overlay
        />
      )}
    </Layout>
  );
}

export default Home;
