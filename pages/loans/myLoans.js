import { LoanBox } from "@/componenets/LoanBox";
import { Navbar } from "@/componenets/Navbar";
import { GET_LOANS } from "@/utils/queries";
import { useQuery, gql } from "@apollo/client";
import { useState } from "react";
import { useMoralis } from "react-moralis";
import styles from "../../styles/loans.module.css";

export default function myLoans() {
  const [noLoans, setNoLoans] = useState(false);
  const { account, isWeb3Enabled } = useMoralis();
  console.log(account);

  const { loading, error, data } = useQuery(GET_LOANS);

  function updateNoLoans() {
    setNoLoans(false);
  }

  if (data) console.log(data);
  return (
    <main>
      <Navbar />

      <div className={styles.topBar}>
        <h3>My Loans</h3>
        <p>Filter &gt;</p>
      </div>

      <div className={styles.loans}>
        {loading && <p>Loading...</p>}
        {error && <p>Error!Try Refreshing</p>}
        {data &&
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
          })}
      </div>
    </main>
  );
}
