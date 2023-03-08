import { FLEX_CORE_ABI } from "@/utils/abi";
import { FLEX_CORE_ADDRESS } from "@/utils/Addresses";
import { truncateAddr } from "@/utils/assets";
import { useWeb3Contract } from "react-moralis";
import styles from "../styles/components/BuyOut.module.css";

export const BuyOut = ({ buyer, buyoutAmount, loanId }) => {
  const { runContractFunction: buyOut } = useWeb3Contract({
    abi: FLEX_CORE_ABI,
    contractAddress: FLEX_CORE_ADDRESS,
    functionName: "accept_loan_buyout",
    params: {
      _loan_id: loanId,
      _buyer: buyer,
    },
  });

  const { runContractFunction: cancelBuyout, error: err } = useWeb3Contract({
    abi: FLEX_CORE_ABI,
    contractAddress: FLEX_CORE_ADDRESS,
    functionName: "cancel_loan_buyout",
    params: {
      _loan_id: loanId,
    },
  });

  if (err) console.log(err);

  return (
    <div className={styles.buyOut}>
      <div className={styles.text}>
        <h5>Buyer Address</h5>
        <p>{truncateAddr(buyer)}</p>
      </div>

      <div className={styles.text}>
        <h5>Buyout Amount</h5>
        <p>{buyoutAmount / 10 ** 18}</p>
      </div>

      <div>
        <button className={styles.accept} onClick={() => buyOut()}>
          Accept
        </button>
      </div>

      <div>
        <button className={styles.cancel} onClick={() => cancelBuyout()}>
          Cancel
        </button>
      </div>
    </div>
  );
};
