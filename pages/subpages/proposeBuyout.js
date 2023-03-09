import { Navbar } from "@/componenets/Navbar";
import { ERC20_ABI, FLEX_CORE_ABI } from "@/utils/abi";
import { FLEX_CORE_ADDRESS } from "@/utils/Addresses";
import { GET_NEW_PROPOSED_TERMS } from "@/utils/queries";
import { ASSET_ADDRESS_TO_NAME, convertToWei } from "@/utils/assets";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useQuery, gql } from "@apollo/client";
import styles from "../../styles/subpages/proposeNewTerms.module.css";

export default function ProposeBuyout() {
  const [loanId, setLoanId] = useState();
  const [buyoutAmount, setBuyoutAmount] = useState();
  const [approveAmount, setApproveAmount] = useState();
  const [loanDetails, setLoanDetails] = useState();
  const [principalType, setPrincipalType] = useState();

  const { isWeb3Enabled, enableWeb3 } = useMoralis();
  const { runContractFunction: buyOutLoan, error } = useWeb3Contract({
    abi: FLEX_CORE_ABI,
    contractAddress: FLEX_CORE_ADDRESS,
    functionName: "propose_loan_buyout",
    params: {
      _loan_id: loanId,
      _buyout_amount: convertToWei(buyoutAmount),
    },
    msgValue:
      ASSET_ADDRESS_TO_NAME[principalType] == "FTM" &&
      convertToWei(buyoutAmount),
  });

  if (error) console.log(error);

  const { runContractFunction: getLoanDetails } = useWeb3Contract({
    abi: FLEX_CORE_ABI,
    contractAddress: FLEX_CORE_ADDRESS,
    functionName: "get_loan_Details_by_id",
    params: {
      loan_id: loanId,
    },
  });

  const { runContractFunction: approve } = useWeb3Contract({
    abi: ERC20_ABI,
    contractAddress: principalType,
    functionName: "approve",
    params: {
      spender: FLEX_CORE_ADDRESS,
      amount: approveAmount && convertToWei(approveAmount),
    },
  });

  async function UpdateUI() {
    let loan_details = await getLoanDetails();
    setLoanDetails(loan_details);

    if (loan_details) {
      let principal_type = (await loan_details).principal_type;
      setPrincipalType(principal_type);
    }
    console.log(loanDetails);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      UpdateUI();
    } else enableWeb3();
  }, [loanId]);

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
          <h3>Propose Buyout</h3>
          <p>
            Propose To buyout a loan that you are interested in from a
            particular lender and pay the lender off for the loan.
          </p>
        </div>

        <div className={styles.proposeForm}>
          <div>
            <p>loan id :</p>
            <input onChange={(e) => setLoanId(e.target.value)} />
          </div>

          {principalType && ASSET_ADDRESS_TO_NAME[principalType] != "FTM" ? (
            <div className={styles.approve}>
              <input onChange={(e) => setApproveAmount(e.target.value)} />
              <button onClick={() => approve()}>Approve</button>
            </div>
          ) : (
            ""
          )}

          <div>
            <p>buyout amount in loan principle : </p>
            <input onChange={(e) => setBuyoutAmount(e.target.value)} />
          </div>

          <button
            onClick={() => buyOutLoan()}
            className={styles.proposeNewTermsButton}
          >
            Buyout Loan
          </button>
        </div>
      </div>
    </main>
  );
}
