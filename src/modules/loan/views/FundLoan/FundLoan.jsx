import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  InlineNotification,
  Form,
  TextArea,
  Button,
} from "@carbon/react";

import loanService from "../../loan.service";

import { getMessageFromAxiosError } from "../../../../utils";

import BackButton from "../../../../components/BackButton";

import { GlobalContext } from "../../../../App.jsx";

const FundLoan = () => {
  const [comment, setComment] = useState(undefined);

  const [fundLoanLoading, setFundLoanLoading] = useState(false);
  const [fundLoanError, setFundLoanError] = useState(undefined);
  const [fundLoanMessage, setFundLoanMessage] = useState(undefined);

  const ctx = useContext(GlobalContext);
  const navigate = useNavigate();

  const { user } = ctx;

  const { uid } = useParams();

  useEffect(() => {
    if (!user) {
      return navigate("/");
    }
  }, [navigate, user, uid]);

  const handleFundLoanSubmit = async (event) => {
    event.preventDefault();

    setFundLoanLoading(true);

    try {
      const { message } = await loanService.fund({
        uid,
        comment,
      });

      setFundLoanMessage(message);

      // clean the values of the form
      setComment(undefined);
      document.getElementById("comment-text-area").value = "";

    } catch (error) {
      setFundLoanError(getMessageFromAxiosError(error));
    }

    setFundLoanLoading(false);
  };

  return (
    <div className="cds--grid">
      <div className="cds--row">
        <BackButton />
        <div className="cds--offset-lg-5 cds--col-lg-6 cds--col-md-8 cds--col-sm-4">
          <h3 className="screen__heading">Fund the loan</h3>
          <Form onSubmit={handleFundLoanSubmit}>
            <div style={{ marginBottom: "1rem" }}>
              <TextArea
                labelText="Comment"
                helperText=""
                rows={4}
                id="comment-text-area"
                onChange={(event) => setComment(event.target.value)}
              />
            </div>
            {fundLoanError && (
              <div
                style={{ marginBottom: "1rem" }}
                className="screen__notification_container"
              >
                <InlineNotification
                  kind="error"
                  subtitle={<span>{fundLoanError}</span>}
                  title="Uups!"
                  onClose={() => setFundLoanError(undefined)}
                />
              </div>
            )}
            {fundLoanMessage && (
              <div
                style={{ marginBottom: "1rem" }}
                className="screen__notification_container"
              >
                <InlineNotification
                  kind="success"
                  subtitle={<span>{fundLoanMessage}</span>}
                  title="Cool!"
                  onClose={() => setFundLoanMessage(undefined)}
                />
              </div>
            )}
            <div style={{ marginBottom: "1rem" }}>
              <Button
                className="btn-block"
                type="submit"
                size="sm"
                disabled={fundLoanLoading}
              >
                Fund
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default FundLoan;
