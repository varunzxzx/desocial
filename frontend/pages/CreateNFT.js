import React, { useState } from "react";
import { Text, Button, Image, TextField } from "react-native-ui-lib";
import Layout from "../component/Layout";
import { launchImageLibrary } from "react-native-image-picker";
import { useMoralisFile } from "react-moralis";
import { useMoralisDapp } from "../providers/MoralisDappProvider/MoralisDappProvider";
import { ethers } from "ethers";
import { parseEther } from "@ethersproject/units";

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
    const decodedTx = nFTContractInterface.parseLog(tx.logs[0]);
    const event = decodedTx.args;

    const tokenId = event[2].toNumber();
    const NFTPrice = ethers.utils.parseUnits(price, "ether");
    let listingPrice = await nFTMarketContract.getListingPrice();
    // Create market item
    console.log(user.id, typeof user.id);
    transaction = await nFTMarketContract.populateTransaction.createMarketItem(
      ethers.utils.getAddress(nFTContractAddress),
      tokenId,
      NFTPrice,
      user.id.toNumber(),
      { value: listingPrice }
    );
    console.log(transaction);
    setTransaction(transaction);
  };

  async function createMarketItem() {
    await sendTransaction(transaction);
  }

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
      <Button
        title="Create Market Item"
        onPress={createMarketItem}
        label="Create Market Item"
      ></Button>
    </Layout>
  );
}
