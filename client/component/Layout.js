import React, { Component } from "react";
import { ScrollView, StatusBar } from "react-native";
import { View, Assets, Image, GridView } from "react-native-ui-lib";
import Icon from "react-native-vector-icons/AntDesign";

Assets.loadAssetsGroup("logos", {
  full_logo_white: require("../assets/logos/full_logo_white.png"),
  eth_logo: require("../assets/logos/ethereum_logo.png"),
});

const header = [
  {
    renderCustomItem: () => {
      return (
        <View left>
          <Image
            style={{
              width: 120,
              resizeMode: "contain",
              height: 30,
              marginLeft: 10,
            }}
            assetName="full_logo_white"
            assetGroup="logos"
          />
        </View>
      );
    },
  },
  {
    renderCustomItem: () => {
      return <Icon name="plussquareo" size={30} solid />;
    },
  },
];

class Layout extends Component {
  render() {
    return (
      <ScrollView>
        <GridView viewWidth={700} items={header} numColumns={2} />
        <View margin-10>{this.props.children}</View>
        {/* <StatusBar hidden={true} /> */}
      </ScrollView>
    );
  }
}

export default Layout;
