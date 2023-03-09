import { useQuery, gql } from "@apollo/client";

const GET_LOANS = gql`
  query GetLoans($loanState: Bytes) {
    loans(where: { state: $loanState }) {
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

const GET_LOANS_NO_FILTER = gql`
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

const GET_NEW_PROPOSED_TERMS = gql`
  query GetNewProposedTerms {
    proposedLoans(orderDirection: desc) {
      id
      loan_id
      proposer_type
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
      existence
    }
  }
`;

const GET_RENEGOTIATIONS = gql`
  query ($loanID: BigInt) {
    renegotiatedLoans(where: { loan_id: $loanID }) {
      id
      loan_id
      user_custom_id
      renegotiaited_loan_id
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

const GET_PROPOSED_BUYOUTS = gql`
  query ($loanID: BigInt) {
    buyOuts(where: { loan_id: $loanID }) {
      id
      buyer
      buyout_amount
      existence
    }
  }
`;

const GET_CHAT = gql`
  {
    chatPusheds {
      id
      loan_id
      user_custom_id
      renegotiaited_loan_id
      messageURI
      lender_or_borrower
      chat_id
    }
  }
`;

module.exports = {
  GET_LOANS,
  GET_LOANS_NO_FILTER,
  GET_NEW_PROPOSED_TERMS,
  GET_PROPOSED_BUYOUTS,
  GET_RENEGOTIATIONS,
  GET_CHAT,
};
