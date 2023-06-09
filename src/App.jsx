import "./app.scss";

import React, { useState } from "react";
import { Content, Theme, InlineLoading } from "@carbon/react";
import { Routes, Route } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import firebaseApp from "./firebase";

import { delay } from "./utils";

import AppHeader from "./components/AppHeader";


import Login from "./modules/auth/views/Login";
import ResetPassword from "./modules/auth/views/ResetPassword";

import Home from "./modules/main/views/Home";

import Users from "./modules/user/views/Users";

import Borrower from "./modules/borrower/views/Borrower";

import BorrowerLoans from "./modules/loan/views/BorrowerLoans";
import Loan from "./modules/loan/views/Loan";
import ReviewLoan from "./modules/loan/views/ReviewLoan";
import RejectLoan from "./modules/loan/views/RejectLoan";
import ApproveLoan from "./modules/loan/views/ApproveLoan";
import FundLoan from "./modules/loan/views/FundLoan";
import DisburseLoan from "./modules/loan/views/DisburseLoan";

import LoanMovements from "./modules/movement/views/LoanMovements";
import CreatePayment from "./modules/movement/views/CreatePayment";

import Lender from "./modules/lender/views/Lender";

import LenderLoanParticipations from "./modules/loan-participation/views/LenderLoanParticipations";
import CreateLenderLoanParticipation from "./modules/loan-participation/views/CreateLenderLoanParticipation";

import LenderWithdrawals from "./modules/withdrawal/views/LenderWithdrawals";
import WithdrawalPage from "./modules/withdrawal/views/Withdrawal";

export const GlobalContext = React.createContext();

const App = () => {
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);

  const auth = getAuth(firebaseApp);

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);

    delay(500).then(() => {
      setLoading(false);
    });
  });

  return (
    <>
      <GlobalContext.Provider value={{ user }}>
        {loading && (
          <InlineLoading
            status="active"
            iconDescription="Active loading indicator"
            description="Cargando..."
            className={"center-screen"}
          />
        )}
        {!loading && user !== undefined && (
          <>
            <Theme theme="g100">
              <AppHeader />
            </Theme>
            <Content>
              <Routes>
                <Route path="/" element={<Login />} />

                <Route path="/login" element={<Login />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                <Route path="/home" element={<Home />} />

                <Route path="/users" element={<Users />} />

                <Route path="/borrowers/:uid" element={<Borrower />} />                
                <Route
                  path="/borrowers/:uid/loans"
                  element={<BorrowerLoans />}
                />

                <Route path="/loans/:uid" element={<Loan />} />
                <Route path="/loans/:uid/movements" element={<LoanMovements />} />
                <Route path="/loans/:uid/review" element={<ReviewLoan />} />
                <Route path="/loans/:uid/reject" element={<RejectLoan />} />
                <Route path="/loans/:uid/approve" element={<ApproveLoan />} />
                <Route path="/loans/:uid/fund" element={<FundLoan />} />
                <Route path="/loans/:uid/disburse" element={<DisburseLoan />} />
                <Route path="/loans/:uid/payment" element={<CreatePayment />} />

                <Route path="/lenders/:uid" element={<Lender />} />
                <Route path="/lenders/:uid/loan-participations" element={<LenderLoanParticipations />} />
                <Route path="/lenders/:uid/loan-participations/create" element={<CreateLenderLoanParticipation />} />
                <Route path="/lenders/:uid/withdrawals/" element={<LenderWithdrawals />} />

                <Route path="/withdrawals/:uid" element={<WithdrawalPage />} />

                
              </Routes>
            </Content>
          </>
        )}
      </GlobalContext.Provider>
    </>
  );
};

export default App;
