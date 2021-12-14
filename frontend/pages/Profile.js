import { ethers } from "ethers";
import React from "react";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import { Text, View, Icon, Button } from "react-native-ui-lib";
import { TabView, SceneMap } from "react-native-tab-view";
import Layout from "../component/Layout";
import getProfilePic from "../utils/getProfilePic";
import { useMoralisDapp } from "../providers/MoralisDappProvider/MoralisDappProvider";
import MyCard from "../component/Card";

const styles = {
  top: {
    fontSize: 16,
  },
  bold: {
    fontWeight: "bold",
    fontSize: 16,
  },
};

const items = [
  {
    label: "My Post",
    key: "My Post",
  },
  {
    label: "My Collection",
    key: "My Collection",
  },
];

function Profile(props) {
  const { user } = props.route.params;
  const [index, setIndex] = React.useState(0);
  const [posts, setPosts] = React.useState([]);
  const [collections, setCollections] = React.useState([]);
  const [routes] = React.useState([
    { key: "first", title: "My Post" },
    { key: "second", title: "My Collection" },
  ]);
  const [profile_pic, setProfilePic] = React.useState(getProfilePic());

  const { nFTMarketContract, nFTContract, userContract } = useMoralisDapp();

  const FirstRoute = () => {
    return (
      <View flex>
        {posts.map((post, i) => (
          <MyCard key={i} post={post} buyNFT={() => {}} />
        ))}
      </View>
    );
  };
  const SecondRoute = () => (
    <View flex>
      {collections.map((post, i) => (
        <MyCard key={i} post={post} buyNFT={() => {}} />
      ))}
    </View>
  );
  const renderScene = ({ route }) => {
    switch (route.key) {
      case "first":
        return <FirstRoute />;
      case "second":
        return <SecondRoute />;
      default:
        return null;
    }
  };

  async function fetchPosts() {
    const data = await nFTMarketContract.fetchItemsCreated({
      from: user.uAddress,
    });
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

  React.useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchCollections() {
    const data = await nFTMarketContract.fetchMyNFTs({
      from: user.uAddress,
    });
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
    setCollections(items);
  }

  React.useEffect(() => {
    fetchCollections();
  }, []);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchPosts().then(fetchCollections().then(() => setRefreshing(false)));
  }, []);

  return (
    <Layout {...props} refreshing={refreshing} onRefresh={onRefresh}>
      {/* Top row */}
      <View row spread>
        <Icon
          style={{
            width: 80,
            height: 80,
            resizeMode: "contain",
            borderRadius: 10500,
          }}
          source={profile_pic}
        />
        {/* Post */}
        <View center>
          <View>
            <Text style={styles.bold}>2</Text>
          </View>
          <View>
            <Text style={styles.top}>Posts</Text>
          </View>
        </View>
        {/* Followers */}
        <View center>
          <View>
            <Text style={styles.bold}>10</Text>
          </View>
          <View>
            <Text style={styles.top}>Followers</Text>
          </View>
        </View>
        {/* Following */}
        <View center>
          <View>
            <Text style={styles.bold}>30</Text>
          </View>
          <View>
            <Text style={styles.top}>Following</Text>
          </View>
        </View>
      </View>
      {/* Bio */}
      <View margin-10>
        <Text style={styles.bold}>
          {ethers.utils.parseBytes32String(user.name)}
        </Text>
        <Text>{user.bio}</Text>
      </View>
      {/* Edit Profile */}
      <View>
        <Button
          backgroundColor="transparent"
          color="rgb(28, 28, 30)"
          outlineColor="rgb(28, 28, 30)"
          label="Edit Profile"
        ></Button>
      </View>
      {/* Posts */}
      <View marginT-10 style={{ height: 650 * posts.length }}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
        />
      </View>
    </Layout>
  );
}

export default gestureHandlerRootHOC((props) => <Profile {...props} />);
