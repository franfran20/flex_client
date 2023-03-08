import { Navbar } from "@/componenets/Navbar";
import { useRouter } from "next/router";
import { GET_RENEGOTIATIONS } from "@/utils/queries";
import { useQuery, gql } from "@apollo/client";
import styles from "../../styles/subpages/renegotiations.module.css";
import Link from "next/link";

export default function renegotiation() {
  const router = useRouter();
  const { loanId } = router.query;

  const { loading, error, data } = useQuery(GET_RENEGOTIATIONS, {
    variables: { loanID: loanId },
  });
  console.log(data);

  return (
    <main>
      <Navbar />
      <h3 className={styles.subTitle}>
        <span style={{ color: "#0A9A00" }}>#{loanId}</span> Re-Negotiations
      </h3>

      <div className={styles.renegotiations}>
        {data &&
          data.renegotiatedLoans.map((renegotiation) => {
            return (
              <Link href={`/${loanId}/${renegotiation.user_custom_id}`}>
                <h3>Re-Negotiation ID</h3>
                <p>{renegotiation.user_custom_id}</p>
              </Link>
            );
          })}
      </div>
    </main>
  );
}
