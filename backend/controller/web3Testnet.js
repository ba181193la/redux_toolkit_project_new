
import Web3 from 'web3';
import AbiToken from '../abi/erc20.json'
// Connect to Sepolia network via Infura
const INFURA_PROJECT_ID = '6d1f1df485c8448cade89ce8cbe1255f';
// const web3 = new Web3(`https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`);
const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');


export  const sendSepoliaTransaction=async() =>{
try {
const senderAddress = '0x253BeA68f018906C12872ca9FAe4dcDD635ef64F';
const receiverAddress = '0x2423e4d970000746EB46cFf702F3Ad60FbcAE633';
const privateKey = 'ca5e56cb920baae20cb6de9af173c783064bd6a7f59312cc325878d3de17c9f6';

const balance = await web3.eth.getBalance(senderAddress);
console.log('Balance:', web3.utils.fromWei(balance, 'ether'), 'ETH');

const gasPrice = await web3.eth.getGasPrice();
const nonce = await web3.eth.getTransactionCount(senderAddress, 'latest');

const tx = {
  from: senderAddress,
  to: receiverAddress,
  value: web3.utils.toWei('0.001', 'ether'),
  gas: 21000,
  gasPrice: gasPrice,
  nonce: nonce,
  chainId: 11155111,
};

const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

console.log('✅ Transaction successful with hash:', receipt.transactionHash);

  } catch (err) {
    console.error('❌ Transaction failed:', err);
  }
}

async function sendToken(tokenHolder, HolderSecretKey, toAddress, amount) { 
             
  const gasPrice = await web3.eth.getGasPrice();
  const gasLimit = 200000;
  const walletSecret = HolderSecretKey; 

  // Creating a signing account from a private key
  const signer = web3.eth.accounts.privateKeyToAccount(walletSecret);
  web3.eth.accounts.wallet.add(signer); 
  const nedTokenContractAddress = "0x00MY_ERC20_CONTRACTADRESS";
  const web3contract = new web3.eth.Contract(transferABI, nedTokenContractAddress, { from: signer.address } )
  const amountInWei = web3.utils.toWei(amount, "ether");
  
  const params = {
      from: tokenHolder,
      to: nedTokenContractAddress, 
      nonce: await web3.eth.getTransactionCount(tokenHolder),
      value: '0x00',
      data: web3contract.methods.transfer(toAddress, amountInWei).encodeABI(), 
      gasPrice: web3.utils.toHex(gasPrice),
      gasLimit: web3.utils.toHex(gasLimit),  
  };

  const signedTx = await web3.eth.accounts.signTransaction(params, walletSecret); 

  const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
  .once("transactionHash", (txhash) => {  
  console.log(`Mining transaction ...`);
  console.log(`https://polygonscan.com/tx/${txhash}`); 
  alert(txhash); 
  });
  // The transaction is now on chain!
  console.log(`Mined in block ${receipt.blockNumber}`); 
} 










// async function transferToken() {
//   try {
//     const tokenAddress = '0xD4aB1C6Bfb437862354E5a0edB5439e0CF19e8d9'; // Replace with actual token contract (e.g., USDT, DAI)
//   const fromAddress = '0x253BeA68f018906C12872ca9FAe4dcDD635ef64F';
//   const toAddress = '0x2423e4d970000746EB46cFf702F3Ad60FbcAE633';
//   const privateKey = 'ca5e56cb920baae20cb6de9af173c783064bd6a7f59312cc325878d3de17c9f6'; // Keep secure
//   const contract = new web3.eth.Contract(AbiToken, tokenAddress);
//   const amount = '100'; // 100 tokens (human-readable)

//   const balance = await contract.methods.balanceOf(fromAddress).call();
//   console.log('Token Balance:', web3.utils.fromWei(balance, 'ether'), 'Tokens');

// const decimals = await contract.methods.decimals().call(); // returns a string
// console.log('Decimals:', decimals); // 18 for most tokens
// const value = BigInt(amount) * (10n ** BigInt('18')); // ✅ convert to BigInt
// // console.log('Value to send:', value.toString(), 'in base unit'); // 100000000000000000000
                    



// const txData = contract.methods.transfer(toAddress, value.toString()).encodeABI();
//   const gasPrice = await web3.eth.getGasPrice(); // get current gas price from network
  
//   const tx = {
//     to: tokenAddress,             // Sending to the token contract
//     data: txData,                 // What we want to do: call transfer()
//     gas: 100000,                  // Or use estimateGas
//     gasPrice: gasPrice,           // Network gas price
//   };
  
//   const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
//   const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  
//   console.log('✅ Transaction hash:', receipt.transactionHash);
  
// } catch (err) {
//     console.error('❌ Transfer failed:', err.message);
//   }
// }

// transferToken();




// // Wallets
// const senderAddress = '0xYourSenderAddress';
// const receiverAddress = '0xReceiverAddress';
// const privateKey = '0xYourPrivateKey'; // Never expose in production

async function sendBNB() {
  try {
    const senderAddress = '0x253BeA68f018906C12872ca9FAe4dcDD635ef64F';
const receiverAddress = '0x2423e4d970000746EB46cFf702F3Ad60FbcAE633';
const privateKey = 'ca5e56cb920baae20cb6de9af173c783064bd6a7f59312cc325878d3de17c9f6';
    const nonce = await web3.eth.getTransactionCount(senderAddress, 'latest');
    const gasPrice = await web3.eth.getGasPrice(); // dynamic pricing

    const tx = {
      from: senderAddress,
      to: receiverAddress,
      value: web3.utils.toWei('0.01', 'ether'), // Send 0.01 tBNB
      gas: 21000,
      gasPrice: gasPrice,
      nonce: nonce,
      chainId: 97, // BSC Testnet Chain ID
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    console.log('✅ Transaction sent! Hash:', receipt.transactionHash);
  } catch (err) {
    console.error('❌ Transaction failed:', err.message);
    console.dir(err, { depth: null });
  }
}

sendBNB();

// sendSepoliaTransaction();

// 0xD4aB1C6Bfb437862354E5a0edB5439e0CF19e8d9

// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.24;
// import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol';

// contract ZpixToken is ERC20 {
//      constructor() ERC20("ZpixToken", "ZIPX"){
//         _mint(0x253BeA68f018906C12872ca9FAe4dcDD635ef64F, 1000000*10**18);

//     }
// }