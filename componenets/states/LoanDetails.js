import { ERC20_ABI, FLEX_CORE_ABI } from "@/utils/abi";
import { EMPTY_ADDRESS, FLEX_CORE_ADDRESS } from "@/utils/Addresses";
import {
  ASSET_ADDRESS_TO_NAME,
  convertToWei,
  STATE_BYTES_TO_STRING,
  truncateAddr,
} from "@/utils/assets";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import styles from "../../styles/components/LoanState.module.css";

export const LoanDetails = ({
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
  collateralAmount,
  principalAmount,
  debt,
}) => {
  const [collateralOrPrincipalRequired, setCollateralOrPrincipleRequired] =
    useState();
  const [approveAmount, setApproveAmount] = useState();
  const [marginCutoffCollateral, setMarginCutoffCollateral] = useState();
  const [healthstatus, setHealthStaus] = useState();
  const [topUpAmount, setTopUpAmount] = useState();

  const { isWeb3Enabled, enableWeb3, account, Moralis } = useMoralis();

  console.log("debt", debt.toString());

  const { runContractFunction: liquidate, error } = useWeb3Contract({
    abi: FLEX_CORE_ABI,
    contractAddress: FLEX_CORE_ADDRESS,
    functionName: "liquidate_loan",
    params: {
      _loan_id: loanId,
    },
  });

  if (error) console.log(error);

  const { runContractFunction: repay } = useWeb3Contract({
    abi: FLEX_CORE_ABI,
    contractAddress: FLEX_CORE_ADDRESS,
    functionName: "repay_loan",
    params: {
      _loan_id: loanId,
    },
    msgValue: principalType == EMPTY_ADDRESS && debt.toString(),
  });

  const { runContractFunction: topUpCollateral } = useWeb3Contract({
    abi: FLEX_CORE_ABI,
    contractAddress: FLEX_CORE_ADDRESS,
    functionName: "top_up_collateral",
    params: {
      loan_id: loanId,
      amount: convertToWei(topUpAmount),
    },
    msgValue: collateralType == EMPTY_ADDRESS && convertToWei(topUpAmount),
  });

  const { runContractFunction: getHealthStatus } = useWeb3Contract({
    abi: FLEX_CORE_ABI,
    contractAddress: FLEX_CORE_ADDRESS,
    functionName: "get_health_status",
    params: {
      loan_id: loanId,
    },
  });

  const { runContractFunction: getMarginCutoffCollateral } = useWeb3Contract({
    abi: FLEX_CORE_ABI,
    contractAddress: FLEX_CORE_ADDRESS,
    functionName: "get_margin_cutoff_in_collateral",
    params: {
      loan_id: loanId,
    },
  });

  const { runContractFunction: accept } = useWeb3Contract({
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

  const { runContractFunction: approveTopUp } = useWeb3Contract({
    abi: ERC20_ABI,
    contractAddress: collateralType && collateralType,
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

  // if (err) {
  //   console.log("err", err);
  // }

  async function UpdateUI() {
    let coll_or_prin_required = (
      await getCollateralOrPrincipalRequired()
    ).toString();
    setCollateralOrPrincipleRequired(coll_or_prin_required);

    let margin_cutoff_coll = (await getMarginCutoffCollateral()).toString();
    setMarginCutoffCollateral(margin_cutoff_coll);

    let health_status = (await getHealthStatus()).toString();
    setHealthStaus(health_status);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      UpdateUI();
    } else {
      enableWeb3();
    }
  }, [isWeb3Enabled]);

  // TEST

  return (
    <div className={styles.allDetails}>
      {STATE_BYTES_TO_STRING[loanState] == "PROPOSED" && (
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
      )}

      {STATE_BYTES_TO_STRING[loanState] == "PROPOSED" && (
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
      )}

      {STATE_BYTES_TO_STRING[loanState] == "ACCEPTED" && (
        <div className={styles.repayAndProposeNewTerms}>
          <button className={styles.repay} onClick={() => repay()}>
            Repay
          </button>
          <Link
            href="/subpages/proposeNewTerms"
            className={styles.proposeNewTerms}
          >
            Propsoe New Terms
          </Link>
        </div>
      )}

      <div className={styles.loanInfo}>
        {STATE_BYTES_TO_STRING[loanState] == "ACCEPTED" && (
          <>
            <div>
              <h4>Loan Current Cutoff</h4>
              <p style={{ color: "red" }}>
                {marginCutoffCollateral &&
                  (marginCutoffCollateral / 10 ** 18).toFixed(2)}{" "}
                {ASSET_ADDRESS_TO_NAME[collateralType.toLowerCase()]}
              </p>
            </div>

            <div>
              <h4>Current Debt</h4>
              <p>
                {debt && (debt.toString() / 10 ** 18).toFixed(2)}{" "}
                {ASSET_ADDRESS_TO_NAME[principalType.toLowerCase()]}
              </p>
            </div>
          </>
        )}

        {STATE_BYTES_TO_STRING[loanState] == "ACCEPTED" && (
          <>
            <div>
              <h4>Health Status</h4>
              {healthstatus && (
                <div
                  className={styles.healthStatus}
                  style={{
                    backgroundColor:
                      healthstatus == 1
                        ? "green"
                        : healthstatus == 2
                        ? "yellow"
                        : "red",
                  }}
                ></div>
              )}
            </div>
          </>
        )}

        <div>
          <h4>Lender Address</h4>
          <p>{truncateAddr(lenderAddress)}</p>
        </div>

        <div>
          <h4>Borrower Address</h4>
          <p>{truncateAddr(borrowerAddress)}</p>
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
          <h4>Principal Amount</h4>
          <p>
            {principalAmount &&
              (principalAmount.toString() / 10 ** 18).toFixed(2)}{" "}
            {ASSET_ADDRESS_TO_NAME[principalType.toLowerCase()]}
          </p>
        </div>

        <div>
          <h4>Collateral Deposited</h4>
          <p>
            {collateralAmount &&
              (collateralAmount.toString() / 10 ** 18).toFixed(2)}{" "}
            {ASSET_ADDRESS_TO_NAME[collateralType.toLowerCase()]}
          </p>
        </div>

        <div>
          <h4>Time Period</h4>
          <p>{timeLimit ? timePeriod.toString() : "None"}.</p>
        </div>
      </div>

      {STATE_BYTES_TO_STRING[loanState] == "ACCEPTED" && (
        <div className={styles.topUpCollateral}>
          <div className={styles.approve}>
            <input onChange={(e) => setApproveAmount(e.target.value)} />
            <button onClick={() => approveTopUp()}>
              Approve{" "}
              {collateralType &&
                ASSET_ADDRESS_TO_NAME[collateralType.toLowerCase()]}
            </button>
          </div>

          <div className={styles.approve}>
            <input onChange={(e) => setTopUpAmount(e.target.value)} />
            <button
              onClick={() => topUpCollateral()}
              style={{ backgroundColor: "#fff" }}
            >
              Top Up Collateral
            </button>
          </div>
        </div>
      )}

      {STATE_BYTES_TO_STRING[loanState] == "PROPOSED" && (
        <div className={styles.renegotiateAndDeactivate}>
          <Link href="/subpages/renegotiate" className={styles.renego}>
            Renegotiate
          </Link>
          <button className={styles.deactivate}>Deactivate</button>
        </div>
      )}

      {STATE_BYTES_TO_STRING[loanState] == "ACCEPTED" && (
        <div className={styles.proposeAndLiquidate}>
          <Link href="/subpages/proposeBuyout" className={styles.propose}>
            Propose Buyout
          </Link>
          {healthstatus && healthstatus == 3 && (
            <button className={styles.liquidate} onClick={() => liquidate()}>
              Liquidate
            </button>
          )}
        </div>
      )}

      <Link href={`/renegotiations/${loanId}`} className={styles.renego}>
        View All Renegotiations
      </Link>

      {loanType == 0
        ? lenderAddress.toLowerCase() == account &&
          STATE_BYTES_TO_STRING[loanState] == "PROPOSED" && (
            <div className={styles.changeTermsAndRenego}>
              <Link href="/subpages/changeLoanTerms" className={styles.change}>
                Change Terms
              </Link>
            </div>
          )
        : borrowerAddress.toLowerCase() == account &&
          STATE_BYTES_TO_STRING[loanState] == "PROPOSED" && (
            <div className={styles.changeTermsAndRenego}>
              <button className={styles.change}>Change Terms</button>
            </div>
          )}
    </div>
  );
};
