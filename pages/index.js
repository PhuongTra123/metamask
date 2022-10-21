import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import Web3 from "web3";
import { injected } from "../components/wallet/connectors";
import { ethers } from "ethers";
import Image from "next/image";

export default function Home() {
  const { active, account, library, connector, activate, deactivate } =
    useWeb3React();
  const [balance, setBalance] = useState(null);

  async function connect() {
    try {
      if (!window.ethereum) {
        alert("Click OK to install MetaMask");
        window.open("https://metamask.io/download/", "_blank");
        setErrorMessage(
          "Please install MetaMask browser extension to interact"
        );
      }
      await activate(injected);
      localStorage.setItem("isWalletConnected", true);
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
      deactivate();
      localStorage.setItem("isWalletConnected", false);
    } catch (ex) {
      console.log(ex);
    }
  }

  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      if (localStorage?.getItem("isWalletConnected") === "true") {
        try {
          await activate(injected);
          localStorage.setItem("isWalletConnected", true);
        } catch (ex) {
          console.log(ex);
        }
      }
    };
    connectWalletOnPageLoad();
  }, []);

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
          {active ? 'MetaMask connected' : 'Connect to MetaMask'}
        </button>
        {active ? (
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
