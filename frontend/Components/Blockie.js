// import React from "react";
// import Blockies from "react-blockies";
// import { useMoralisDapp } from "../providers/MoralisDappProvider/MoralisDappProvider";

// /**
//  * Shows a blockie image for the provided wallet address
//  * @param {*} props
//  * @returns <Blockies> JSX Elemenet
//  */

// function Blockie(props) {
//   const { walletAddress } = useMoralisDapp();
//   if ((!props.address && !props.currentWallet) || !walletAddress) return null;

//   return (
//     <Blockies
//       blockies={
//         props.currentWallet
//           ? walletAddress.toLowerCase()
//           : props.address.toLowerCase()
//       }
//       {...props}
//     />
//   );
// }

// export default Blockie;
