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

const ApproveLoan = () => {
  const [comment, setComment] = useState(undefined);

  const [approveLoanLoading, setApproveLoanLoading] = useState(false);
  const [approveLoanError, setApproveLoanError] = useState(undefined);
  const [approveLoanMessage, setApproveLoanMessage] = useState(undefined);

  const ctx = useContext(GlobalContext);
  const navigate = useNavigate();

  const { user } = ctx;

  const { uid } = useParams();

  useEffect(() => {
    if (!user) {
      return navigate("/");
    }
  }, [navigate, user, uid]);

  const handleApproveLoanSubmit = async (event) => {
    event.preventDefault();

    setApproveLoanLoading(true);

    try {
      const { message } = await loanService.approve({
        uid,
        comment,
      });

      setApproveLoanMessage(message);

      // clean the values of the form
      setComment(undefined);
      document.getElementById("comment-text-area").value = "";

    } catch (error) {
      setApproveLoanError(getMessageFromAxiosError(error));
    }

    setApproveLoanLoading(false);
  };

  return (
    <div className="cds--grid">
      <div className="cds--row">
        <BackButton />
        <div className="cds--offset-lg-5 cds--col-lg-6 cds--col-md-8 cds--col-sm-4">
          <h3 className="screen__heading">Loan Approve</h3>
          <Form onSubmit={handleApproveLoanSubmit}>
            <div style={{ marginBottom: "1rem" }}>
              <TextArea
                labelText="Comment"
                helperText=""
                rows={4}
                id="comment-text-area"
                onChange={(event) => setComment(event.target.value)}
              />
            </div>
            {approveLoanError && (
              <div
                style={{ marginBottom: "1rem" }}
                className="screen__notification_container"
              >
                <InlineNotification
                  kind="error"
                  subtitle={<span>{approveLoanError}</span>}
                  title="Uups!"
                  onClose={() => setApproveLoanError(undefined)}
                />
              </div>
            )}
            {approveLoanMessage && (
              <div
                style={{ marginBottom: "1rem" }}
                className="screen__notification_container"
              >
                <InlineNotification
                  kind="success"
                  subtitle={<span>{approveLoanMessage}</span>}
                  title="Cool!"
                  onClose={() => setApproveLoanMessage(undefined)}
                />
              </div>
            )}
            <div style={{ marginBottom: "1rem" }}>
              <Button
                className="btn-block"
                type="submit"
                size="sm"
                disabled={approveLoanLoading}
              >
                Approve
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ApproveLoan;
