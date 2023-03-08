import styles from "../styles/components/LoanBox.module.css";
import Link from "next/link";
import { ASSET_ADDRESS_TO_NAME } from "@/utils/assets";

export const LoanBox = ({
  index,
  loanId,
  collateraltype,
  principalType,
  interest,
  marginCutoff,
  collateralRatio,
  time,
}) => {
  return (
    <Link
      href={`/loans/${loanId}`}
      className={index % 2 == 0 ? styles.loanBoxEven : styles.loanBoxOdd}
    >
      <h3 className={styles.id} style={{ color: "#0a9a00c7" }}>
        #{loanId}
      </h3>

      <div className={styles.loanDetails}>
        <div className={styles.tidy}>
          <div className={styles.one}>
            <h4>Collateral Type</h4>
            <p>
              {collateraltype &&
                ASSET_ADDRESS_TO_NAME[collateraltype.toLowerCase()]}
            </p>
          </div>
          <div className={styles.two}>
            <h4>Principal Type</h4>
            <p>
              {principalType &&
                ASSET_ADDRESS_TO_NAME[principalType.toLowerCase()]}
            </p>
          </div>
        </div>
        <div className={styles.tidy}>
          <div className={styles.three}>
            <h4>Interest Rate</h4>
            <p>{interest && interest}</p>
          </div>
          <div className={styles.four}>
            <h4>Margin CutOff</h4>
            <p>{marginCutoff && marginCutoff}</p>
          </div>
        </div>

        <div className={styles.tidy}>
          <div className={styles.four}>
            <h4>Collateral Ratio</h4>
            <p>{collateralRatio && collateralRatio}</p>
          </div>
          <div className={styles.five}>
            <h4>Time</h4>
            <p>{time ? "true" : "False"}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};
