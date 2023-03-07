import styles from "../styles/components/LoanInformation.module.css";

export const LoanInformation = () => {
  return (
    <div className={styles.loanInformation}>
      <h4>Loan Information</h4>

      <div className={styles.infos}>
        <div className={styles.info}>
          <h5>borrow amount</h5>
          <p>
            The amount of assets a lender is willing to lend during the loan
            period.
          </p>
        </div>

        <div className={styles.info}>
          <h5>margin cutoff</h5>
          <p>
            perecentage of collateral to debt that you must maintain in order to
            avoid getting liquidated.
          </p>
        </div>

        <div className={styles.info}>
          <h5>collateral ratio</h5>
          <p>
            The percentage of asset you can borrow against your deposited
            collateral.
          </p>
        </div>

        <div className={styles.info}>
          <h5>fixed interest rate</h5>
          <p>The amount of interest paid back to the lender for the loan.</p>
        </div>

        <div className={styles.info}>
          <h5>time</h5>
          <p>
            An option to include a time limit in seconds for repayment of a loan
            else liquidation can occur without debt going beyon the margin
            cutoff
          </p>
        </div>

        <div className={styles.info}>
          <h5>access control</h5>
          <p>
            An option to make your loan private specifying the recipient address
            you only wish to negotiate with.
          </p>
        </div>

        <div className={styles.info}>
          <h5>principal type</h5>
          <p>The asset type the borrower would receive.</p>
        </div>

        <div className={styles.info}>
          <h5>collateral type</h5>
          <p>The asset type the lender would receive as collateral.</p>
        </div>
      </div>
    </div>
  );
};
