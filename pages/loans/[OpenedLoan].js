import { LoanBox } from "@/componenets/LoanBox";
import { Navbar } from "@/componenets/Navbar";
import { useRouter } from "next/router";
import {
  GET_NEW_PROPOSED_TERMS,
  GET_PROPOSED_BUYOUTS,
} from "../../utils/queries";
import styles from "../../styles/openedLoan.module.css";
import { useEffect, useState } from "react";
import { FLEX_CORE_ABI } from "@/utils/abi";
import { EMPTY_ADDRESS, FLEX_CORE_ADDRESS } from "@/utils/Addresses";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { LoanDetails } from "@/componenets/states/LoanDetails";
import { useQuery } from "@apollo/client";
import { PROPOSAL_TO_TYPE } from "@/utils/assets";
import { BuyOut } from "@/componenets/BuyOut";

export default function OpenedLoan() {
  const router = useRouter();
  const { OpenedLoan: selectedLoanId } = router.query;

  console.log("Selected", selectedLoanId);

  const { loading, error, data } = useQuery(GET_NEW_PROPOSED_TERMS);
  const { data: proposedBuyouts } = useQuery(GET_PROPOSED_BUYOUTS, {
    variables: { loanID: selectedLoanId },
  });

  console.log(GET_PROPOSED_BUYOUTS);

  const [loanDetails, setLoanDetails] = useState();
  const [interest, setInterest] = useState();
  const [marginCutoff, setMarginCutoff] = useState();
  const [collateralRatio, setCollateralRatio] = useState();
  const [loanId, setLoanId] = useState();
  const [loanType, setLoanType] = useState();
  const [timePeriod, setTimePeriod] = useState();
  const [collateralAmount, setCollateralAmount] = useState();
  const [principalAmount, setPrincipalAmount] = useState();
  const [debt, setDebt] = useState();
  const [selectedLoanBuyouts, setSelectedLoanBuyouts] = useState([]);

  const { isWeb3Enabled, enableWeb3 } = useMoralis();

  const { runContractFunction: acceptProposal, error: err } = useWeb3Contract({
    abi: FLEX_CORE_ABI,
    contractAddress: FLEX_CORE_ADDRESS,
    functionName: "accept_new_proposal",
    params: {
      _loan_id: selectedLoanId,
    },
  });

  if (err) console.log(err);

  const { runContractFunction: getLoanDetails } = useWeb3Contract({
    abi: FLEX_CORE_ABI,
    contractAddress: FLEX_CORE_ADDRESS,
    functionName: "get_loan_Details_by_id",
    params: {
      loan_id: selectedLoanId,
    },
  });

  async function UpdateUI() {
    let loan_details = await getLoanDetails();
    setLoanDetails(loan_details);

    let collateral_ratio = await loan_details.collateral_ratio;
    setCollateralRatio(collateral_ratio.toString());

    let interest_rate = await loan_details.fixed_interest_rate;
    setInterest(interest_rate.toString());
    let margin_cutoff = await loan_details.margin_cutoff;
    setMarginCutoff(margin_cutoff.toString());
    let loan_id = await loan_details.loan_id;
    setLoanId(margin_cutoff.toString());
    let loan_type = await loan_details.loan_type;
    setLoanType(loan_type.toString());
    let time_period = await loan_details.time_amount;
    setTimePeriod(time_period);
    let coll_amount = await loan_details.collateral_deposited;
    setCollateralAmount(coll_amount);
    let prin_amount = await loan_details.borrow_amount;
    setPrincipalAmount(prin_amount);
    let debt = await loan_details.current_debt;
    setDebt(debt);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      UpdateUI();
    } else enableWeb3();
  }, [isWeb3Enabled]);

  console.log(data);
  console.log("propo", proposedBuyouts);

  // TEST SECTION
  // END

  return (
    <main className={styles.main}>
      <Navbar />

      <div className={styles.openedLoan}>
        <h3>Loan Information</h3>
        <div className={styles.loanGraphics}>
          {loanDetails && (
            <>
              <>
                <div className={styles.loans}>
                  <LoanBox
                    index={2}
                    loanId={selectedLoanId}
                    collateraltype={loanDetails.collateral_type}
                    principalType={loanDetails.principal_type.toLowerCase()}
                    interest={interest}
                    marginCutoff={marginCutoff}
                    collateralRatio={collateralRatio}
                    time={loanDetails.time_limit}
                  />
                </div>

                <LoanDetails
                  loanId={selectedLoanId}
                  collateralType={loanDetails.collateral_type}
                  principalType={loanDetails.principal_type.toLowerCase()}
                  loanType={loanType}
                  lenderAddress={loanDetails.lender}
                  borrowerAddress={loanDetails.borrower}
                  accessControl={loanDetails.access_control}
                  timeLimit={loanDetails.time_limit}
                  timePeriod={timePeriod}
                  loanState={loanDetails.state}
                  collateralAmount={collateralAmount}
                  principalAmount={principalAmount}
                  debt={debt}
                />
              </>
            </>
          )}
        </div>

        {loanDetails && (
          <div className={styles.proposedNewTerms}>
            <div className={styles.borrower}>
              {data &&
                data.proposedLoans.map((proposedLoan) => {
                  if (proposedLoan.loan_id == selectedLoanId)
                    if (
                      PROPOSAL_TO_TYPE[proposedLoan.proposer_type] == "BORROWER"
                    ) {
                      console.log("datattt", data);
                      return (
                        <div className={styles.loans}>
                          <h3>New Terms Proposed By Borrower</h3>
                          <LoanBox
                            index={2}
                            loanId={proposedLoan.loan_id}
                            collateraltype={loanDetails.collateral_type.toLowerCase()}
                            principalType={loanDetails.principal_type.toLowerCase()}
                            interest={proposedLoan.fixed_interest_rate}
                            marginCutoff={proposedLoan.margin_cutoff}
                            collateralRatio={collateralRatio}
                            time={proposedLoan.time_limit}
                          />
                          <button onClick={() => acceptProposal()}>
                            Accept
                          </button>
                        </div>
                      );
                    }
                })}
            </div>

            <div className={styles.lender}>
              {data &&
                data.proposedLoans.map((proposedLoan) => {
                  if (proposedLoan.loan_id == selectedLoanId)
                    if (
                      PROPOSAL_TO_TYPE[proposedLoan.proposer_type] == "LENDER"
                    ) {
                      return (
                        <div className={styles.loans}>
                          <h3>New Terms Proposed By Lender</h3>
                          <LoanBox
                            index={2}
                            loanId={proposedLoan.loan_id}
                            collateraltype={loanDetails.collateralType}
                            principalType={loanDetails.principalType}
                            interest={proposedLoan.fixed_interest_rate}
                            marginCutoff={proposedLoan.margin_cutoff}
                            collateralRatio={collateralRatio}
                            time={proposedLoan.time_limit}
                          />
                          <button onClick={() => acceptProposal()}>
                            Accept
                          </button>
                        </div>
                      );
                    }
                })}
            </div>
          </div>
        )}

        <div>
          <h3>Proposed Buyouts</h3>
          <div className={styles.buyouts}>
            {proposedBuyouts &&
              proposedBuyouts.buyOuts.map((item) => {
                return (
                  <BuyOut
                    loanId={selectedLoanId}
                    buyer={item.buyer}
                    buyoutAmount={item.buyout_amount}
                  />
                );
              })}
          </div>
        </div>
      </div>
    </main>
  );
}
