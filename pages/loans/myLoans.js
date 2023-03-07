import { LoanBox } from "@/componenets/LoanBox";
import { Navbar } from "@/componenets/Navbar";
import { useQuery, gql } from "@apollo/client";
import styles from "../../styles/loans.module.css";

export default function myLoans() {
  const GET_LOANS = gql`
    query GetLoans {
      loans(first: 5) {
        id
        loan_id
        borrower
        lender
        margin_cutoff
        collateral_ratio
        fixed_interest_rate
        borrow_amount
        time_limit
        time_amount
        collateral_type
        collateral_deposited
        principal_type
        current_debt
        access_control
        state
        loan_type
      }
    }
  `;

  const { loading, error, data } = useQuery(GET_LOANS);

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
            return <LoanBox index={index + 1} />;
          })}
      </div>
    </main>
  );
}
