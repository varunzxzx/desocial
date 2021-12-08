import React, { useEffect, useState } from "react";
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
import { ethers } from "ethers";
import { useMoralisDapp } from "../providers/MoralisDappProvider/MoralisDappProvider";
import Layout from "../component/Layout";

import getProfilePic from "../utils/getProfilePic";

const searchIcon = require("../assets/search.png");

const LEADING_ICON = {
  source: searchIcon,
  style: { marginRight: Spacings.s1, width: 30, height: 30 },
};

export default function Search(props) {
  const [users, setUsers] = useState([]);
  const { userContract } = useMoralisDapp();
  function renderRow(row, id) {
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
              source={getProfilePic()}
            />
          </ListItem.Part>
          <ListItem.Part middle paddingL-10>
            <Text style={styles.text}>
              {ethers.utils.parseBytes32String(row.name)}
            </Text>
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

  const keyExtractor = (item) => item.name;

  useEffect(() => {
    async function fetchUsers() {
      const users = await userContract.fetchAllUsers();
      setUsers(users);
    }

    fetchUsers();
  }, []);

  return (
    <Layout>
      <TextField leadingIcon={LEADING_ICON} placeholder="Search..." />
      <FlatList
        data={users}
        renderItem={({ item, index }) => renderRow(item, index)}
        keyExtractor={keyExtractor}
      />
    </Layout>
  );
}

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
