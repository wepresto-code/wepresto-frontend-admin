import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { InlineLoading, InlineNotification, Tag, Button } from "@carbon/react";
import { View, Currency } from "@carbon/icons-react";

import loanService from "../../../loan/loan.service";

import {
  delay,
  getMessageFromAxiosError,
  formatCurrency,
  capitalizeFirstLetter,
  formatDate,
} from "../../../../utils";

import BackButton from "../../../../components/BackButton";

import { GlobalContext } from "../../../../App.jsx";

const BorrowerLoan = () => {
  const [loanDetails, setLoanDetails] = useState(undefined);
  const [loanDetailsLoading, setLoanDetailsLoading] = useState(true);
  const [loanDetailsError, setLoanDetailsError] = useState("");

  const ctx = useContext(GlobalContext);
  const navigate = useNavigate();

  const { user } = ctx;

  const { authUid, loanUid } = useParams();

  const fetchLoanDetails = async ({ loanUid }) => {
    setLoanDetailsLoading(true);

    try {
      const [data] = await Promise.all([
        loanService.getLoanDetails({ uid: loanUid }),
        delay(),
      ]);

      setLoanDetails(data);
    } catch (error) {
      setLoanDetailsError(getMessageFromAxiosError(error));
    }

    setLoanDetailsLoading(false);
  };

  // check if the user is logged in
  // if not, redirect to login page
  // and set the variables to the state
  useEffect(() => {
    if (!user) {
      return navigate("/");
    }

    fetchLoanDetails({ loanUid });
  }, [navigate, user, authUid, loanUid]);

  return (
    <div className="cds--grid">
      <div className="cds--row">
        <div className="cds--offset-lg-5 cds--col-lg-6 cds--col-md-8 cds--col-sm-4">
          <BackButton />
          <h3 className="screen__heading">Detalles del prestamo</h3>
          {loanDetailsLoading && (
            <InlineLoading
              status="active"
              iconDescription="Active loading indicator"
              description="Cargando..."
              className={"center-screen"}
            />
          )}
          {loanDetailsError && (
            <div style={{ marginBottom: "1rem" }} className="screen__notification_container">
              <InlineNotification
                kind="error"
                iconDescription="close button"
                subtitle={<span>{loanDetailsError}</span>}
                title="Uups!"
                onClose={() => setLoanDetailsError(undefined)}
              />
            </div>
          )}
          {!loanDetailsLoading && !loanDetailsError && loanDetails && (
            <>
              <div style={{ marginBottom: "1rem" }}>
                <div className="cds--row">
                  <div className="cds--col">
                    <p className="screen__label screen__text--center">
                      {capitalizeFirstLetter(loanDetails.description)}
                    </p>
                  </div>
                </div>
                <div className="cds--row">
                  <div className="cds--col">
                    <p className="screen__label screen__text--center">
                      Pago mínimo
                    </p>
                    <p className="screen__text--center">
                      <strong>
                        {formatCurrency(loanDetails.minimumLoanPaymentAmount)}
                      </strong>
                    </p>
                  </div>
                  <div className="cds--col">
                    <p className="screen__label screen__text--center">
                      Fecha de pago
                    </p>
                    <p className="screen__text--center">
                      {formatDate(loanDetails.loanPaymentDate)}
                    </p>
                  </div>
                </div>
                <div className="cds--row">
                  <div className="cds--col">
                    <p className="screen__label screen__text--center">
                      Valor solicitado
                    </p>
                    <p className="screen__text--center">
                      <strong>{formatCurrency(loanDetails?.amount)}</strong>
                    </p>
                  </div>
                  <div className="cds--col">
                    <p className="screen__label screen__text--center">Saldo</p>
                    <p className="screen__text--center">
                      <strong>{formatCurrency(loanDetails?.totalLoanAmount)}</strong>
                    </p>
                  </div>
                </div>
                <div className="cds--row">
                  <div className="cds--col">
                    <p className="screen__label screen__text--center">
                      Tasa efectiva mensual
                    </p>
                    <p className="screen__text--center">
                      <strong>{(loanDetails.monthlyInterestRate * 100).toFixed(2)} %</strong>
                    </p>
                  </div>
                  <div className="cds--col">
                    <p className="screen__label screen__text--center">
                      Tasa mora mensual
                    </p>
                    <p className="screen__text--center">
                      <strong>
                        {(loanDetails.monthlyInterestOverdueRate * 100).toFixed(2)} %
                      </strong>
                    </p>
                  </div>
                </div>
                <div className="cds--row">
                  <div className="cds--col screen__tag_container">
                    <Tag
                      type={
                        loanDetails.loanPaymentStatus === "atrasado"
                          ? "red"
                          : "green"
                      }
                      size="md"
                      title="Loan status tag"
                    >
                      {capitalizeFirstLetter(loanDetails.loanPaymentStatus)}
                    </Tag>
                  </div>
                </div>
              </div>
              <div style={{ marginBottom: "1rem" }}>&nbsp;</div>
              <div style={{ marginBottom: "1rem" }}>
                <div className="cds--row">
                  <div className="cds--col screen__centered_button_container">
                    <Button
                      kind="ghost"
                      size="sm"
                      label="Ver movimientos"
                      iconDescription="Ver movimientos"
                      renderIcon={View}
                      onClick={() =>
                        navigate(
                          `/borrowers/${authUid}/loans/${loanUid}/movements`
                        )
                      }
                      className="screen__centered_button"
                    >
                      Movimientos
                    </Button>
                  </div>
                  <div className="cds--col screen__centered_button_container">
                    <Button
                      kind="ghost"
                      size="sm"
                      label="Reportar pago"
                      iconDescription="Reportar pago"
                      renderIcon={Currency}
                      onClick={() =>
                        navigate(
                          `/borrowers/${authUid}/loans/${loanUid}/report-payment`
                        )
                      }
                      className="screen__centered_button"
                    >
                      Pago
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BorrowerLoan;
