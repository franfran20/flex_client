import Image from "next/image";
import styles from "../styles/components/Hero.module.css";

export const Hero = () => {
  return (
    <div className={styles.hero}>
      <div className={styles.text}>
        <h2>
          Customized <span style={{ color: "#20f903" }}>P2P Lending</span> has
          never been better
        </h2>

        <p>
          p2p lending marketplace with flexible loan structures, renegotiations,
          chatting functionality, lender and bvorrower loans etc.
        </p>
      </div>

      <Image
        src="/illustrations/heroIllustration.png"
        width="1000"
        height="1000"
      />
    </div>
  );
};
