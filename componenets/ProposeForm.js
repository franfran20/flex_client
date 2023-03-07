import { ERC20_ABI, FLEX_CORE_ABI } from "@/utils/abi";
import { FLEX_CORE_ADDRESS, EMPTY_ADDRESS } from "@/utils/Addresses";
import { ASSETS, convertToWei } from "@/utils/assets";
import { useState } from "react";
import { useWeb3Contract } from "react-moralis";
import styles from "../styles/components/forms/ProposeForm.module.css";

export const ProposeForm = ({ loanType }) => {
  const [timeOption, setTimeOption] = useState(false);
  const [accessContol, setAccessControl] = useState(false);
  const [collateralType, setCollateralType] = useState();
  const [principalType, setPrincipalType] = useState();
  const [marginCutoff, setMarginCutoff] = useState();
  const [interestRate, setInterestRate] = useState();
  const [collateralRatio, setCollateralRatio] = useState();
  const [timeAmount, setTimeAmount] = useState(0);
  const [recipient, setRecipient] = useState(EMPTY_ADDRESS);
  const [borrowOrCollateralAmount, setBorrowOrCollateralAmount] = useState();

  const {
    data: proposeLoanData,
    error: proposeLoanError,
    runContractFunction: proposeLoan,
    isFetching: proposeLoanFetching,
    isLoading: proposeLoanLoading,
  } = useWeb3Contract({
    abi: FLEX_CORE_ABI,
    contractAddress: FLEX_CORE_ADDRESS,
    functionName: "propose_loan",
    params: {
      _margin_cutoff: marginCutoff,
      _collateral_ratio: collateralRatio,
      _fixed_intererst_rate: interestRate,
      _borrow_amount:
        loanType == 0 ? convertToWei(borrowOrCollateralAmount) : 0,
      _time_limit: timeOption,
      _time_amount: timeOption ? timeAmount : 0,
      _collateral_type: collateralType
        ? ASSETS[collateralType].address
        : EMPTY_ADDRESS,
      _principal_type: principalType
        ? ASSETS[principalType].address
        : EMPTY_ADDRESS,
      _access_control: accessContol,
      _recipient: accessContol ? recipient : EMPTY_ADDRESS,
      _loan_type: loanType,
      _collateral_deposit:
        loanType == 1 ? convertToWei(borrowOrCollateralAmount) : 0,
    },
  });

  const {
    error: approveError,
    runContractFunction: approve,
    isFetching: approvedIsFetching,
    isLoading: approvedIsLoading,
  } = useWeb3Contract({
    abi: ERC20_ABI,
    contractAddress:
      loanType == 0
        ? principalType && ASSETS[principalType].address
        : collateralType && ASSETS[collateralType].address,
    functionName: "approve",
    params: {
      spender: FLEX_CORE_ADDRESS,
      amount:
        borrowOrCollateralAmount && convertToWei(borrowOrCollateralAmount),
    },
  });

  return (
    <div className={styles.proposeForm}>
      {/* INPUTS */}
      <div className={styles.inputs}>
        <div className={styles.input}>
          <p>{loanType == 0 ? "borrow amount : " : "collateral deposit : "}</p>
          {/* APPROVE FOR LENDER LOAN */}
          {loanType == 0 && principalType != 0 ? (
            <button onClick={() => approve()} className={styles.approveButton}>
              Approve {principalType && ASSETS[principalType].name}
            </button>
          ) : (
            ""
          )}

          {/* APPROVE FOR BORROWER LOAN*/}
          {loanType == 1 && collateralType != 0 ? (
            <buttton onClick={() => approve()} className={styles.approveButton}>
              Approve {collateralType && ASSETS[collateralType].name}
            </buttton>
          ) : (
            ""
          )}
          <input
            onChange={(e) => setBorrowOrCollateralAmount(e.target.value)}
          />
        </div>

        <div className={styles.input}>
          <p>margin cutoff (%) :</p>
          <input onChange={(e) => setMarginCutoff(e.target.value)} />
        </div>

        <div className={styles.input}>
          <p>collateral ratio (%) :</p>
          <input onChange={(e) => setCollateralRatio(e.target.value)} />
        </div>

        <div className={styles.input}>
          <p>fixed interest rate (%) :</p>
          <input onChange={(e) => setInterestRate(e.target.value)} />
        </div>

        <div className={styles.input}>
          <div className={styles.option}>
            <p>time (sec):</p>
            <input
              type="checkbox"
              onClick={() => setTimeOption((prev) => !prev)}
            />
          </div>
          {timeOption && (
            <input onChange={(e) => setTimeAmount(e.target.value)} />
          )}
        </div>

        <div className={styles.input}>
          <p>access control :</p>

          <div className={styles.option}>
            <div className={styles.option}>
              <span>Private</span>
              <input
                type="checkbox"
                onChange={() => setAccessControl(true)}
                checked={accessContol == true}
              />
            </div>

            <div className={styles.option}>
              <span>Public</span>
              <input
                type="checkbox"
                onChange={() => setAccessControl(false)}
                checked={accessContol == false}
              />
            </div>
          </div>

          {accessContol && (
            <input onChange={(e) => setRecipient(e.target.value)} />
          )}
        </div>
      </div>

      {/* ASSETS */}
      <div className={styles.assets}>
        <div className={styles.assetType}>
          <h5>Collateral Type: </h5>

          <div className={styles.asset}>
            <p>Ftm</p>
            <input
              type="checkbox"
              onChange={() => setCollateralType(0)}
              checked={collateralType == 0}
            />
          </div>

          <div className={styles.asset}>
            <p>Flex</p>
            <input
              type="checkbox"
              onChange={() => setCollateralType(1)}
              checked={collateralType == 1}
            />
          </div>

          <div className={styles.asset}>
            <p>Link</p>
            <input
              type="checkbox"
              onChange={() => setCollateralType(2)}
              checked={collateralType == 2}
            />
          </div>

          <div className={styles.asset}>
            <p>Usdt</p>
            <input
              type="checkbox"
              onChange={() => setCollateralType(3)}
              checked={collateralType == 3}
            />
          </div>
        </div>

        <div className={styles.assetType}>
          <h5>Principal Type: </h5>

          <div className={styles.asset}>
            <p>Ftm</p>
            <input
              type="checkbox"
              onChange={() => setPrincipalType(0)}
              checked={principalType == 0}
            />
          </div>

          <div className={styles.asset}>
            <p>Flex</p>
            <input
              type="checkbox"
              onChange={() => setPrincipalType(1)}
              checked={principalType == 1}
            />
          </div>

          <div className={styles.asset}>
            <p>Link</p>
            <input
              type="checkbox"
              onChange={() => setPrincipalType(2)}
              checked={principalType == 2}
            />
          </div>

          <div className={styles.asset}>
            <p>Usdt</p>
            <input
              type="checkbox"
              onChange={() => setPrincipalType(3)}
              checked={principalType == 3}
            />
          </div>
        </div>
      </div>
      <button className={styles.propose} onClick={() => proposeLoan()}>
        Propose
      </button>
    </div>
  );
};
