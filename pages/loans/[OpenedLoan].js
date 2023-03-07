import { LoanBox } from "@/componenets/LoanBox";
import { Navbar } from "@/componenets/Navbar";
import { useRouter } from "next/router";
import { GET_LOANS } from "../../utils/queries";
import styles from "../../styles/openedLoan.module.css";
import { useEffect, useState } from "react";
import { FLEX_CORE_ABI } from "@/utils/abi";
import { FLEX_CORE_ADDRESS } from "@/utils/Addresses";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { ACCEPTED, DEACTIVATED, FULFILLED, PROPOSED } from "@/utils/assets";
import { ProposedLoan } from "@/componenets/states/proposedLoan";
import { AcceptedLoan } from "@/componenets/states/AcceptedLoan";
import { FulfilledLoan } from "@/componenets/states/FulfilledLoan";
import { DeactivatedLoan } from "@/componenets/states/DeactivatedLoan";

export default function OpenedLoan() {
  const router = useRouter();

  const [loanDetails, setLoanDetails] = useState();
  const [interest, setInterest] = useState();
  const [marginCutoff, setMarginCutoff] = useState();
  const [collateralRatio, setCollateralRatio] = useState();
  const [loanId, setLoanId] = useState();
  const [loanType, setLoanType] = useState();
  const [timePeriod, setTimePeriod] = useState();

  const { isWeb3Enabled, enableWeb3 } = useMoralis();
  const { OpenedLoan: selectedLoanId } = router.query;
  const {
    data,
    error,
    runContractFunction: getLoanDetails,
    isFetching,
    isLoading,
  } = useWeb3Contract({
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
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      UpdateUI();
    } else enableWeb3();
  }, [isWeb3Enabled]);

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
              {/* PROPOSED   */}
              {loanDetails.state == PROPOSED && (
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

                  <ProposedLoan
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
                  />
                </>
              )}
              {/* ACCEPTED */}
              {loanDetails.state == ACCEPTED && (
                <>
                  <div className={styles.loans}>
                    <LoanBox
                      index={3}
                      loanId={loanId}
                      collateraltype={loanDetails.collateral_type}
                      principalType={loanDetails.principal_type.toLowerCase()}
                      interest={interest}
                      marginCutoff={marginCutoff}
                      collateralRatio={collateralRatio}
                      time={loanDetails.time_limit}
                    />
                  </div>

                  <AcceptedLoan />
                </>
              )}
              {/* FULFILLED */}
              {loanDetails.state == FULFILLED && (
                <>
                  <div className={styles.loans}>
                    <LoanBox
                      index={3}
                      loanId={selectedLoanId}
                      collateraltype={loanDetails.collateral_type}
                      principalType={loanDetails.principal_type.toLowerCase()}
                      interest={interest}
                      marginCutoff={marginCutoff}
                      collateralRatio={collateralRatio}
                      time={loanDetails.time_limit}
                    />
                  </div>

                  <FulfilledLoan />
                </>
              )}
              {/* DEACTIVATED */}
              {loanDetails.state == DEACTIVATED && (
                <>
                  <div className={styles.loans}>
                    <LoanBox
                      index={3}
                      loanId={selectedLoanId}
                      collateraltype={loanDetails.collateral_type}
                      principalType={loanDetails.principal_type.toLowerCase()}
                      interest={interest}
                      marginCutoff={marginCutoff}
                      collateralRatio={collateralRatio}
                      time={loanDetails.time_limit}
                    />
                  </div>

                  <DeactivatedLoan />
                </>
              )}
            </>
          )}
        </div>

        <div className={styles.loanInformation}></div>
      </div>
    </main>
  );
}
