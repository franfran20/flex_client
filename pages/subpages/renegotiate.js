import { Navbar } from "@/componenets/Navbar";
import { FLEX_CORE_ABI } from "@/utils/abi";
import { FLEX_CORE_ADDRESS } from "@/utils/Addresses";
import { GET_NEW_PROPOSED_TERMS } from "@/utils/queries";
import Image from "next/image";
import { useState } from "react";
import { useWeb3Contract } from "react-moralis";
import { useQuery, gql } from "@apollo/client";
import styles from "../../styles/subpages/proposeNewTerms.module.css";

export default function renegotiate() {
  const [loanId, setLoanId] = useState();
  const [marginCutoff, setMarginCutoff] = useState();
  const [interest, setInterest] = useState();
  const [time, setTime] = useState();
  const [renegotiationID, setRenegotiationID] = useState();
  const [collateralRatio, setCollateralRatio] = useState();

  const { runContractFunction: renegotiate } = useWeb3Contract({
    abi: FLEX_CORE_ABI,
    contractAddress: FLEX_CORE_ADDRESS,
    functionName: "renegotiate",
    params: {
      _loan_id: loanId,
      _user_custom_id: renegotiationID,
      _margin_cutoff: marginCutoff,
      _collateral_ratio: collateralRatio,
      _fixed_intererst_rate: interest,
      _time_amount: time ? time : 0,
    },
  });

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
          <h3>Propose Renegotiation</h3>
          <p>
            Propose Your Renegotiationt to a particular loan and hopefully get
            the deal accepted
          </p>
        </div>

        <div className={styles.proposeForm}>
          <div>
            <p>loan id :</p>
            <input onChange={(e) => setLoanId(e.target.value)} />
          </div>

          <div>
            <p>renegotiation id :</p>
            <input onChange={(e) => setRenegotiationID(e.target.value)} />
          </div>

          <div>
            <p>collateral ratio :</p>
            <input onChange={(e) => setCollateralRatio(e.target.value)} />
          </div>

          <div>
            <p>margin cutoff(%) : </p>
            <input onChange={(e) => setMarginCutoff(e.target.value)} />
          </div>

          <div>
            <p>fixed interest rate(%) : </p>
            <input onChange={(e) => setInterest(e.target.value)} />
          </div>

          <div>
            <p>time(only if your loan had a time limit) : </p>
            <input onChange={(e) => setTime(e.target.value)} />
          </div>

          <button
            onClick={() => renegotiate()}
            className={styles.proposeNewTermsButton}
          >
            Propose renegotiation
          </button>
        </div>
      </div>
    </main>
  );
}
