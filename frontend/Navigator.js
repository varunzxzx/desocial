import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { default as AntIcon } from "react-native-vector-icons/AntDesign";
import { createStackNavigator } from "@react-navigation/stack";

import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Search from "./pages/Search";
import CreateNFT from "./pages/CreateNFT";
import Post from "./pages/Post";

const Stack = createStackNavigator();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "white",
  },
};

const Tab = createBottomTabNavigator();

export default function ({ moralisUser, user }) {
  const initialParams = {
    moralisUser,
    user,
  };

  function MyStack(props) {
    return (
      <Stack.Navigator
        initialRouteName="CreateNFT"
        screenOptions={{ headerShown: false, tabBarShowLabel: false }}
      >
        <Stack.Screen
          name="CreateNFT"
          component={CreateNFT}
          initialParams={{ ...props.route.params }}
        />
        <Stack.Screen
          name="Post"
          component={Post}
          initialParams={{ ...props.route.params }}
        />
      </Stack.Navigator>
    );
  }

  return (
    <NavigationContainer theme={MyTheme}>
      <Tab.Navigator
        screenOptions={{ headerShown: false, tabBarShowLabel: false }}
      >
        <Tab.Screen
          initialParams={{ ...initialParams }}
          name="Home"
          component={Home}
          options={{
            tabBarIcon: ({ color, size }) => (
              <AntIcon name="home" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          initialParams={{ ...initialParams }}
          name="Search"
          component={Search}
          options={{
            tabBarIcon: ({ color, size }) => (
              <AntIcon name="search1" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          initialParams={{ ...initialParams }}
          name="Profile"
          component={Profile}
          options={{
            tabBarIcon: ({ color, size }) => (
              <AntIcon name="user" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          initialParams={{ ...initialParams }}
          name="MyStack"
          component={MyStack}
          options={{
            tabBarIcon: ({ color, size }) => (
              <AntIcon name="bars" size={size} color={color} />
            ),
          }}
        />
        {/* <Tab.Screen
              initialParams={{ ...initialParams }}
              name="CreateNFT"
              component={MyStack}
              options={{
                tabBarShowLabel: false,
                tabBarIcon: ({ color, size }) => (
                  <AntIcon name="pluscircleo" size={size} color={color} />
                ),
              }}
            /> */}
      </Tab.Navigator>
    </NavigationContainer>
  );
}
