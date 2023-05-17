import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { InlineNotification, Form, TextInput, Button } from "@carbon/react";

import loanParticipationService from "../../loan-participation.service";
import lenderService from "../../../lender/lender.service";
import loanService from "../../../loan/loan.service";

import { getMessageFromAxiosError } from "../../../../utils";
import { formatCurrency } from "../../../../utils/format-currency";

import BackButton from "../../../../components/BackButton";

import { GlobalContext } from "../../../../App.jsx";
import { isValidUUID } from "../../../../utils/is-valid-uuid";

const CreateLenderLoanParticipation = () => {
  const [amount, setAmount] = useState(undefined);
  const [invalidAmount, setInvalidAmount] = useState(false);
  const [loanUid, setLoanUid] = useState(undefined);
  const [invalidLoanUid, setInvalidLoanUid] = useState(false);
  const [lender, setLender] = useState(undefined);
  const [loan, setLoan] = useState(undefined);

  const [createLoanParticipationLoading, setCreateLoanParticipationLoading] =
    useState(false);
  const [createLoanParticipationError, setCreateLoanParticipationError] =
    useState(undefined);
  const [createLoanParticipationMessage, setCreateLoanParticipationMessage] =
    useState(undefined);

  const ctx = useContext(GlobalContext);
  const navigate = useNavigate();

  const { user } = ctx;

  const { uid } = useParams();

  const fetchLender = async ({ uid }) => {
    setCreateLoanParticipationLoading(true);

    try {
      const data = await lenderService.getOne({ uid });

      setLender(data);
    } catch (error) {
      setCreateLoanParticipationError(getMessageFromAxiosError(error));
    }

    setCreateLoanParticipationLoading(false);
  };

  useEffect(() => {
    if (!user) {
      return navigate("/");
    }

    fetchLender({ uid });
  }, [navigate, user, uid]);

  const fetchLoan = async ({ uid }) => {
    setCreateLoanParticipationLoading(true);

    try {
      const loan = await loanService.getOne({ uid });

      setLoan(loan);
    } catch (error) {
      setCreateLoanParticipationError(getMessageFromAxiosError(error));
    }

    setCreateLoanParticipationLoading(false);
  };

  const handleLoanUidChange = (event) => {
    const { value } = event.target;

    setLoanUid(value);

    // check if the value is a valid loan uid
    if (isValidUUID(value)) {
      fetchLoan({ uid: value });
    }
  };

  const handleCreateLoanParticipationSubmit = async (event) => {
    event.preventDefault();

    if (!amount || amount.trim().length === 0) {
      setInvalidAmount(true);
      return;
    }

    const parsedAmount = parseInt(amount, 10);
    if (isNaN(parsedAmount)) {
      setInvalidAmount(true);
      return;
    }
    setInvalidAmount(false);

    if (!loanUid || loanUid.trim().length === 0) {
      setInvalidLoanUid(true);
      return;
    }
    setInvalidLoanUid(false);

    try {
      const { message } = await loanParticipationService.create({
        lenderUid: uid,
        loanUid,
        amount: parsedAmount,
      });

      setCreateLoanParticipationMessage(message);

      // clean the values of the form
      document.getElementById("text-input-amount").value = "";
      document.getElementById("text-input-loan-uid").value = "";
      setAmount(undefined);
      setLoanUid(undefined);
    } catch (error) {
      setCreateLoanParticipationError(getMessageFromAxiosError(error));
    }

    setCreateLoanParticipationLoading(false);
  };

  return (
    <div className="cds--grid">
      <div className="cds--row">
        <BackButton />
        <div className="cds--offset-lg-5 cds--col-lg-6 cds--col-md-8 cds--col-sm-4">
          <h3 className="screen__heading">
            Lender Loan Participation Creation
          </h3>
          <Form onSubmit={handleCreateLoanParticipationSubmit}>
            <div className="cds--row" style={{ marginBottom: "1rem" }}>
              <div className="cds--col-lg-8 cds--col-sm-4">
                <p className="screen__label">D. Number</p>
                <p>{lender?.user?.documentNumber}</p>
              </div>
              <div className="cds--col-lg-8 cds--col-sm-4">
                <p className="screen__label">Full Name</p>
                <p>{lender?.user?.fullName}</p>
              </div>
            </div>
            <hr />
            <div style={{ marginBottom: "1rem" }}>
              <TextInput
                id="text-input-amount"
                labelText="Amount"
                invalid={invalidAmount}
                invalidText="Invalid value"
                onChange={(event) => setAmount(event.target.value)}
                autoComplete="off"
              />
              <p>{formatCurrency(amount, "COP")}</p>
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <TextInput
                id="text-input-loan-uid"
                labelText="Loan UID"
                invalid={invalidLoanUid}
                invalidText="Invalid value"
                onChange={handleLoanUidChange}
                autoComplete="off"
              />
            </div>
            {loan && (
              <div className="cds--row" style={{ marginBottom: "1rem" }}>
                <div className="cds--col-lg-8 cds--col-sm-4">
                  <p className="screen__label">Alias</p>
                  <p>{loan.alias || "-"}</p>
                </div>
                <div className="cds--col-lg-8 cds--col-sm-4">
                  <p className="screen__label">Loan Amount</p>
                  <p>{formatCurrency(loan.amount, "COP")}</p>
                </div>
              </div>
            )}
            {createLoanParticipationError && (
              <div
                style={{ marginBottom: "1rem" }}
                className="screen__notification_container"
              >
                <InlineNotification
                  kind="error"
                  subtitle={createLoanParticipationError}
                  title="Uups!"
                  onClose={() => setCreateLoanParticipationError(undefined)}
                />
              </div>
            )}
            {createLoanParticipationMessage && (
              <div
                style={{ marginBottom: "1rem" }}
                className="screen__notification_container"
              >
                <InlineNotification
                  kind="success"
                  subtitle={createLoanParticipationMessage}
                  title="Cool!"
                  onClose={() => setCreateLoanParticipationMessage(undefined)}
                />
              </div>
            )}
            <div style={{ marginBottom: "1rem" }}>
              <Button
                className="btn-block"
                type="submit"
                size="sm"
                disabled={createLoanParticipationLoading}
              >
                Crear
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CreateLenderLoanParticipation;
