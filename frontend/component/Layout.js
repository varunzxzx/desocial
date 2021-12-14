import React, { Component } from "react";
import {
  ScrollView,
  StatusBar,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import {
  View,
  Assets,
  Image,
  GridView,
  Dialog,
  Text,
  Colors,
} from "react-native-ui-lib";
import Icon from "react-native-vector-icons/AntDesign";

Assets.loadAssetsGroup("logos", {
  full_logo_white: require("../assets/logos/full_logo_white.png"),
  eth_logo: require("../assets/logos/ethereum_logo.png"),
});

class Layout extends Component {
  constructor(props) {
    super(props);

    this.createNFT = this.createNFT.bind(this);
  }

  createNFT() {
    this.props.navigation.navigate("MyStack", { screen: "CreateNFT" });
  }

  render() {
    return (
      <SafeAreaView>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.props.refreshing}
              onRefresh={this.props.onRefresh}
            />
          }
        >
          <View row spread>
            <View>
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
            <View marginR-10>
              <Icon
                name="plussquareo"
                size={30}
                solid
                onPress={this.createNFT}
              />
            </View>
          </View>
          <View margin-10>{this.props.children}</View>
          {/* <StatusBar hidden={true} /> */}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default Layout;
