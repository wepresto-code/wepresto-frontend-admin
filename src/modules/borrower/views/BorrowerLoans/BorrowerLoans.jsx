import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  InlineLoading,
  InlineNotification,
  IconButton,
  Pagination,
  Button,
} from "@carbon/react";
import { View } from "@carbon/icons-react";

import loanService from "../../../loan/loan.service";

import {
  delay,
  getMessageFromAxiosError,
  formatCurrency,
  formatDate,
} from "../../../../utils";

import BackButton from "../../../../components/BackButton";
import AppDataTable from "../../../../components/AppDataTable";

import { GlobalContext } from "../../../../App.jsx";

const headers = [
  {
    key: "amount",
    header: "Monto",
  },
  {
    key: "minimumLoanPaymentAmount",
    header: "Pago mínimo",
  },
  {
    key: "loanPaymentDate",
    header: "Fecha de pago",
  },
  {
    key: "loanPaymentStatus",
    header: "Estado",
  },
  {
    key: "actions",
    header: "Acciones",
  },
];

const BorrowerLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loansLoading, setLoansLoading] = useState(true);
  const [loansError, setLoansError] = useState("");

  const [firstRowIndex, setFirstRowIndex] = useState(0);
  const [currentPageSize, setCurrentPageSize] = useState(10);

  const ctx = useContext(GlobalContext);
  const navigate = useNavigate();

  const { user } = ctx;

  const { authUid } = useParams();

  const getRowItems = (rows) =>
    rows.map((row) => {
      let color;
      if (row?.loanPaymentStatus === "al día") color = "green";
      if (row?.loanPaymentStatus === "atrasado") color = "red";

      return {
        ...row,
        amount: formatCurrency(row?.amount),
        minimumLoanPaymentAmount: formatCurrency(row?.minimumLoanPaymentAmount),
        loanPaymentDate: formatDate(row?.loanPaymentDate),
        loanPaymentStatus: (
          <span style={{ color }}>{row?.loanPaymentStatus}</span>
        ),
        actions: (
          <IconButton
            kind="ghost"
            size="sm"
            label="Ver"
            iconDescription="Ver"
            renderIcon={View}
            onClick={() => navigate(`/borrowers/${authUid}/loans/${row?.uid}`)}
          />
        ),
      };
    });

  const fetchLoans = async ({ userAuthUid }) => {
    setLoansLoading(true);

    try {
      const [data] = await Promise.all([
        loanService.getUserLoans({ userAuthUid }),
        delay(),
      ]);

      setLoans(getRowItems(data));
    } catch (error) {
      setLoansError(getMessageFromAxiosError(error));
    }

    setLoansLoading(false);
  };

  useEffect(() => {
    if (!user) {
      return navigate("/");
    }

    fetchLoans({ userAuthUid: authUid });
  }, [navigate, user]);

  return (
    <div className="cds--grid">
      <div className="cds--row">
        <div className="cds--offset-lg-5 cds--col-lg-6 cds--col-md-8 cds--col-sm-4">
          <BackButton />
          <h3 className="screen__heading">Prestamos</h3>
          {loansLoading && (
            <InlineLoading
              status="active"
              iconDescription="Active loading indicator"
              description="Cargando..."
              className={"center-screen"}
            />
          )}
          {loansError && (
            <div
              style={{ marginBottom: "1rem" }}
              className="screen__notification_container"
            >
              <InlineNotification
                kind="error"
                iconDescription="close button"
                subtitle={<span>{loansError}</span>}
                title="Uups!"
                onClose={() => setLoansError(undefined)}
              />
            </div>
          )}
          {!loansLoading && !loansError && loans && (
            <>
              <div style={{ marginBottom: "1rem" }}>
                <Button
                  kind="ghost"
                  size="sm"
                  label="Crear prestamo"
                  iconDescription="Crear prestamo"
                  onClick={() => navigate(`/borrowers/${authUid}/loans/create`)}
                >
                  Crear prestamo
                </Button>
              </div>
              <AppDataTable
                title={"Lista"}
                description={"de los prestamos"}
                headers={headers}
                rows={loans.slice(
                  firstRowIndex,
                  firstRowIndex + currentPageSize
                )}
              />
              <Pagination
                totalItems={loans.length}
                backwardText="Anterior"
                forwardText="Siguiente"
                pageSize={currentPageSize}
                pageSizes={[5, 10, 15, 25]}
                itemsPerPageText=""
                onChange={({ page, pageSize }) => {
                  if (pageSize !== currentPageSize) {
                    setCurrentPageSize(pageSize);
                  }
                  setFirstRowIndex(pageSize * (page - 1));
                }}
                size="sm"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BorrowerLoans;
