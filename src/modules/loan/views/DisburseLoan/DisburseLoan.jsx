import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  InlineNotification,
  Form,
  TextArea,
  DatePicker,
  DatePickerInput,
  Button,
} from "@carbon/react";

import loanService from "../../loan.service";

import { getMessageFromAxiosError } from "../../../../utils";

import BackButton from "../../../../components/BackButton";

import { GlobalContext } from "../../../../App.jsx";

const DisburseLoan = () => {
  const [comment, setComment] = useState(undefined);
  const [disbursementDate, setDisbursementDate] = useState(undefined);

  const [disburseLoanLoading, setDisburseLoanLoading] = useState(false);
  const [disburseLoanError, setDisburseLoanError] = useState(undefined);
  const [disburseLoanMessage, setDisburseLoanMessage] = useState(undefined);

  const ctx = useContext(GlobalContext);
  const navigate = useNavigate();

  const { user } = ctx;

  const { uid } = useParams();

  useEffect(() => {
    if (!user) {
      return navigate("/");
    }
  }, [navigate, user, uid]);

  const handleDatePickerOnChange = (dates = []) => {
    const [disbursementDate] = dates;

    if (disbursementDate) {
      setDisbursementDate(disbursementDate.toISOString().split("T")[0]);
    } else {
      setDisbursementDate(undefined);
    }
  };

  const handleDisburseLoanSubmit = async (event) => {
    event.preventDefault();

    setDisburseLoanLoading(true);

    try {
      const { message } = await loanService.disburse({
        uid,
        comment,
        disbursementDate,
      });

      setDisburseLoanMessage(message);

      // clean the values of the form
      setComment(undefined);
      setDisbursementDate(undefined);
      document.getElementById("comment-text-area").value = "";
      document.getElementById("payment-date-date-picker-input").value = "";

    } catch (error) {
      setDisburseLoanError(getMessageFromAxiosError(error));
    }

    setDisburseLoanLoading(false);
  };

  return (
    <div className="cds--grid">
      <div className="cds--row">
        <BackButton />
        <div className="cds--offset-lg-5 cds--col-lg-6 cds--col-md-8 cds--col-sm-4">
          <h3 className="screen__heading">Loan Disburse</h3>
          <Form onSubmit={handleDisburseLoanSubmit}>
            <div style={{ marginBottom: "1rem" }}>
              <TextArea
                labelText="Comment"
                helperText=""
                rows={4}
                id="comment-text-area"
                onChange={(event) => setComment(event.target.value)}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <DatePicker
                dateFormat="m/d/Y"
                datePickerType="single"
                onChange={handleDatePickerOnChange}
              >
                <DatePickerInput
                  id="payment-date-date-picker-input"
                  placeholder="mm/dd/yyyy"
                  labelText="Date"
                  type="text"
                  invalidText="Invalid value"
                  autoComplete="off"
                />
              </DatePicker>
            </div>
            {disburseLoanError && (
              <div
                style={{ marginBottom: "1rem" }}
                className="screen__notification_container"
              >
                <InlineNotification
                  kind="error"
                  subtitle={<span>{disburseLoanError}</span>}
                  title="Uups!"
                  onClose={() => setDisburseLoanError(undefined)}
                />
              </div>
            )}
            {disburseLoanMessage && (
              <div
                style={{ marginBottom: "1rem" }}
                className="screen__notification_container"
              >
                <InlineNotification
                  kind="success"
                  subtitle={<span>{disburseLoanMessage}</span>}
                  title="Cool!"
                  onClose={() => setDisburseLoanMessage(undefined)}
                />
              </div>
            )}
            <div style={{ marginBottom: "1rem" }}>
              <Button
                className="btn-block"
                type="submit"
                size="sm"
                disabled={disburseLoanLoading}
              >
                Disburse
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default DisburseLoan;
