import { useQuery, gql } from "@apollo/client";

const GET_LOANS = gql`
  query GetLoans {
    loans {
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

module.exports = {
  GET_LOANS,
};
