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

import loanService from "../../../loan/loan.service";
import { getMessageFromAxiosError, formatCurrency } from "../../../../utils";

import BackButton from "../../../../components/BackButton";

import { GlobalContext } from "../../../../App.jsx";

const BorrowerLoanCreate = () => {
  const [amount, setAmount] = useState(undefined);
  const [invalidAmount, setInvalidAmount] = useState(false);
  const [monthlyInterestRate, setMonthlyInterestRate] = useState(undefined);
  const [invalidMonthlyInterestRate, setInvalidMonthlyInterestRate] = useState(false);
  const [monthlyInterestOverdueRate, setMonthlyInterestOverdueRate] = useState(undefined);
  const [invalidMonthlyInterestOverdueRate, setInvalidMonthlyInterestOverdueRate] = useState(false);
  const [description, setDescription] = useState(undefined);
  const [invalidDescription, setInvalidDescription] = useState(false);

  
  const [invalidStartDate, setInvalidStartDate] = useState(false);

  const [createLoanLoading, setCreateLoanLoading] = useState(false);
  const [createLoanError, setCreateLoanError] = useState(undefined);
  const [createLoanMessage, setCreateLoanMessage] = useState(undefined);

  const ctx = useContext(GlobalContext);
  const navigate = useNavigate();

  const { user } = ctx;

  const { authUid } = useParams();

  useEffect(() => {
    if (!user) {
      return navigate("/");
    }
  }, [navigate, user, authUid]);

  const handleCreateLoanSubmit = async (event) => {
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

    const parsedMonthlyInterestRate = parseFloat(monthlyInterestRate);
    if (isNaN(parsedMonthlyInterestRate)) {
      setInvalidMonthlyInterestRate(true);
      return;
    }
    setInvalidMonthlyInterestRate(false);

    const parsedMonthlyInterestOverdueRate = parseFloat(monthlyInterestOverdueRate);
    if (isNaN(parsedMonthlyInterestOverdueRate)) {
      setInvalidMonthlyInterestOverdueRate(true);
      return;
    }
    setInvalidMonthlyInterestOverdueRate(false);

    // get the value from the date picker with id "paymentDate"
    const startDateValue = document.getElementById("startDate").value;

    if (!startDateValue) {
      setInvalidStartDate(true);
      return;
    }
    setInvalidStartDate(false);
    
    const parsedStartDate = new Date(startDateValue);

    const isoStartDate = parsedStartDate.toISOString();

    const startDate = isoStartDate.split("T")[0];

    if (!description || description.trim().length === 0) {
      setInvalidDescription(true);
      return;
    }
    setInvalidDescription(false);

    setCreateLoanLoading(true);

    try {
      const { message } = await loanService.createLoan({
        userAuthUid: authUid,
        amount: parsedAmount,
        monthlyInterestRate: parsedMonthlyInterestRate,
        monthlyInterestOverdueRate: parsedMonthlyInterestOverdueRate,
        startDate,
        description,
      });

      setCreateLoanMessage(message);

      // clean the values of the form
      document.getElementById("startDate").value = "";
      document.getElementById("amount").value = "";
      setAmount(undefined);
    } catch (error) {
      setCreateLoanError(getMessageFromAxiosError(error));
    }

    setCreateLoanLoading(false);
  };

  return (
    <div className="cds--grid">
      <div className="cds--row">
        <div className="cds--offset-lg-5 cds--col-lg-6 cds--col-md-8 cds--col-sm-4">
          <BackButton />
          <h3 className="screen__heading">Crear prestamo</h3>
          <Form onSubmit={handleCreateLoanSubmit}>
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
              <TextInput
                id="monthlyInterestRate"
                labelText="Interes mensual"
                invalid={invalidMonthlyInterestRate}
                invalidText="Valor inválido"
                onChange={(event) => setMonthlyInterestRate(event.target.value)}
                autoComplete="off"
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <TextInput
                id="monthlyInterestOverdueRate"
                labelText="Interes mensual mora"
                invalid={invalidMonthlyInterestOverdueRate}
                invalidText="Valor inválido"
                onChange={(event) => setMonthlyInterestOverdueRate(event.target.value)}
                autoComplete="off"
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <DatePicker dateFormat="m/d/Y" datePickerType="single">
                <DatePickerInput
                  id="startDate"
                  placeholder="mm/dd/yyyy"
                  labelText="Fecha de prestamo"
                  type="text"
                  invalid={invalidStartDate}
                  invalidText="Valor inválido"
                  // onChange={(event) => { console.log("event", event); setPaymentDate(event.target.value);}}
                  // onClose={(event) => { console.log("event", event); setPaymentDate(event.target.value);}}
                  autoComplete="off"
                />
              </DatePicker>
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <TextInput
                id="description"
                labelText="Descripcion"
                invalid={invalidDescription}
                invalidText="Valor inválido"
                onChange={(event) => setDescription(event.target.value)}
                autoComplete="off"
              />
            </div>
            {createLoanError && (
              <div style={{ marginBottom: "1rem" }} className="screen__notification_container">
                <InlineNotification
                  kind="error"
                  subtitle={createLoanError}
                  title="Uups!"
                  onClose={() => setCreateLoanError(undefined)}
                />
              </div>
            )}
            {createLoanMessage && (
              <div style={{ marginBottom: "1rem" }} className="screen__notification_container">
                <InlineNotification
                  kind="success"
                  subtitle={createLoanMessage}
                  title="Cool!"
                  onClose={() => setCreateLoanMessage(undefined)}
                />
              </div>
            )}
            <div style={{ marginBottom: "1rem" }}>
              <Button
                className="btn-block"
                type="submit"
                size="sm"
                disabled={createLoanLoading}
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

export default BorrowerLoanCreate;
