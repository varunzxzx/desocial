import React, { Component } from "react";
import {
  View,
  Text,
  Card,
  Icon,
  Image,
  Button,
  PageControlPosition,
} from "react-native-ui-lib";
import { ImageBackground, Pressable } from "react-native";

import { default as FaIcon } from "react-native-vector-icons/FontAwesome";
import { default as AntIcon } from "react-native-vector-icons/AntDesign";
import getProfilePic from "../utils/getProfilePic";

const wallet_logo = require("../assets/wallet.png");

class MyCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      post: this.props.post,
      width: 0,
      height: 0,
      liked: false,
      profile_pic: getProfilePic(),
    };

    this.likePost = this.likePost.bind(this);
  }

  likePost() {
    this.setState({ liked: !this.state.liked });
  }

  componentDidMount() {
    Image.getSize(this.state.post.image, (width, height) => {
      if (width > height) {
        height = 170;
        width = 380;
      } else {
        if (height > 400) {
          height = 300;
          width = 200;
        }
      }
      this.setState({ width, height });
    });
  }

  render() {
    const { post, width, height, liked } = this.state;
    if (!post) return <Text>Loading...</Text>;
    return (
      <View marginB-10>
        <Card>
          <View row paddingH-10 paddingV-5>
            <Icon
              style={{
                width: 30,
                height: 30,
                resizeMode: "contain",
                borderRadius: 10500,
              }}
              source={this.state.profile_pic}
            />
            <Text
              style={{
                padding: 5,
                paddingLeft: 15,
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              {post.sellerName}
            </Text>
          </View>
          <Pressable
            onPress={() =>
              this.props.navigation.navigate("MyStack", {
                screen: "Post",
                post,
                buyNFT: this.props.buyNFT,
              })
            }
          >
            <ImageBackground
              source={{ uri: post.image }}
              resizeMode="cover"
              style={{ justifyContent: "center" }}
              blurRadius={5}
            >
              <Card.Section
                center
                imageSource={{
                  uri: post.image,
                }}
                imageStyle={{
                  height,
                  width,
                  resizeMode: "contain",
                  borderWidth: 1,
                }}
              />
            </ImageBackground>
          </Pressable>

          <View row padding-10 paddingL-15>
            <FaIcon
              name={!liked ? "heart-o" : "heart"}
              size={30}
              solid
              onPress={this.likePost}
            />
            <AntIcon
              style={{ marginLeft: 20 }}
              name="sharealt"
              size={30}
              solid
            />
            <FaIcon
              style={{ marginLeft: 20 }}
              name="bookmark-o"
              size={30}
              solid
            />
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
          <Button
            onPress={() => this.props.buyNFT(post)}
            borderRadius={10}
            backgroundColor="#6356E5"
            style={{
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
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
        </Card>
      </View>
    );
  }
}

export default MyCard;
