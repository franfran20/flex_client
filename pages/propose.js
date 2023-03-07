import { LoanInformation } from "@/componenets/LoanInformation";
import { Navbar } from "@/componenets/Navbar";
import { ProposeForm } from "@/componenets/ProposeForm";
import { useState } from "react";
import styles from "../styles/Propose.module.css";

export default function Propose() {
  const [proposer, setProposer] = useState(0);
  return (
    <main>
      <Navbar />

      <div className={styles.proposeContainer}>
        <div className={styles.whoAreYou}>
          <div className={styles.selectProposer}>
            <h4>
              Who Are You? :{" "}
              {proposer == 0 ? (
                <span className="lightgreen">Lender</span>
              ) : (
                <span className="lightgreen">Borrower</span>
              )}
            </h4>
            <div className={styles.buttons}>
              <button
                className={
                  proposer == 0 ? styles.selectedButton : styles.button
                }
                onClick={() => setProposer(0)}
              >
                Lender
              </button>
              <button
                className={
                  proposer == 1 ? styles.selectedButton : styles.button
                }
                onClick={() => setProposer(1)}
              >
                Borrower
              </button>
            </div>
          </div>
          <LoanInformation />
        </div>

        <ProposeForm loanType={proposer} />
      </div>
    </main>
  );
}
