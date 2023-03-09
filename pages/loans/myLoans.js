import { DropDownFilter } from "@/componenets/DropDownFilter";
import { LoanBox } from "@/componenets/LoanBox";
import { Navbar } from "@/componenets/Navbar";
import { GET_LOANS, GET_LOANS_NO_FILTER } from "@/utils/queries";
import { useQuery, gql } from "@apollo/client";
import { useState } from "react";
import { useMoralis } from "react-moralis";
import styles from "../../styles/loans.module.css";

export default function myLoans() {
  const [loanState, setLoanState] = useState(false);
  const { account, isWeb3Enabled } = useMoralis();
  console.log(account);

  const { data: notFiltered } = useQuery(GET_LOANS_NO_FILTER);

  const { data } = useQuery(GET_LOANS, {
    variables: { loanState },
  });

  if (data) console.log(data);
  return (
    <main>
      <Navbar />

      <div className={styles.topBar}>
        <h3>My Loans</h3>
        <DropDownFilter setState={setLoanState} />
      </div>

      <div className={styles.loans}>
        {loanState
          ? data &&
            data.loans.map((loan, index) => {
              if (loan.lender == account || loan.borrower == account)
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
              if (loan.lender == account || loan.borrower == account)
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
