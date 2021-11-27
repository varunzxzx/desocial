import { UserInterfaceIdiom } from "expo-constants";
import React, { Component } from "react";
import { Text, View, Icon, Button, TabController } from "react-native-ui-lib";
import Layout from "../component/Layout";

import { posts } from "../constants/sample-data";

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

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...this.props.route.params
    }
  }
  render() {
    const {user} = this.state;
    return (
      <Layout>
        {/* Top row */}
        <View row spread>
          <Icon
            style={{
              width: 80,
              height: 80,
              resizeMode: "contain",
              borderRadius: 10500,
            }}
            source={posts[0].profile_pic}
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
          <Text style={styles.bold}>{user.name}</Text>
          <Text>
            consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
            labore et dolore magna aliqua.
          </Text>
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
        <View>
          <TabController asCarousel={true} items={items}>
            <TabController.TabBar items={items} />

            <TabController.PageCarousel>
              <TabController.TabPage index={0}>
                <Text style={styles.top}>Your Posts...</Text>
              </TabController.TabPage>
              <TabController.TabPage index={1}>
                <Text style={styles.top}>You Bought...</Text>
              </TabController.TabPage>
            </TabController.PageCarousel>
          </TabController>
        </View>
      </Layout>
    );
  }
}

export default Profile;
