import React, { Component } from "react";
import { ScrollView, StatusBar } from "react-native";
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

const styles = {
  dialog: {
    backgroundColor: Colors.white,
    height: "95%"
  }
}

class Layout extends Component {
  constructor(props) {
    super(props);

    this.createNFT = this.createNFT.bind(this)
  }

  createNFT() {
    this.props.navigation.navigate("CreateNFT");
  }

  render() {
    return (
      <ScrollView>
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
        {/* <Dialog visible={dialogOpen} onDismiss={this.toggleDialog} containerStyle={styles.dialog}>
          <CreateNFT />
        </Dialog> */}
      </ScrollView>
    );
  }
}

export default Layout;