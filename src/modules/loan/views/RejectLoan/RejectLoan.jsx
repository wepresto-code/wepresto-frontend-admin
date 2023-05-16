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

const RejectLoan = () => {
  const [comment, setComment] = useState(undefined);

  const [rejectLoanLoading, setRejectLoanLoading] = useState(false);
  const [rejectLoanError, setRejectLoanError] = useState(undefined);
  const [rejectLoanMessage, setRejectLoanMessage] = useState(undefined);

  const ctx = useContext(GlobalContext);
  const navigate = useNavigate();

  const { user } = ctx;

  const { uid } = useParams();

  useEffect(() => {
    if (!user) {
      return navigate("/");
    }
  }, [navigate, user, uid]);

  const handleRejectLoanSubmit = async (event) => {
    event.preventDefault();

    setRejectLoanLoading(true);

    try {
      const { message } = await loanService.reject({
        uid,
        comment,
      });

      setRejectLoanMessage(message);

      // clean the values of the form
      setComment(undefined);
      document.getElementById("comment-text-area").value = "";

    } catch (error) {
      setRejectLoanError(getMessageFromAxiosError(error));
    }

    setRejectLoanLoading(false);
  };

  return (
    <div className="cds--grid">
      <div className="cds--row">
        <BackButton />
        <div className="cds--offset-lg-5 cds--col-lg-6 cds--col-md-8 cds--col-sm-4">
          <h3 className="screen__heading">Loan Reject</h3>
          <Form onSubmit={handleRejectLoanSubmit}>
            <div style={{ marginBottom: "1rem" }}>
              <TextArea
                labelText="Comment"
                helperText=""
                rows={4}
                id="comment-text-area"
                onChange={(event) => setComment(event.target.value)}
              />
            </div>
            {rejectLoanError && (
              <div
                style={{ marginBottom: "1rem" }}
                className="screen__notification_container"
              >
                <InlineNotification
                  kind="error"
                  subtitle={<span>{rejectLoanError}</span>}
                  title="Uups!"
                  onClose={() => setRejectLoanError(undefined)}
                />
              </div>
            )}
            {rejectLoanMessage && (
              <div
                style={{ marginBottom: "1rem" }}
                className="screen__notification_container"
              >
                <InlineNotification
                  kind="success"
                  subtitle={<span>{rejectLoanMessage}</span>}
                  title="Cool!"
                  onClose={() => setRejectLoanMessage(undefined)}
                />
              </div>
            )}
            <div style={{ marginBottom: "1rem" }}>
              <Button
                className="btn-block"
                type="submit"
                size="sm"
                disabled={rejectLoanLoading}
              >
                Reject
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default RejectLoan;
