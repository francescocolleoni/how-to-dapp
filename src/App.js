import { useState } from 'react';
import { ethers } from 'ethers';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json';
import Token from './artifacts/contracts/Token.sol/Token.json';
import NDToken from './artifacts/contracts/NDToken.sol/NDToken.json';

import './App.css';

const greeterAddress = `${process.env.REACT_APP_GREETER_ADDRESS}`;
const tokenAddress = `${process.env.REACT_APP_TOKEN_ADDRESS}`;
const ndTokenAddress = `${process.env.REACT_APP_ND_TOKEN_ADDRESS}`;

const App = () => {
  const [greeting, setGreetingValue] = useState();
  const [userAccount, setUserAccount] = useState();
  const [amount, setAmount] = useState();
  const [ndTokenInfo, setNDTokenInfo] = useState();

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

  const fetchNDTokenSymbolAndName = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log({ provider });
      const contract = new ethers.Contract(ndTokenAddress, NDToken.abi, provider);

      try {
        const name = await contract.name();
        const symbol = await contract.symbol();
        const decimals = await contract.decimals();
        const totalSupply = await contract.totalSupply();

        setNDTokenInfo(`${symbol} ${name}, decimals: ${decimals}, total supply: ${totalSupply}`);
        console.log('token name: ', name);
        console.log('token symbol: ', symbol);
        console.log('token decimals: ', decimals);
        console.log('token totalSupply: ', totalSupply);
      } catch (err) {
        console.log("Error: ", err);
      }
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

      <h5>NDToken</h5>
      <div style={{ marginTop: '0.25rem' }}>
        <button onClick={fetchNDTokenSymbolAndName}>Fetch NDToken symbol and name</button>
        {
          ndTokenInfo && <div>{ndTokenInfo}</div>
        }
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