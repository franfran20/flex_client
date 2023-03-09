import { Navbar } from "@/componenets/Navbar";
import { ERC20_ABI } from "@/utils/abi";
import { ASSETS, convertToWei } from "@/utils/assets";
import { useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import styles from "../styles/faucet.module.css";

export default function faucet() {
  const [flexAmount, setFlexAmount] = useState();
  const [usdtAmount, setUsdtAmount] = useState();
  const { account } = useMoralis();

  const { runContractFunction: mintFlex } = useWeb3Contract({
    abi: ERC20_ABI,
    contractAddress: ASSETS[1].address,
    functionName: "mint",
    params: {
      recipient: account,
      amount: convertToWei(flexAmount),
    },
  });

  const { runContractFunction: mintUsdt } = useWeb3Contract({
    abi: ERC20_ABI,
    contractAddress: ASSETS[3].address,
    functionName: "mint",
    params: {
      recipient: account,
      amount: convertToWei(usdtAmount),
    },
  });

  return (
    <div>
      <Navbar />

      <div className={styles.main}>
        <div>
          <h2>request Flex</h2>
          <input onClick={(e) => setFlexAmount(e.target.value)} />
          <button onClick={() => mintFlex()}>Get Flex</button>
        </div>

        <div>
          <h2>request Usdt</h2>
          <input onClick={(e) => setUsdtAmount(e.target.value)} />
          <button onClick={() => mintUsdt()}>Get Usdt</button>
        </div>
      </div>
    </div>
  );
}
