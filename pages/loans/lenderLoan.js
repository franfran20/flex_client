import { DropDownFilter } from "@/componenets/DropDownFilter";
import { LoanBox } from "@/componenets/LoanBox";
import { Navbar } from "@/componenets/Navbar";
import { GET_LOANS } from "@/utils/queries";
import { useQuery, gql } from "@apollo/client";
import { useMoralis } from "react-moralis";
import styles from "../../styles/loans.module.css";

export default function LenderLoan() {
  const { account, isWeb3Enabled } = useMoralis();
  console.log(account);
  const loanType = 0;

  const { loading, error, data } = useQuery(GET_LOANS);

  if (data) console.log(data);
  return (
    <main>
      <Navbar />

      <div className={styles.topBar}>
        <h3>Lender Loans</h3>
        <DropDownFilter />
      </div>

      <div className={styles.loans}>
        {loading && <p>Loading...</p>}
        {error && <p>Error!Try Refreshing</p>}
        {data &&
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
          })}
      </div>
    </main>
  );
}
