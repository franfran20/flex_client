import styles from "../styles/components/LoanBox.module.css";

export const LoanBox = ({ index }) => {
  return (
    <div className={index % 2 == 0 ? styles.loanBoxEven : styles.loanBoxOdd}>
      <h3>#125</h3>

      <div className={styles.loanDetails}>
        <div className={styles.one}>
          <h4></h4>
          <p></p>
        </div>
        <div className={styles.two}>
          <h4></h4>
          <p></p>
        </div>
        <div className={styles.three}>
          <h4></h4>
          <p></p>
        </div>
        <div className={styles.four}>
          <h4></h4>
          <p></p>
        </div>
        <div className={styles.five}>
          <h4></h4>
          <p></p>
        </div>
        <div className={styles.one}>
          <h4></h4>
          <p></p>
        </div>
      </div>
    </div>
  );
};
