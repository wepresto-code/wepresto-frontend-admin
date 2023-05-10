import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  InlineLoading,
  InlineNotification,
  IconButton,
  Pagination,
} from "@carbon/react";
import { View } from "@carbon/icons-react";

import loanRequestService from "../../../loan-request/loan-request.service";

import {
  delay,
  getMessageFromAxiosError,
  formatCurrency,
} from "../../../../utils";

import BackButton from "../../../../components/BackButton";
import AppDataTable from "../../../../components/AppDataTable";

import { GlobalContext } from "../../../../App.jsx";

const headers = [
  {
    key: "description",
    header: "Descripción",
  },
  {
    key: "amount",
    header: "Monto",
  },
  {
    key: "status",
    header: "Estado",
  },
  {
    key: "actions",
    header: "Acciones",
  },
];

const BorrowerLoanRequests = () => {
  const [loanRequests, setLoanRequests] = useState([]);
  const [loanRequestsLoading, setLoanRequestsLoading] = useState(true);
  const [loanRequestsError, setLoanRequestsError] = useState("");

  const [firstRowIndex, setFirstRowIndex] = useState(0);
  const [currentPageSize, setCurrentPageSize] = useState(10);

  const ctx = useContext(GlobalContext);
  const navigate = useNavigate();

  const { user } = ctx;

  const { authUid } = useParams();

  const getRowItems = (rows) =>
    rows.map((row) => {
      let color;
      if (row?.status === "CREADA") color = "black";
      if (row?.status === "APROBADA") color = "green";
      if (row?.status === "REVISION") color = "orange";
      if (row?.status === "RECHAZADA") color = "red";

      return {
        ...row,
        amount: formatCurrency(row?.amount),
        status: <span style={{ color }}>{row?.status}</span>,
        actions: (
          <IconButton
            kind="ghost"
            size="sm"
            label="Ver"
            iconDescription="Ver"
            renderIcon={View}
            onClick={() => navigate(`/borrowers/${authUid}/loan-requests/${row?.uid}`)}
          />
        ),
      };
    });

  const fetchLoans = async ({ userAuthUid }) => {
    setLoanRequestsLoading(true);

    try {
      const [data] = await Promise.all([
        loanRequestService.getUserLoanRequests({ userAuthUid }),
        delay(),
      ]);

      setLoanRequests(getRowItems(data));
    } catch (error) {
      console.error(error);
      setLoanRequestsError(getMessageFromAxiosError(error));
    }

    setLoanRequestsLoading(false);
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
          <h3 className="screen__heading">Solicitudes</h3>
          {loanRequestsLoading && (
            <InlineLoading
              status="active"
              iconDescription="Active loading indicator"
              description="Cargando..."
              className={"center-screen"}
            />
          )}
          {loanRequestsError && (
            <div style={{ marginBottom: "1rem" }} className="screen__notification_container">
              <InlineNotification
                kind="error"
                subtitle={<span>{loanRequestsError}</span>}
                title="Uups!"
                onClose={() => setLoanRequestsError(undefined)}
              />
            </div>
          )}
          {!loanRequestsLoading && !loanRequestsError && loanRequests && (
            <>
              <AppDataTable
                title={"Lista"}
                description={"de las solicitudes"}
                headers={headers}
                rows={loanRequests.slice(
                  firstRowIndex,
                  firstRowIndex + currentPageSize
                )}
              />
              <Pagination
                totalItems={loanRequests.length}
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

export default BorrowerLoanRequests;
