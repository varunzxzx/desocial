import "intl";
import "intl/locale-data/jsonp/en-US";
import "@ethersproject/shims";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { useWalletConnect } from "./WalletConnect";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { LogBox } from "react-native";
import { default as AntIcon } from "react-native-vector-icons/AntDesign";

import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Search from "./pages/Search";
import CreateNFT from "./pages/CreateNFT";

LogBox.ignoreAllLogs();

// const Activecolor =
// function Home(): JSX.Element {
//   return (
//     <Tab.Navigator
//       shifting={false}
//       activeColor="#315399"
//       // inactiveColor="#3e2465"
//       barStyle={{ backgroundColor: "white" }}>
//       <Tab.Screen
//         name="Assets"
//         options={{
//           tabBarLabel: "Assets",
//           tabBarIcon: ({ color, focused }) => {
//             return <FontAwesomeIcon icon={faCoins} color={color} size={20} />;
//           },
//         }}
//         component={Assets}
//       />
//       <Tab.Screen
//         name="Transactions"
//         options={{
//           tabBarLabel: "Transactions",
//           tabBarIcon: ({ color }) => (
//             <FontAwesomeIcon icon={faCreditCard} color={color} size={20} />
//           ),
//         }}
//         component={RecentTransactions}
//       />
//       <Tab.Screen
//         name="NFTAssets"
//         options={{
//           tabBarLabel: "NFTAssets",
//           tabBarIcon: ({ color, focused }) => {
//             return <FontAwesomeIcon icon={faRocket} color={color} size={20} />;
//           },
//         }}
//         component={NFTAssets}
//       />
//       <Tab.Screen
//         name="Transfer"
//         options={{
//           tabBarLabel: "Transfer",
//           tabBarIcon: ({ color }) => (
//             <FontAwesomeIcon icon={faPaperPlane} color={color} size={20} />
//           ),
//         }}
//         component={Transfer}
//       />

//       <Tab.Screen
//         name="Profile"
//         options={{
//           tabBarLabel: "Profile",
//           tabBarIcon: ({ color }) => (
//             <FontAwesomeIcon icon={faUser} color={color} size={20} />
//           ),
//         }}
//         component={Profile}
//       />
//     </Tab.Navigator>
//   );
// }

// const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();
function getHeaderTitle(route) {
  // If the focused route is not found, we need to assume it's the initial screen
  // This can happen during if there hasn't been any navigation inside the screen
  // In our case, it's "Feed" as that's the first screen inside the navigator
  const routeName = getFocusedRouteNameFromRoute(route) ?? "Feed";

  switch (routeName) {
    case "Assets":
      return "Assets";
    case "Transfer":
      return "Transfer";
    case "Transactions":
      return "Transactions";
    case "Profile":
      return "Profile";
  }
}

// function App(): JSX.Element {
//   const connector = useWalletConnect();
//   const {
//     authenticate,
//     authError,
//     isAuthenticating,
//     isAuthenticated,
//     logout,
//     Moralis,
//   } = useMoralis();

//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="SplashScreen">
//         {/* SplashScreen which will come once for 5 Seconds */}
//         <Stack.Screen
//           name="SplashScreen"
//           component={SplashScreen}
//           // Hiding header for Splash Screen
//           options={{ headerShown: false }}
//         />
//         {/* Auth Navigator: Include Login and Signup */}
//         <Stack.Screen
//           name="Auth"
//           component={CryptoAuth}
//           options={{ headerShown: false }}
//         />
//         {/* Navigation Drawer as a landing page */}
//         <Stack.Screen
//           name="DrawerNavigationRoutes"
//           component={Home}
//           // Hiding header for Navigation Drawer
//           options={{ headerTitle: (props) => <Header /> }}
//           // options={({ route }) => ({
//           //   headerTitle: getHeaderTitle(route),
//           // })}
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }
import { ethers } from "ethers";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Button,
} from "react-native";

import { useMoralisDapp } from "./providers/MoralisDappProvider/MoralisDappProvider";
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "white",
  },
};

const Tab = createBottomTabNavigator();

function App(props) {
  const [moralisUser, setMoralisUser] = useState(props.user);
  const [user, setUser] = useState(null);
  const [contract, setContract] = useState(null);

  const walletAddress = moralisUser.get("ethAddress");

  const signup = async () => {
    const { userContract, sendTransaction } = useMoralisDapp();
    let data;
    try {
      data = await userContract.fetchUserByAddress({
        from: walletAddress,
      });
      console.log("1");
    } catch (error) {
      // User not found
      console.log("user not found");
      const transaction = await userContract.populateTransaction.signup(
        ethers.utils.formatBytes32String("Jeba"),
        "NFT Designer"
      );
      data = await sendTransaction(transaction, walletAddress);
      console.log("2", data);
    }
    setUser(data);
  };

  if (!user) {
    signup();
    return <Text>Fetching user details...</Text>;
  }
  const initialParams = {
    moralisUser,
    user,
  };

  function MyStack() {
    return (
      <Stack.Navigator
        initialRouteName="Profile"
        screenOptions={{ headerShown: false, tabBarShowLabel: false }}
      >
        <Stack.Screen
          name="Profile"
          component={Profile}
          initialParams={{ ...initialParams }}
        />
        <Stack.Screen
          name="CreateNFT"
          component={CreateNFT}
          initialParams={{ ...initialParams }}
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
          name="MyStack"
          component={MyStack}
          options={{
            tabBarIcon: ({ color, size }) => (
              <AntIcon name="user" size={size} color={color} />
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

export default function () {
  const connector = useWalletConnect();
  const [balanceETH, setBalanceETH] = useState();
  const {
    authenticate,
    authError,
    isAuthenticating,
    isAuthenticated,
    logout,
    Moralis,
    user,
    web3,
    isWeb3Enabled,
    enableWeb3,
  } = useMoralis();

  const handleCryptoLogin = () => {
    authenticate({ connector })
      .then(() => {
        if (authError) {
          console.log(authError);
        } else {
          if (isAuthenticated) {
            console.log("authenticated");
          }
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (isAuthenticated && !Moralis.Web3) {
      Moralis.enableWeb3({ connector });
    }
  }, [isAuthenticated, Moralis]);

  if (isAuthenticated) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <App user={user} web3={web3} connector={connector} />
      </GestureHandlerRootView>
    );
  }
  return <Button title="Connect" onPress={handleCryptoLogin} />;
}
