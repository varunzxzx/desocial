import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import MyCard from "../component/Card";

import { useMoralisDapp } from "../providers/MoralisDappProvider/MoralisDappProvider";
import { ethers } from "ethers";
import {
  LoaderScreen,
  Colors,
  Dialog,
  View,
  TextField,
  Button,
} from "react-native-ui-lib";
import { useTheme } from "@react-navigation/native";

function Home(props) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [price, setPrice] = useState("0");
  const [nft, setNft] = useState({});
  const [bidding, setBidding] = useState(false);

  const user = props.route.params.user;

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
          isAuction: i.isAuction,
          sellDate: i.sellDate,
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
    if (nft.isAuction) {
      setNft(nft);
      setDialogOpen(true);
      return;
    }
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

  async function placeBid() {
    setBidding(true);
    const price1 = ethers.utils.parseUnits(price, "ether");
    console.log(price1);
    const transaction = await nFTMarketContract.populateTransaction.createBid(
      nft.itemId,
      price1,
      user.uAddress,
      { value: price1 }
    );
    await sendTransaction(transaction);
    setBidding(false);
  }

  return (
    <Layout {...props} refreshing={refreshing} onRefresh={onRefresh}>
      {!loading &&
        !bidding &&
        posts.map((post, i) => (
          <MyCard key={i} post={post} buyNFT={buyNFT} {...props} />
        ))}
      {loading && (
        <LoaderScreen
          backgroundColor="rgba(255,255,255,0.9)"
          color="#6356E5"
          message="Transferring NFT..."
          overlay
        />
      )}
      {bidding && (
        <LoaderScreen
          backgroundColor="rgba(255,255,255,0.9)"
          color="#6356E5"
          message="Placing Bid..."
          overlay
        />
      )}
      <Dialog
        visible={dialogOpen}
        onDismiss={() => setDialogOpen(false)}
        containerStyle={styles.dialog}
      >
        <View marginT-20 marginH-20 marginB-10>
          <TextField
            placeholder="e.g. 1.493"
            title="Enter bid..."
            onChangeText={(text) => setPrice(text)}
          />
          <Button
            title="Place Bid"
            onPress={placeBid}
            label="Place Bid"
          ></Button>
        </View>
      </Dialog>
    </Layout>
  );
}

const styles = {
  dialog: {
    backgroundColor: Colors.white,
  },
};

export default Home;
