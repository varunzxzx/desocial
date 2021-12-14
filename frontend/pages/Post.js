import React from "react";
import {
  ImageBackground,
  Dimensions,
  FlatList,
  StyleSheet,
} from "react-native";
import {
  Image,
  Text,
  View,
  Button,
  ListItem,
  Colors,
} from "react-native-ui-lib";
import Layout from "../component/Layout";
import { default as FaIcon } from "react-native-vector-icons/FontAwesome";
import { default as AntIcon } from "react-native-vector-icons/AntDesign";
import { ethers } from "ethers";
import { useMoralisDapp } from "../providers/MoralisDappProvider/MoralisDappProvider";
import getProfilePic from "../utils/getProfilePic";

const wallet_logo = require("../assets/wallet.png");

function Post(props) {
  const { nFTMarketContract, userContract, sendTransaction } = useMoralisDapp();
  const { post, buyNFT } = props.route.params;

  const [dimension, setDimension] = React.useState({});
  const [bids, setBids] = React.useState([]);

  const { width: sWidth, height: sHeight } = Dimensions.get("screen");

  React.useEffect(() => {
    Image.getSize(post.image, (width, height) => {
      if (width > height) {
        width = sWidth - 20;
      } else {
        if (height > 400) {
          width = 450;
        }
      }
      height = 450;
      setDimension({ width, height });
    });
  }, []);

  async function fetchBids() {
    const bids = await nFTMarketContract.fetchBids(post.itemId);
    const bidsWithUser = await Promise.all(
      bids.map(async (bid) => {
        const user = await userContract.fetchUserByAddress({
          from: bid.buyer,
        });
        return {
          ...bid,
          userName: user.name,
        };
      })
    );
    setBids(bidsWithUser);
  }

  React.useEffect(() => {
    fetchBids();
  }, []);

  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchBids().then(() => setRefreshing(false));
  }, []);

  function renderBids(row) {
    return (
      <View>
        <ListItem height={77.5}>
          <ListItem.Part left>
            <Image source={getProfilePic()} style={styles.image} />
          </ListItem.Part>
          <ListItem.Part middle>
            <Text>{ethers.utils.parseBytes32String(row.userName)}</Text>
          </ListItem.Part>
          <ListItem.Part right>
            <Text style={{ fontWeight: "bold" }}>
              {ethers.utils.formatUnits(row.bid, "ether")} ETH
            </Text>
          </ListItem.Part>
        </ListItem>
      </View>
    );
  }

  return (
    <Layout {...props}>
      <ImageBackground
        source={{ uri: post.image }}
        resizeMode="cover"
        style={{ justifyContent: "center" }}
        blurRadius={5}
      >
        <View center>
          <Image
            source={{
              uri: post.image,
            }}
            style={{
              ...dimension,
              resizeMode: "contain",
            }}
          />
        </View>
      </ImageBackground>
      {/* Post Body */}
      <View row padding-10 paddingL-15>
        <FaIcon name="heart-o" size={30} solid />
        <AntIcon style={{ marginLeft: 20 }} name="sharealt" size={30} solid />
        <FaIcon style={{ marginLeft: 20 }} name="bookmark-o" size={30} solid />
        <View row centerV style={{ width: 60 }}>
          <Image
            style={{
              width: 30,
              resizeMode: "contain",
              height: 30,
              marginLeft: 150,
            }}
            assetName="eth_logo"
            assetGroup="logos"
          />
          <Text style={{ fontSize: 16 }}>{post.price}</Text>
        </View>
      </View>
      <View padding-5 paddingL-15>
        <Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            {post.name}{" "}
          </Text>
          {post.description}
        </Text>
      </View>
      {bids.length !== 0 && (
        <FlatList
          data={bids}
          renderItem={({ item, index }) => renderBids(item, index)}
          keyExtractor={(i) => i.userName}
        />
      )}
      <Button
        onPress={() => buyNFT(post)}
        borderRadius={10}
        backgroundColor="#6356E5"
        style={{
          borderRadius: 0,
          marginTop: 10,
          height: 50,
        }}
        iconSource={wallet_logo}
        iconStyle={{
          width: 25,
          height: 25,
        }}
        label={post.isAuction ? "Place Bid" : "Buy now"}
        labelStyle={{ fontWeight: "bold", fontSize: 16 }}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 32,
    height: 32,
    borderRadius: 50,
    marginHorizontal: 14,
  },
  border: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.grey70,
  },
});

export default Post;
