import "intl";
import "intl/locale-data/jsonp/en-US";
import "@ethersproject/shims";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { useWalletConnect } from "./WalletConnect";
import { LogBox } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Text } from "react-native";

import Navigator from "./Navigator";

LogBox.ignoreAllLogs();
import { useMoralisDapp } from "./providers/MoralisDappProvider/MoralisDappProvider";
import { View, Image, Button } from "react-native-ui-lib";

function App(props) {
  const [moralisUser, setMoralisUser] = useState(props.user);
  const [user, setUser] = useState(null);

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
        ethers.utils.formatBytes32String("Varun"),
        "Collector of Collections!!"
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
  return <Navigator moralisUser={moralisUser} user={user} />;
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
  return (
    <View flex center>
      <View marginB-10>
        <Image
          style={{
            width: 300,
            resizeMode: "contain",
            marginLeft: 10,
          }}
          assetName="full_logo_white"
          assetGroup="logos"
        />
      </View>
      <Button
        label="Crypto Wallet Login"
        onPress={handleCryptoLogin}
        marginT-10
      />
    </View>
  );
}
