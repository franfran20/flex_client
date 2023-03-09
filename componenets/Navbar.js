import Image from "next/image";
import Link from "next/link";
import { useMoralis } from "react-moralis";
import styles from "../styles/components/Navbar.module.css";

export const Navbar = () => {
  const { enableWeb3, isWeb3Enabled } = useMoralis();

  async function connect() {
    await enableWeb3();
  }

  return (
    <div className={styles.nav}>
      <Link href="/">
        <Image src="/navbar/logo.png" width="1000" height="1000" />
      </Link>

      {isWeb3Enabled ? (
        <div className={styles.links}>
          <Link href="/loans/myLoans" className={styles.link}>
            my loans
          </Link>
          <Link href="/loans/lenderLoan" className={styles.link}>
            lender loans
          </Link>
          <Link href="/loans/borrowerLoan" className={styles.link}>
            borrower loans
          </Link>
          <Link href="/faucet" className={styles.link}>
            faucet
          </Link>
          <Link href="/propose" className={styles.propose}>
            propose loan
          </Link>
        </div>
      ) : (
        <button className={styles.connect} onClick={connect}>
          Connect
        </button>
      )}
    </div>
  );
};
