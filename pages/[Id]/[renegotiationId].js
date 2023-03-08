import { LoanBox } from "@/componenets/LoanBox";
import { Navbar } from "@/componenets/Navbar";
import { FLEX_CORE_ABI } from "@/utils/abi";
import { EMPTY_ADDRESS, FLEX_CORE_ADDRESS } from "@/utils/Addresses";
import { ASSET_ADDRESS_TO_NAME, convertToWei } from "@/utils/assets";
import { useQuery } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import styles from "../../styles/OpenedRenegotiation.module.css";
import { GET_CHAT } from "../../utils/queries";

export default function OpenedRenegotiation() {
  const router = useRouter();
  const { Id: selectedLoanId, renegotiationId } = router.query;
  const { isWeb3Enabled, enableWeb3 } = useMoralis();

  const { loading, error, data } = useQuery(GET_CHAT);

  const [loanDetails, setLoanDetails] = useState();
  const [interest, setInterest] = useState();
  const [marginCutoff, setMarginCutoff] = useState();
  const [collateralRatio, setCollateralRatio] = useState();
  const [loanType, setLoanType] = useState();
  const [timePeriod, setTimePeriod] = useState();
  const [collateralAmount, setCollateralAmount] = useState();
  const [collateralType, setCollateralType] = useState();
  const [principalType, setPrincipalType] = useState();
  const [debt, setDebt] = useState();

  const [renegotiatedLoanDetails, setRenegotiatedoanDetails] = useState();
  const [renegotiatedInterest, setRenegotiatedInterest] = useState();
  const [renegotiatedMarginCutoff, setRenegotiatedMarginCutoff] = useState();
  const [renegotiatedCollateralRatio, setRenegotiatedCollateralRatio] =
    useState();
  const [renegotiatedTimePeriod, setRenegotiatedTimePeriod] = useState();

  const [
    collateralRequiredOrPrincipalReceived,
    setCollateralRequiredOrPrincipalReceived,
  ] = useState();

  const [userMessage, setUserMessage] = useState();

  const { runContractFunction: acceptRenegotiation, error: err } =
    useWeb3Contract({
      abi: FLEX_CORE_ABI,
      contractAddress: FLEX_CORE_ADDRESS,
      functionName: "accept_renegotiation",
      params: {
        _loan_id: selectedLoanId,
        _user_custom_id: renegotiationId,
      },
      msgValue:
        loanType == 0
          ? collateralType == EMPTY_ADDRESS
            ? collateralRequiredOrPrincipalReceived
            : "0"
          : principalType == EMPTY_ADDRESS
          ? collateralRequiredOrPrincipalReceived
          : "0",
    });

  if (err) console.log(err);

  const { runContractFunction: getRenegotiatedLoanDetails } = useWeb3Contract({
    abi: FLEX_CORE_ABI,
    contractAddress: FLEX_CORE_ADDRESS,
    functionName: "get_renegotiated_loan_by_its_id",
    params: {
      loan_id: selectedLoanId,
      user_custom_id: renegotiationId,
    },
  });

  const { runContractFunction: getCollateralRequiredOrPrincipalReceived } =
    useWeb3Contract({
      abi: FLEX_CORE_ABI,
      contractAddress: FLEX_CORE_ADDRESS,
      functionName:
        "calulate_require_loan_principal_or_collateral_for_renegotiation_acceptance",
      params: {
        loan_id: selectedLoanId,
        user_custom_id: renegotiationId,
      },
    });

  const { runContractFunction: getLoanDetails } = useWeb3Contract({
    abi: FLEX_CORE_ABI,
    contractAddress: FLEX_CORE_ADDRESS,
    functionName: "get_loan_Details_by_id",
    params: {
      loan_id: selectedLoanId,
    },
  });

  const { runContractFunction: sendChat } = useWeb3Contract({
    abi: FLEX_CORE_ABI,
    contractAddress: FLEX_CORE_ADDRESS,
    functionName: "push_renegotiation_chat",
    params: {
      _loan_id: selectedLoanId,
      _user_custom_id: renegotiationId,
      message: userMessage,
    },
  });

  async function UpdateUI() {
    let loan_details = await getLoanDetails();
    setLoanDetails(loan_details);

    let renegotiated_loan_details = await getRenegotiatedLoanDetails();
    setRenegotiatedoanDetails(renegotiated_loan_details);

    if (renegotiated_loan_details) {
      setCollateralType(
        renegotiated_loan_details.collateral_type.toLowerCase()
      );
      setPrincipalType(renegotiated_loan_details.principal_type.toLowerCase());
    }

    let principal_given_or_collateral_Deposit =
      await getCollateralRequiredOrPrincipalReceived();

    setCollateralRequiredOrPrincipalReceived(
      principal_given_or_collateral_Deposit
    );

    console.log(collateralRequiredOrPrincipalReceived);

    // LOAN DETAILS
    let collateral_ratio = await loan_details.collateral_ratio;
    setCollateralRatio(collateral_ratio.toString());
    let interest_rate = await loan_details.fixed_interest_rate;
    setInterest(interest_rate.toString());
    let margin_cutoff = await loan_details.margin_cutoff;
    setMarginCutoff(margin_cutoff.toString());
    let time_period = await loan_details.time_amount;
    setTimePeriod(time_period);
    let coll_amount = await loan_details.collateral_deposited;
    setCollateralAmount(coll_amount);

    // RENEGOTIATED renegotiated_loan_details
    let renegotiated_collateral_ratio =
      await renegotiated_loan_details.collateral_ratio;
    setRenegotiatedCollateralRatio(renegotiated_collateral_ratio.toString());
    let renegotiated_interest_rate =
      await renegotiated_loan_details.fixed_interest_rate;
    setRenegotiatedInterest(renegotiated_interest_rate.toString());
    let renegotiated_margin_cutoff =
      await renegotiated_loan_details.margin_cutoff;
    setRenegotiatedMarginCutoff(renegotiated_margin_cutoff.toString());
    let renegotiated_time_period = await renegotiated_loan_details.time_amount;
    setRenegotiatedTimePeriod(renegotiated_time_period);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      UpdateUI();
    } else enableWeb3();
  }, [isWeb3Enabled]);

  return (
    <main>
      <Navbar />

      <div className={styles.openedRenegotiation}>
        <div className={styles.twoLoans}>
          <div className={styles.loans}>
            <h3>Loan Information</h3>

            <LoanBox
              index={2}
              loanId={selectedLoanId}
              collateraltype={loanDetails && loanDetails.collateral_type}
              principalType={loanDetails && loanDetails.principal_type}
              interest={interest}
              marginCutoff={marginCutoff}
              collateralRatio={collateralRatio}
              time={timePeriod}
            />
          </div>

          <div className={styles.loans}>
            <h3>Re-Negotiation Information</h3>

            <LoanBox
              index={2}
              loanId={selectedLoanId}
              collateraltype={loanDetails && loanDetails.collateral_type}
              principalType={loanDetails && loanDetails.principal_type}
              interest={renegotiatedInterest}
              marginCutoff={renegotiatedMarginCutoff}
              collateralRatio={renegotiatedCollateralRatio}
              time={timePeriod}
            />

            <div>
              <button
                className={styles.accept}
                onClick={() => acceptRenegotiation()}
              >
                Accept
              </button>
            </div>

            <div>
              <Link
                href="/subpages/changeRenegotiationTerms"
                className={styles.changeTerms}
              >
                Change Renegotiation Terms
              </Link>
            </div>

            <div className={styles.requiredPrincipleOrCollateral}>
              {loanType == 0 ? (
                <p>
                  <span>Principal Received :</span>{" "}
                  {collateralRequiredOrPrincipalReceived &&
                    (collateralRequiredOrPrincipalReceived / 10 ** 18).toFixed(
                      2
                    )}{" "}
                  {loanDetails &&
                    ASSET_ADDRESS_TO_NAME[
                      loanDetails.principal_type.toLowerCase()
                    ]}
                </p>
              ) : (
                <>
                  <p>
                    <span>Principal To Deposit :</span>{" "}
                    {collateralRequiredOrPrincipalReceived &&
                      (
                        collateralRequiredOrPrincipalReceived /
                        10 ** 18
                      ).toFixed(2)}{" "}
                    {loanDetails &&
                      ASSET_ADDRESS_TO_NAME[
                        loanDetails.principal_type.toLowerCase()
                      ]}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className={styles.chatSection}>
          <div className={styles.topBar}>
            <h4>
              Re-Negotiation ID: <span>{renegotiationId} Re-Negotiation</span>
            </h4>
          </div>

          <div className={styles.chat}>
            {data &&
              data.chatPusheds.map((chat) => {
                if (chat.user_custom_id == renegotiationId) {
                  if (chat.lender_or_borrower == 0) {
                    return (
                      <div className={styles.lender}>{chat.messageURI}</div>
                    );
                  }

                  if (chat.lender_or_borrower == 1) {
                    return (
                      <div className={styles.borrower}>{chat.messageURI}</div>
                    );
                  }
                }
              })}
          </div>

          <div className={styles.send}>
            <input onChange={(e) => setUserMessage(e.target.value)} />
            <button onClick={() => sendChat()}>Send</button>
          </div>
        </div>
      </div>
    </main>
  );
}
