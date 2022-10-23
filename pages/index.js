import { useEffect, useState } from "react";
// import Web3 from "web3";
import { ethers } from "ethers";
import Image from "next/image";

export default function Home() {
  const [balance, setBalance] = useState(null);
  const [account, setAccount] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  async function connect() {
    try {
      if (!window.ethereum) {
        alert("Click OK to install MetaMask");
        window.open("https://metamask.io/download/", "_blank");
        setErrorMessage(
          "Please install MetaMask browser extension to interact"
        );
      }
      const bsc = {
        chainId: `0x${Number(56).toString(16)}`,
        chainName: "Binance Smart Chain Mainnet",
        nativeCurrency: {
          name: "Binance Chain Native Token",
          symbol: "BNB",
          decimals: 18,
        },
        rpcUrls: [
          "https://bsc-dataseed1.binance.org",
          "https://bsc-dataseed2.binance.org",
          "https://bsc-dataseed3.binance.org",
          "https://bsc-dataseed4.binance.org",
          "https://bsc-dataseed1.defibit.io",
          "https://bsc-dataseed2.defibit.io",
          "https://bsc-dataseed3.defibit.io",
          "https://bsc-dataseed4.defibit.io",
          "https://bsc-dataseed1.ninicoin.io",
          "https://bsc-dataseed2.ninicoin.io",
          "https://bsc-dataseed3.ninicoin.io",
          "https://bsc-dataseed4.ninicoin.io",
          "wss://bsc-ws-node.nariox.org",
        ],
        blockExplorerUrls: ["https://bscscan.com"],
      };
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            ...bsc,
          },
        ],
      });
      setAccount(window.ethereum.selectedAddress);
      await window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          setConnButtonText("Wallet Connected");
          setAccount(result[0]);
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });

      const provider = new ethers.providers.Web3Provider(web3.currentProvider);
      const signer = provider.getSigner();
      const bal = await signer.getBalance();
      const balance = ethers.utils.formatEther(bal);
      setBalance(balance);
    } catch (ex) {
      console.log(ex);
    }
  }

  async function disconnect() {
    try {
      window.location.reload();
    } catch (ex) {
      console.log(ex);
    }
  }

  return (
    <div className="h-[100vh] flex items-center justify-center m-auto">
      <div className="flex flex-col items-center w-[500px] h-[360px] bg-[powderblue]">
        <div className="mb-4">
          <Image src="/metamask.png" alt="metamask" width={500} height={200} />
        </div>
        <button
          onClick={connect}
          className="py-2 mb-4 text-lg font-bold text-white rounded-lg w-56 bg-blue-600 hover:bg-blue-800"
        >
          {account ? "MetaMask connected" : "Connect to MetaMask"}
        </button>
        {account ? (
          <div>
            <div>
              <b> Address: </b>
              {account}
            </div>
            <div>
              <b>Balance: </b>
              {balance}
            </div>
            <div
              onClick={disconnect}
              className="text-center text-lg font-bold rounded-lg hover:underline cursor-pointer"
            >
              Disconnect
            </div>
          </div>
        ) : (
          <span>Not connected</span>
        )}
      </div>
    </div>
  );
}
