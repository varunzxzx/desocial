import React, { Component } from "react";
import { View, Text, Card, Icon, Image, Button } from "react-native-ui-lib";

import { default as FaIcon } from "react-native-vector-icons/FontAwesome";
import { default as AntIcon } from "react-native-vector-icons/AntDesign";

const wallet_logo = require("../assets/wallet.png");

class MyCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      post: this.props.post,
    };
  }

  render() {
    const { post } = this.state;
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
              source={post.profile_pic}
            />
            <Text
              style={{
                padding: 5,
                paddingLeft: 15,
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              {post.name}
            </Text>
          </View>
          <Card.Section
            imageSource={post.post}
            imageStyle={{
              width: "100%",
              height: 300,
              resizeMode: "contain",
              borderWidth: 1,
            }}
          />
          <View row padding-10 paddingL-15>
            <FaIcon name="heart-o" size={30} solid />
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
                  marginLeft: 160,
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
              Neque porro quisquam est qui dolorem ipsum quia dolor sit amet,
              consectetur, adipisci velit
            </Text>
          </View>
          <Button
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
            label="Buy now"
            labelStyle={{ fontWeight: "bold", fontSize: 16 }}
          />
        </Card>
      </View>
    );
  }
}

export default MyCard;
