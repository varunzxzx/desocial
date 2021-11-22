import "./shim.js";
import crypto from "crypto";
import "react-native-randombytes";
import "react-native-get-random-values";
import "@ethersproject/shims";

import { ethers } from "ethers";

import { Linking } from "react-native";
import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useWalletConnect,
  withWalletConnect,
} from "@walletconnect/react-native-dapp";

// Old
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Button,
} from "react-native";
import { Table, TableWrapper, Row, Cell } from "react-native-table-component";

import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Profile from "./pages/Profile.js";
import Home from "./pages/Home.js";
import Search from "./pages/Search.js";

// import VotingContract from "./contracts/Voting.json";

const TX_STORE = "tx-store";
const ETHERSCAN_URL = "https://ropsten.etherscan.io/tx/";

const Tab = createBottomTabNavigator();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "white",
  },
};

class App extends Component {
  render() {
    return (
      <NavigationContainer theme={MyTheme}>
        <Tab.Navigator screenOptions={{ headerShown: false }}>
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="Search" component={Search} />
          <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}

function Wallet(props) {
  const connector = useWalletConnect();
  if (connector.connected)
    return <Button title="Connect" onPress={() => connector.connect()} />;
  return <App {...props} connector={connector} />;
}

function transactify(tx, signer) {
  return {
    ...tx,
    from: signer,
    value: tx.value.toHexString(),
    gas: "0x9c40",
    gasPrice: "0x02540be400",
    nonce: "0x0114",
  };
}

class Appp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableHead: ["Name", "No Of Votes", " "],
      tableData: [
        ["Rama", "2", " "],
        ["Nick", "4", " "],
        ["Jose", "1", " "],
      ],
      candidates: ["Rama", "Nick", "Jose"],
      lastTx: "",
    };
  }

  async _castVote(index) {
    const { tableData, contract } = this.state;
    const { connector } = this.props;
    const candidateName = tableData[index][0];
    const dummyTx = await contract.populateTransaction.voteForCandidate(
      ethers.utils.formatBytes32String(candidateName),
      {
        value: ethers.utils.parseEther("0.0001"),
      }
    );
    const tx = transactify(dummyTx, connector.accounts[0]);

    console.log(tx);

    const response = await connector.sendTransaction(tx);
    this.updateLastTx(response);
  }

  async updateLastTx(tx) {
    await AsyncStorage.setItem(TX_STORE, tx);
    this.setState({ lastTx: tx });
  }

  updateVote() {
    const connector = this.props.connector;
    const { candidates, tableData, contract } = this.state;

    candidates.forEach(async (candidate, i) => {
      contract
        .totalVotesFor(ethers.utils.formatBytes32String(candidate))
        .then((f) => {
          tableData[i][1] = f.toNumber();
          // console.log(f.toNumber());
          this.setState({ tableData });
        });
    });
  }

  async componentDidMount() {
    const provider = new ethers.providers.InfuraProvider(
      "ropsten",
      "a943944176ab4598ae305ca5fa3c8208"
    );
    // const privateKey =
    //   "0xa2c51aa9a241a2a9f25c13cf31f431ee8869ec405e695af59b7938418b208828";
    // const signer = new ethers.Wallet(privateKey, provider);

    const { chainId } = await provider.getNetwork();
    const deployedNetwork = VotingContract.networks[chainId];
    const contract = new ethers.Contract(
      deployedNetwork && deployedNetwork.address,
      VotingContract.abi,
      provider
    );
    this.setState({
      contract,
      provider,
      lastTx: await AsyncStorage.getItem(TX_STORE),
    });
    this.updateVote();
  }

  render() {
    const state = this.state,
      { lastTx } = this.state;
    const { connector } = this.props;
    const element = (data, index) => (
      <TouchableOpacity onPress={() => this._castVote(index)}>
        <View style={styles.btn}>
          <Text style={styles.btnText}>Vote</Text>
        </View>
      </TouchableOpacity>
    );

    return (
      <View style={styles.container}>
        <Table borderStyle={{ borderColor: "transparent" }}>
          <Row
            data={state.tableHead}
            style={styles.head}
            textStyle={styles.text}
          />
          {state.tableData.map((rowData, index) => (
            <TableWrapper key={index} style={styles.row}>
              {rowData.map((cellData, cellIndex) => (
                <Cell
                  key={cellIndex}
                  data={cellIndex === 2 ? element(cellData, index) : cellData}
                  textStyle={styles.text}
                />
              ))}
            </TableWrapper>
          ))}
        </Table>
        <Text
          style={{ color: "blue" }}
          onPress={() => Linking.openURL(ETHERSCAN_URL + lastTx)}
        >
          {ETHERSCAN_URL + lastTx}
        </Text>
        <Button title="Refresh" onPress={() => this.updateVote()} />
        <Button title="Kill Session" onPress={() => connector.killSession()} />
        <StatusBar style="auto" />
      </View>
    );
  }
}

export default withWalletConnect(Wallet, {
  clientMeta: {
    description: "Connect with deSocial",
    url: "https://desocial.org",
    icons: ["https://walletconnect.org/walletconnect-logo.png"],
    name: "deSocial",
  },
  redirectUrl:
    Platform.OS === "web" ? window.location.origin : "desocial.app://",
  storageOptions: {
    asyncStorage: AsyncStorage,
  },
});

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 100, backgroundColor: "#fff" },
  head: { height: 40, backgroundColor: "#808B97" },
  text: { margin: 6 },
  row: { flexDirection: "row", backgroundColor: "#FFF1C1" },
  btn: { width: 58, height: 18, backgroundColor: "#78B7BB", borderRadius: 2 },
  btnText: { textAlign: "center", color: "#fff" },
});
