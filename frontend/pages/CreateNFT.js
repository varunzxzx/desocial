import React, { useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import {
  Text,
  Button,
  Image,
  TextField,
  View,
  LoaderScreen,
} from "react-native-ui-lib";
import { launchImageLibrary } from "react-native-image-picker";
import { useMoralisFile } from "react-moralis";
import { ethers } from "ethers";
import { FontAwesome } from "@expo/vector-icons";
import DatePicker from "react-native-date-picker";

import { useMoralisDapp } from "../providers/MoralisDappProvider/MoralisDappProvider";
import Layout from "../component/Layout";

export default function CreateNFT(props) {
  const {
    nFTContract,
    sendTransaction,
    nFTContractInterface,
    nFTContractAddress,
    nFTMarketContract,
  } = useMoralisDapp();
  const { error, isUploading, moralisFile, saveFile } = useMoralisFile();
  const [fileUrl, setFileUrl] = useState(null);
  const [name, onChangeName] = useState(null);
  const [description, onChangeDescription] = useState(null);
  const [price, onChangePrice] = useState(null);
  const [transaction, setTransaction] = useState(null);
  const [orderType, setOrderType] = useState("fixed");
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const user = props.route.params.user;

  const handleChoosePhoto = () => {
    launchImageLibrary({ includeBase64: true }, async (response) => {
      // console.log(response);
      if (response) {
        const base64 = response.assets[0].base64;
        const res = await saveFile(
          response.assets[0].fileName,
          {
            base64,
            metadata: {
              name: "My NFT",
              description: "Yes, it is the coolest NFT",
            },
          },
          { saveIPFS: true }
        );
        console.log(res);
        setFileUrl(res.ipfs());
      }
    });
  };

  const createNFT = async () => {
    setLoading(true);
    const data = {
      name,
      description,
      image: fileUrl,
    };
    const nFTRes = await saveFile(
      "metadata.json",
      { base64: Buffer.from(JSON.stringify(data)).toString("base64") },
      {
        type: "application/json",
        saveIPFS: true,
      }
    );
    const NFTUrl = nFTRes.ipfs();
    // Generate NFT
    let transaction = await nFTContract.populateTransaction.createToken(NFTUrl);
    let tx = await sendTransaction(transaction);
    console.log("NFT created!!");
    const decodedTx = nFTContractInterface.parseLog(tx.logs[0]);
    const event = decodedTx.args;

    const tokenId = event[2].toNumber();
    const NFTPrice = ethers.utils.parseUnits(price, "ether");
    let listingPrice = await nFTMarketContract.getListingPrice();
    // Create market item
    if (orderType === "fixed") {
      transaction = await nFTMarketContract.populateTransaction.createMarketItem(
        ethers.utils.getAddress(nFTContractAddress),
        tokenId,
        NFTPrice,
        user.id.toNumber(),
        false,
        "0x00",
        { value: listingPrice }
      );
    } else {
      console.log(date, typeof date.getTime());
      transaction = await nFTMarketContract.populateTransaction.createMarketItem(
        ethers.utils.getAddress(nFTContractAddress),
        tokenId,
        NFTPrice,
        user.id.toNumber(),
        true,
        date.getTime(),
        { value: listingPrice }
      );
    }
    await sendTransaction(transaction);
    console.log("NFT put for Sale");
    setLoading(false);
    props.navigation.navigate("Home");
  };

  const changeOrderType = () => {
    if (orderType === "fixed") {
      setOrderType("timed");
    } else {
      setOrderType("fixed");
    }
  };

  return (
    <Layout>
      {fileUrl && (
        <Image
          style={{
            width: "100%",
            height: 500,
            resizeMode: "contain",
          }}
          source={{
            uri: fileUrl,
          }}
        />
      )}
      {!fileUrl && (
        <Button
          title="Choose Photo"
          onPress={handleChoosePhoto}
          label="Upload photo"
          outline
          margin-10
          borderRadius={10}
        />
      )}
      <TextField
        placeholder="Spooky kid...."
        title="Enter name"
        onChangeText={(text) => onChangeName(text)}
        value={name}
      />
      <TextField
        placeholder="Neque porro quisquam est ...."
        title="Enter description"
        onChangeText={(text) => onChangeDescription(text)}
        value={description}
      />
      <View flex row marginB-20>
        <View
          width={120}
          height={40}
          style={
            orderType === "fixed" ? styles["fixed-btn"] : styles["timed-btn"]
          }
          onPress={changeOrderType}
        >
          <FontAwesome.Button
            height={35}
            size={16}
            name="dollar"
            backgroundColor={orderType === "fixed" ? "#6356E5" : "white"}
            color={orderType === "fixed" ? "white" : "black"}
            onPress={changeOrderType}
          >
            <Text
              style={{
                fontSize: 16,
                color: orderType === "fixed" ? "white" : "black",
              }}
            >
              Fixed Price
            </Text>
          </FontAwesome.Button>
        </View>
        <View
          marginL-30
          width={143}
          height={40}
          style={
            orderType !== "fixed" ? styles["fixed-btn"] : styles["timed-btn"]
          }
        >
          <FontAwesome.Button
            height={36}
            size={16}
            name="clock-o"
            backgroundColor={orderType !== "fixed" ? "#6356E5" : "white"}
            color={orderType !== "fixed" ? "white" : "black"}
            onPress={changeOrderType}
          >
            <Text
              style={{
                fontSize: 16,
                color: orderType !== "fixed" ? "white" : "black",
              }}
            >
              Timed Auction
            </Text>
          </FontAwesome.Button>
        </View>
      </View>
      {orderType === "timed" && (
        <Pressable onPress={() => setOpen(true)}>
          <View pointerEvents="none">
            <TextField
              placeholder="02-02-2021"
              title="Auction End Date"
              value={date.toLocaleDateString()}
            />
          </View>
        </Pressable>
      )}
      <DatePicker
        modal
        open={open}
        date={date}
        onConfirm={(date) => {
          setOpen(false);
          setDate(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
      <TextField
        placeholder="e.g. 1.52"
        title="Enter price(in eth)"
        onChangeText={(text) => onChangePrice(text)}
        value={price}
      />
      <Button
        title="Create NFT"
        onPress={createNFT}
        label="Create NFT"
      ></Button>
      {loading && (
        <LoaderScreen
          backgroundColor="rgba(255,255,255,0.9)"
          color="#6356E5"
          message="Creating NFT..."
          overlay
        />
      )}
    </Layout>
  );
}

const styles = StyleSheet.create({
  "fixed-btn": {
    backgroundColor: "#6356E5",
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#6356E5",
  },
  "timed-btn": { borderWidth: 2, borderColor: "#6356E5", borderRadius: 5 },
});
