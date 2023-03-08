import { useState } from "react";
import styles from "../styles/components/DropDownFilter.module.css";

export const DropDownFilter = () => {
  const [clicked, setClicked] = useState();
  return (
    <div class={styles.dropdown}>
      <button
        onClick={() => setClicked((prev) => !prev)}
        class={styles.dropbtn}
      >
        Dropdown
      </button>
      <div class={styles.dropdownContent}>
        <button>Link 1</button>
        <button>Link 2</button>
        <button>Link 3</button>
      </div>
    </div>
  );
};
