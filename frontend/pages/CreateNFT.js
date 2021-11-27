import React, { useState } from "react";
import { Text, Button, Image } from "react-native-ui-lib";
import Layout from "../component/Layout";
import { launchImageLibrary } from "react-native-image-picker";
import { useMoralisFile } from "react-moralis";
import { useMoralisDapp } from "../providers/MoralisDappProvider/MoralisDappProvider";

export default function CreateNFT(props) {
  const { nFTContract, sendTransaction } = useMoralisDapp();
  const { error, isUploading, moralisFile, saveFile } = useMoralisFile();
  const [fileUrl, setFileUrl] = useState(null);
  const [name, setName] = useState("Varun's Unique NFT");
  const [description, setDescription] = useState("Yes, it is the coolest NFT");

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
    const res = await saveFile(
      "metadata.json",
      { base64: Buffer.from(JSON.stringify(data)).toString("base64") },
      {
        type: "application/json",
        saveIPFS: true,
      }
    );
    const NFTUrl = res.ipfs();
    // Generate NFT
    const transaction = await nFTContract.populateTransaction.createToken(
      NFTUrl
    );
    const res1 = await sendTransaction(transaction);
    console.log(res1);
  };

  return (
    <Layout>
      <Text>Create NFT</Text>
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
      <Button
        title="Create NFT"
        onPress={createNFT}
        label="Create NFT"
      ></Button>
    </Layout>
  );
}
