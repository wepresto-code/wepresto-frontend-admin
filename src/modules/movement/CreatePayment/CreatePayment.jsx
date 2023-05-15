import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  InlineNotification,
  Form,
  TextInput,
  DatePicker,
  DatePickerInput,
  Button,
  FileUploader,
} from "@carbon/react";

import environment from "../../../environment";

import movementService from "../movement.service";

import { getMessageFromAxiosError } from "../../../utils";
import { formatCurrency } from "../../../utils/format-currency";

import BackButton from "../../../components/BackButton";

import { GlobalContext } from "../../../App.jsx";

const CreatePayment = () => {
  const [amount, setAmount] = useState(undefined);
  const [invalidAmount, setInvalidAmount] = useState(false);
  const [paymentDate, setPaymentDate] = useState(undefined);
  const [file, setFile] = useState(undefined);

  const [reportPaymentLoading, setReportPaymentLoading] = useState(false);
  const [reportPaymentError, setReportPaymentError] = useState(undefined);
  const [reportPaymentMessage, setReportPaymentMessage] = useState(undefined);

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
    const [paymentDate] = dates;

    if (paymentDate) {
      setPaymentDate(paymentDate.toISOString().split("T")[0]);
    } else {
      setPaymentDate(undefined);
    }
  };

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

    // check the file size
    if (file) {
      const { size } = file;
      if (size > environment.MAX_PROOF_FILE_SIZE) {
        setReportPaymentError("The file size is too big");
        return;
      }
    }

    setReportPaymentLoading(true);

    try {
      const { message } = await movementService.createPayment({
        loanUid: uid,
        amount: parsedAmount,
        paymentDate,
        file,
      });

      setReportPaymentMessage(message);

      // clean the values of the form
      document.getElementById("paymentDate").value = "";
      document.getElementById("amount").value = "";
      setPaymentDate(undefined);
      setAmount(undefined);
      setFile(undefined);
    } catch (error) {
      setReportPaymentError(getMessageFromAxiosError(error));
    }

    setReportPaymentLoading(false);
  };

  return (
    <div className="cds--grid">
      <div className="cds--row">
        <BackButton />
        <div className="cds--offset-lg-5 cds--col-lg-6 cds--col-md-8 cds--col-sm-4">
          <h3 className="screen__heading">Payment Creation</h3>
          <Form onSubmit={handleReportPaymentSubmit}>
            <div style={{ marginBottom: "1rem" }}>
              <TextInput
                id="amount"
                labelText="Amount"
                invalid={invalidAmount}
                invalidText="Invalid value"
                onChange={(event) => setAmount(event.target.value)}
                autoComplete="off"
              />
              <p>{formatCurrency(amount)}</p>
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <DatePicker
                dateFormat="m/d/Y"
                datePickerType="single"
                onChange={handleDatePickerOnChange}
              >
                <DatePickerInput
                  id="paymentDate"
                  placeholder="mm/dd/yyyy"
                  labelText="Date"
                  type="text"
                  invalidText="Valor inválido"
                  autoComplete="off"
                />
              </DatePicker>
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <FileUploader
                labelTitle="Proof file"
                labelDescription="Max file size is 15mb. Only [.jpg, .png] files are supported."
                buttonLabel="Add file"
                buttonKind="primary"
                size="sm"
                filenameStatus="edit"
                accept={[".jpg", ".png"]}
                multiple={false}
                disabled={false}
                iconDescription="Delete file"
                name=""
                onChange={(event) => setFile(event.target.files[0])}
                onDelete={() => setFile(undefined)}
              />
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

export default CreatePayment;
