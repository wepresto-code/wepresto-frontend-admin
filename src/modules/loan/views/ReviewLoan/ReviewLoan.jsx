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

const ReviewLoan = () => {
  const [comment, setComment] = useState(undefined);

  const [reviewLoanLoading, setReviewLoanLoading] = useState(false);
  const [reviewLoanError, setReviewLoanError] = useState(undefined);
  const [reviewLoanMessage, setReviewLoanMessage] = useState(undefined);

  const ctx = useContext(GlobalContext);
  const navigate = useNavigate();

  const { user } = ctx;

  const { uid } = useParams();

  useEffect(() => {
    if (!user) {
      return navigate("/");
    }
  }, [navigate, user, uid]);

  const handleReviewLoanSubmit = async (event) => {
    event.preventDefault();

    setReviewLoanLoading(true);

    try {
      const { message } = await loanService.review({
        uid,
        comment,
      });

      setReviewLoanMessage(message);

      // clean the values of the form
      setComment(undefined);
      document.getElementById("comment-text-area").value = "";

    } catch (error) {
      setReviewLoanError(getMessageFromAxiosError(error));
    }

    setReviewLoanLoading(false);
  };

  return (
    <div className="cds--grid">
      <div className="cds--row">
        <BackButton />
        <div className="cds--offset-lg-5 cds--col-lg-6 cds--col-md-8 cds--col-sm-4">
          <h3 className="screen__heading">Loan Review</h3>
          <Form onSubmit={handleReviewLoanSubmit}>
            <div style={{ marginBottom: "1rem" }}>
              <TextArea
                labelText="Comment"
                helperText=""
                rows={4}
                id="comment-text-area"
                onChange={(event) => setComment(event.target.value)}
              />
            </div>
            {reviewLoanError && (
              <div
                style={{ marginBottom: "1rem" }}
                className="screen__notification_container"
              >
                <InlineNotification
                  kind="error"
                  subtitle={<span>{reviewLoanError}</span>}
                  title="Uups!"
                  onClose={() => setReviewLoanError(undefined)}
                />
              </div>
            )}
            {reviewLoanMessage && (
              <div
                style={{ marginBottom: "1rem" }}
                className="screen__notification_container"
              >
                <InlineNotification
                  kind="success"
                  subtitle={<span>{reviewLoanMessage}</span>}
                  title="Cool!"
                  onClose={() => setReviewLoanMessage(undefined)}
                />
              </div>
            )}
            <div style={{ marginBottom: "1rem" }}>
              <Button
                className="btn-block"
                type="submit"
                size="sm"
                disabled={reviewLoanLoading}
              >
                Review
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ReviewLoan;
