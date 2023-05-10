import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  InlineNotification,
  Form,
  TextInput,
  DatePicker,
  DatePickerInput,
  Button,
} from "@carbon/react";

import movementService from "../../../movement/movement.service";
import { getMessageFromAxiosError, formatCurrency } from "../../../../utils";

import BackButton from "../../../../components/BackButton";

import { GlobalContext } from "../../../../App.jsx";

const BorrowerLoanPayment = () => {
  const [amount, setAmount] = useState(undefined);
  const [invalidAmount, setInvalidAmount] = useState(false);
  // const [paymentDate, setPaymentDate] = useState(undefined);
  const [invalidPaymentDate, setInvalidPaymentDate] = useState(false);

  const [reportPaymentLoading, setReportPaymentLoading] = useState(false);
  const [reportPaymentError, setReportPaymentError] = useState(undefined);
  const [reportPaymentMessage, setReportPaymentMessage] = useState(undefined);

  const ctx = useContext(GlobalContext);
  const navigate = useNavigate();

  const { user } = ctx;

  const { loanUid } = useParams();

  useEffect(() => {
    if (!user) {
      return navigate("/");
    }
  }, [navigate, user, loanUid]);

  const handleReportPaymentSubmit = async (event) => {
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

    // get the value from the date picker with id "paymentDate"
    const paymentDateValue = document.getElementById("paymentDate").value;

    if (!paymentDateValue) {
      setInvalidPaymentDate(true);
      return;
    }
    setInvalidPaymentDate(false);

    const parsedPaymentDate = new Date(paymentDateValue);

    const isoPaymentDate = parsedPaymentDate.toISOString();

    const paymentDate = isoPaymentDate.split("T")[0];

    setReportPaymentLoading(true);

    try {
      const { message } = await movementService.createPayment({
        loanUid,
        amount: parsedAmount,
        paymentDate,
      });

      setReportPaymentMessage(message);

      // clean the values of the form
      document.getElementById("paymentDate").value = "";
      document.getElementById("amount").value = "";
      setAmount(undefined);
    } catch (error) {
      setReportPaymentError(getMessageFromAxiosError(error));
    }

    setReportPaymentLoading(false);
  };

  return (
    <div className="cds--grid">
      <div className="cds--row">
        <div className="cds--offset-lg-5 cds--col-lg-6 cds--col-md-8 cds--col-sm-4">
          <BackButton />
          <h3 className="screen__heading">Reportar pago</h3>
          <Form onSubmit={handleReportPaymentSubmit}>
            <div style={{ marginBottom: "1rem" }}>
              <TextInput
                id="amount"
                labelText="Monto"
                invalid={invalidAmount}
                invalidText="Valor inválido"
                onChange={(event) => setAmount(event.target.value)}
                autoComplete="off"
              />
              <p>{formatCurrency(amount)}</p>
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <DatePicker dateFormat="m/d/Y" datePickerType="single">
                <DatePickerInput
                  id="paymentDate"
                  placeholder="mm/dd/yyyy"
                  labelText="Fecha de pago"
                  type="text"
                  invalid={invalidPaymentDate}
                  invalidText="Valor inválido"
                  // onChange={(event) => { console.log("event", event); setPaymentDate(event.target.value);}}
                  // onClose={(event) => { console.log("event", event); setPaymentDate(event.target.value);}}
                  autoComplete="off"
                />
              </DatePicker>
            </div>
            {reportPaymentError && (
              <div
                style={{ marginBottom: "1rem" }}
                className="screen__notification_container"
              >
                <InlineNotification
                  kind="error"
                  subtitle={<span>{reportPaymentError}</span>}
                  title="Uups!"
                  onClose={() => setReportPaymentError(undefined)}
                />
              </div>
            )}
            {reportPaymentMessage && (
              <div
                style={{ marginBottom: "1rem" }}
                className="screen__notification_container"
              >
                <InlineNotification
                  kind="success"
                  subtitle={<span>{reportPaymentMessage}</span>}
                  title="Cool!"
                  onClose={() => setReportPaymentMessage(undefined)}
                />
              </div>
            )}
            <div style={{ marginBottom: "1rem" }}>
              <Button
                className="btn-block"
                type="submit"
                size="sm"
                disabled={reportPaymentLoading}
              >
                Reportar
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default BorrowerLoanPayment;
