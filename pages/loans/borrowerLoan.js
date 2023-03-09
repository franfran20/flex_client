import { DropDownFilter } from "@/componenets/DropDownFilter";
import { LoanBox } from "@/componenets/LoanBox";
import { Navbar } from "@/componenets/Navbar";
import { GET_LOANS, GET_LOANS_NO_FILTER } from "@/utils/queries";
import { useQuery, gql } from "@apollo/client";
import { useState } from "react";
import { useMoralis } from "react-moralis";
import styles from "../../styles/loans.module.css";

export default function BorrowerLoan() {
  const [loanState, setLoanState] = useState();
  const { account, isWeb3Enabled } = useMoralis();
  const { data } = useQuery(GET_LOANS, {
    variables: { loanState },
  });

  console.log(loanState, "loan state");
  const { data: notFiltered } = useQuery(GET_LOANS_NO_FILTER);

  const loanType = 1;

  if (data) console.log(data);
  return (
    <main>
      <Navbar />

      <div className={styles.topBar}>
        <h3>Borrower Loans</h3>
        <DropDownFilter setState={setLoanState} />
      </div>

      <div className={styles.loans}>
        {loanState
          ? data &&
            data.loans.map((loan, index) => {
              if (loan.loan_type == loanType)
                return (
                  <LoanBox
                    index={index}
                    loanId={loan.loan_id}
                    collateraltype={loan.collateral_type}
                    principalType={loan.principal_type}
                    interest={loan.fixed_interest_rate}
                    marginCutoff={loan.margin_cutoff}
                    collateralRatio={loan.collateral_ratio}
                    time={loan.time_limit}
                  />
                );
            })
          : notFiltered &&
            notFiltered.loans.map((loan, index) => {
              if (loan.loan_type == loanType)
                return (
                  <LoanBox
                    index={index}
                    loanId={loan.loan_id}
                    collateraltype={loan.collateral_type}
                    principalType={loan.principal_type}
                    interest={loan.fixed_interest_rate}
                    marginCutoff={loan.margin_cutoff}
                    collateralRatio={loan.collateral_ratio}
                    time={loan.time_limit}
                  />
                );
            })}
      </div>
    </main>
  );
}
