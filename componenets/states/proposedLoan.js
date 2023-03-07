import { ERC20_ABI, FLEX_CORE_ABI } from "@/utils/abi";
import { EMPTY_ADDRESS, FLEX_CORE_ADDRESS } from "@/utils/Addresses";
import {
  ASSET_ADDRESS_TO_NAME,
  convertToWei,
  STATE_BYTES_TO_STRING,
  truncateAddr,
} from "@/utils/assets";
import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import styles from "../../styles/components/LoanState.module.css";

export const ProposedLoan = ({
  loanId,
  collateralType,
  principalType,
  loanType,
  lenderAddress,
  borrowerAddress,
  accessControl,
  timePeriod,
  timeLimit,
  loanState,
}) => {
  const [collateralOrPrincipalRequired, setCollateralOrPrincipleRequired] =
    useState();
  const [approveAmount, setApproveAmount] = useState();

  const { isWeb3Enabled, enableWeb3, account } = useMoralis();

  const { runContractFunction: accept, error: err } = useWeb3Contract({
    abi: FLEX_CORE_ABI,
    contractAddress: FLEX_CORE_ADDRESS,
    functionName: "accept_loan_terms",
    params: {
      _loan_id: loanId,
      _erc20Amount: approveAmount ? convertToWei(approveAmount) : 0,
    },
    msgValue:
      loanType == 0
        ? collateralType == EMPTY_ADDRESS
          ? collateralOrPrincipalRequired
          : 0
        : principalType == EMPTY_ADDRESS
        ? collateralOrPrincipalRequired
        : 0,
  });

  const { runContractFunction: approve } = useWeb3Contract({
    abi: ERC20_ABI,
    contractAddress:
      loanType == 0
        ? collateralType && collateralType
        : principalType && principalType,
    functionName: "approve",
    params: {
      spender: FLEX_CORE_ADDRESS,
      amount: approveAmount && convertToWei(approveAmount),
    },
  });

  const { runContractFunction: getCollateralOrPrincipalRequired } =
    useWeb3Contract({
      abi: FLEX_CORE_ABI,
      contractAddress: FLEX_CORE_ADDRESS,
      functionName:
        "calulate_required_loan_principal_or_collateral_for_acceptance",
      params: {
        loan_id: loanId,
      },
    });

  if (err) {
    console.log(err);
  }

  async function UpdateUI() {
    let collateralOrPrincipalRequire = (
      await getCollateralOrPrincipalRequired()
    ).toString();
    setCollateralOrPrincipleRequired(collateralOrPrincipalRequire);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      UpdateUI();
    } else {
      enableWeb3();
    }
  }, [isWeb3Enabled]);

  console.log(account);
  console.log(lenderAddress, borrowerAddress);

  // TEST

  return (
    <div className={styles.allDetails}>
      <div className={styles.collateralRequired}>
        {collateralOrPrincipalRequired && (
          <p>
            {loanType == 0 ? "Collateral" : "Principal"} Required :
            <span style={{ color: "#20f903" }}>
              {" "}
              Roughly {(collateralOrPrincipalRequired / 10 ** 18).toFixed(
                3
              )}{" "}
              {""}
              {
                ASSET_ADDRESS_TO_NAME[
                  loanType == 0 ? collateralType.toLowerCase() : principalType
                ]
              }
            </span>
          </p>
        )}
      </div>

      <div className={styles.approveAndAccept}>
        {loanType == 0
          ? collateralType != EMPTY_ADDRESS && (
              <div className={styles.approve}>
                <input onChange={(e) => setApproveAmount(e.target.value)} />
                <button onClick={() => approve()}>Approve</button>
              </div>
            )
          : principalType != EMPTY_ADDRESS && (
              <div className={styles.approve}>
                <input onChange={(e) => setApproveAmount(e.target.value)} />
                <button onClick={() => approve()}>Approve</button>
              </div>
            )}

        <button className={styles.accept} onClick={() => accept()}>
          Accept
        </button>
      </div>

      <div className={styles.loanInfo}>
        <div>
          <h4>Lender Address</h4>
          <p>{truncateAddr(lenderAddress)}</p>
        </div>

        <div>
          <h4>Loan State</h4>
          <p>{loanState && STATE_BYTES_TO_STRING[loanState]}</p>
        </div>

        <div>
          <h4>Access Control</h4>
          <p>{accessControl ? "True" : "False"}</p>
        </div>

        <div>
          <h4>Time Period</h4>
          <p>{timeLimit ? timePeriod.toString() : "None"}.</p>
        </div>
      </div>

      <div className={styles.renegotiateAndDeactivate}>
        <button className={styles.renego}>Renegotiate</button>
        <button className={styles.deactivate}>Deactivate</button>
      </div>

      {loanType == 0
        ? lenderAddress.toLowerCase() == account && (
            <div className={styles.changeTermsAndRenego}>
              <button className={styles.change}>Change Terms</button>
              <button className={styles.renego}>View All Renegotiations</button>
            </div>
          )
        : borrowerAddress.toLowerCase() == account && (
            <div className={styles.changeTermsAndRenego}>
              <button className={styles.change}>Change Terms</button>
              <button className={styles.renego}>View All Renegotiations</button>
            </div>
          )}
    </div>
  );
};
