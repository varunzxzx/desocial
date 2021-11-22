import React, { Component } from "react";
import Layout from "../component/Layout";
import MyCard from "../component/Card";

import { posts } from "../constants/sample-data";

class Home extends Component {
  render() {
    return (
      <Layout>
        {posts.map((post, i) => (
          <MyCard key={i} post={post} />
        ))}
      </Layout>
    );
  }
}

export default Home;
