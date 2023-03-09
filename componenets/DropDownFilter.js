import { useState } from "react";
import styles from "../styles/components/DropDownFilter.module.css";
import { PROPOSED, ACCEPTED, FULFILLED } from "@/utils/assets";

export const DropDownFilter = ({ setState }) => {
  const [clicked, setClicked] = useState(false);

  function setLoanStateFilter(state) {
    setState(state);
  }

  return (
    <div className={styles.dropDown}>
      <button
        onClick={() => setClicked((prev) => !prev)}
        className={styles.dropbtn}
      >
        Filter &gt;
      </button>

      <div className={clicked ? styles.showFilters : styles.hideFilters}>
        <button
          onClick={() => {
            setLoanStateFilter(PROPOSED);
          }}
        >
          proposed
        </button>
        <button
          onClick={() => {
            setLoanStateFilter(ACCEPTED);
          }}
        >
          accepted
        </button>
        <button
          onClick={() => {
            setLoanStateFilter(FULFILLED);
          }}
        >
          fulfilled
        </button>
      </div>
    </div>
  );
};
