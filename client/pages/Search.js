import React, { Component } from "react";
import { FlatList, StyleSheet } from "react-native";
import {
  Text,
  TextField,
  Spacings,
  View,
  ListItem,
  Icon,
  Colors,
  Button,
} from "react-native-ui-lib";
import Layout from "../component/Layout";

import { posts as users } from "../constants/sample-data";

const searchIcon = require("../assets/search.png");

const LEADING_ICON = {
  source: searchIcon,
  style: { marginRight: Spacings.s1, width: 30, height: 30 },
};

const styles = StyleSheet.create({
  border: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.grey70,
  },
  text: {
    fontWeight: "bold",
    fontSize: 16,
  },
});

class Search extends Component {
  renderRow(row, id) {
    return (
      <View key={id}>
        <ListItem style={styles.border}>
          <ListItem.Part left>
            <Icon
              style={{
                width: 30,
                height: 30,
                resizeMode: "contain",
                borderRadius: 10500,
              }}
              source={row.profile_pic}
            />
          </ListItem.Part>
          <ListItem.Part middle paddingL-10>
            <Text style={styles.text}>{row.name}</Text>
          </ListItem.Part>
          <ListItem.Part right>
            <Button
              backgroundColor="#6356E5"
              label="Follow"
              size="small"
            ></Button>
          </ListItem.Part>
        </ListItem>
      </View>
    );
  }

  keyExtractor = (item) => item.name;

  render() {
    return (
      <Layout>
        <TextField leadingIcon={LEADING_ICON} placeholder="Search..." />
        <FlatList
          data={users}
          renderItem={({ item, index }) => this.renderRow(item, index)}
          keyExtractor={this.keyExtractor}
        />
      </Layout>
    );
  }
}

export default Search;
