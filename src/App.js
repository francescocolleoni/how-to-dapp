import { useState } from 'react';
import { ethers } from 'ethers';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json';
import Token from './artifacts/contracts/Token.sol/Token.json';

import './App.css';

const greeterAddress = "0x2c4079f7e364BE9E6bD733F062eE33f66c612fa7";
const tokenAddress = "0x7567E5F8c3d20d1c75DC9a91fDD51BF57dD20010";

const App = () => {
  const [greeting, setGreetingValue] = useState();
  const [userAccount, setUserAccount] = useState();
  const [amount, setAmount] = useState();

  const requestAccount = async () => {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  const fetchGreeting = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log({ provider });
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider);

      try {
        const data = await contract.greet();
        console.log('data: ', data);
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  }

  const setGreeting = async () => {
    if (!greeting) {
      return;
    }

    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log({ provider });
      const signer = provider.getSigner();
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      const transaction = await contract.setGreeting(greeting);
      await transaction.wait();
      fetchGreeting();
    }
  }

  const getBalance = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(tokenAddress, Token.abi, provider);
      const balance = await contract.balanceOf(account);
      console.log("Balance: ", balance.toString());
    }
  }

  const sendCoins = async () => {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, Token.abi, signer);
      const transation = await contract.transfer(userAccount, amount);
      await transation.wait();
      console.log(`${amount} Coins successfully sent to ${userAccount}`);
    }
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h3>How to DApp (?)</h3>

      <h5>Greetings</h5>
      <div style={{ marginTop: '0.25rem' }}>
        <button onClick={fetchGreeting}>Fetch Greeting</button>
      </div>

      <div style={{ marginTop: '0.25rem' }}>
        <button onClick={setGreeting}>Set Greeting</button>
      </div>

      <div style={{ marginTop: '0.25rem' }}>
        <input onChange={e => setGreetingValue(e.target.value)} placeholder="Set greeting" />
      </div>

      <h5>Balance</h5>
      <div style={{ marginTop: '0.25rem' }}>
        <button onClick={getBalance}>Get Balance</button>
      </div>

      <div style={{ marginTop: '0.25rem' }}>
        <button onClick={sendCoins}>Send Coins</button>
      </div>

      <div style={{ marginTop: '0.25rem' }}>
        <input onChange={e => setUserAccount(e.target.value)} placeholder="Account ID" />
      </div>

      <div style={{ marginTop: '0.25rem' }}>
        <input onChange={e => setAmount(e.target.value)} placeholder="Amount" />
      </div>
    </div>
  );
}

export { App };