import { Navbar } from "@/componenets/Navbar";
import { ERC20_ABI, FLEX_CORE_ABI } from "@/utils/abi";
import { FLEX_CORE_ADDRESS } from "@/utils/Addresses";
import { ASSET_ADDRESS_TO_NAME, convertToWei } from "@/utils/assets";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import styles from "../../styles/subpages/proposeNewTerms.module.css";

export default function ChangeLoanTerms() {
  const [loanId, setLoanId] = useState();
  const [buyoutAmount, setBuyoutAmount] = useState();
  const [approveAmount, setApproveAmount] = useState();
  const [loanDetails, setLoanDetails] = useState();
  const [principalType, setPrincipalType] = useState();

  const [marginCutOff, setMarginCutoff] = useState();
  const [collateralRatio, setCollateralRatio] = useState();
  const [interest, setInterest] = useState();
  const [time, setTime] = useState();

  const { isWeb3Enabled, enableWeb3 } = useMoralis();

  const { runContractFunction: changeLoanTerms, error: err } = useWeb3Contract({
    abi: FLEX_CORE_ABI,
    contractAddress: FLEX_CORE_ADDRESS,
    functionName: "change_original_loan_terms",
    params: {
      _loan_id: loanId,
      _margin_cutoff: marginCutOff,
      _collateral_ratio: collateralRatio,
      _fixed_intererst_rate: interest,
      _time_amount: time,
    },
    msgValue:
      ASSET_ADDRESS_TO_NAME[principalType] == "FTM" &&
      convertToWei(buyoutAmount),
  });

  if (err) console.log(err);

  return (
    <main>
      <Navbar />

      <div className={styles.proposeNewTerms}>
        <div className={styles.text}>
          <Image
            src="/illustrations/proposeNewTermsIllustartion.png"
            width="1000"
            height="1000"
          />
          <h3>Change Loan Terms</h3>
          <p>Change Your Loan Terms To Meet The demand of the market</p>
        </div>

        <div className={styles.proposeForm}>
          <div>
            <p>loan id :</p>
            <input onChange={(e) => setLoanId(e.target.value)} />
          </div>

          <div>
            <p>collateral ratio :</p>
            <input onChange={(e) => setCollateralRatio(e.target.value)} />
          </div>

          <div>
            <p>margin cutoff :</p>
            <input onChange={(e) => setMarginCutoff(e.target.value)} />
          </div>

          <div>
            <p>interest :</p>
            <input onChange={(e) => setInterest(e.target.value)} />
          </div>

          <div>
            <p>time :</p>
            <input onChange={(e) => setTime(e.target.value)} />
          </div>

          <button
            onClick={() => changeLoanTerms()}
            className={styles.proposeNewTermsButton}
          >
            Change Loan Terms
          </button>
        </div>
      </div>
    </main>
  );
}
