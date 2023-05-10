import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  InlineLoading,
  InlineNotification,
  Pagination,
  IconButton,
} from "@carbon/react";
import { View } from "@carbon/icons-react";

import loanService from "../../../loan/loan.service";

import { delay, getMessageFromAxiosError } from "../../../../utils";

import BackButton from "../../../../components/BackButton";
import AppDataTable from "../../../../components/AppDataTable";

import { GlobalContext } from "../../../../App.jsx";

const headers = [
  {
    key: "documentNumber",
    header: "Document",
  },
  {
    key: "fullName",
    header: "Nombre",
  },
  {
    key: "inOverdue",
    header: "¿En mora?",
  },
  {
    key: "actions",
    header: "Acciones",
  },
];

const Borrowers = () => {
  const [borrowers, setBorrowers] = useState([]);
  const [borrowersLoading, setBorrowersLoading] = useState(true);
  const [borrowersError, setBorrowersError] = useState("");

  const [firstRowIndex, setFirstRowIndex] = useState(0);
  const [currentPageSize, setCurrentPageSize] = useState(10);

  const ctx = useContext(GlobalContext);
  const navigate = useNavigate();

  const { user } = ctx;

  const getRowItems = (rows) =>
    rows.map((row) => {
      let color;
      if (!row?.inOverdue) color = "green";
      if (row?.inOverdue) color = "red";

      return {
        ...row,
        inOverdue: (
          <span style={{ color }}>{row?.inOverdue ? "Si" : "No"}</span>
        ),
        actions: (
          <IconButton
            kind="ghost"
            size="sm"
            label="Ver"
            iconDescription="Ver"
            renderIcon={View}
            onClick={() => navigate(`/borrowers/${row?.authUid}`)}
          />
        ),
      };
    });

  const fetchBorrowers = async () => {
    setBorrowersLoading(true);

    try {
      const [data] = await Promise.all([loanService.getBorrowers(), delay()]);

      setBorrowers(getRowItems(data));
    } catch (error) {
      setBorrowersError(getMessageFromAxiosError(error));
    }

    setBorrowersLoading(false);
  };

  useEffect(() => {
    if (!user) {
      return navigate("/");
    }

    fetchBorrowers();
  }, [navigate, user]);
  return (
    <div className="cds--grid">
      <div className="cds--row">
        <div className="cds--offset-lg-5 cds--col-lg-6 cds--col-md-8 cds--col-sm-4">
          <BackButton />
          <h3 className="screen__heading">Prestatarios</h3>
          {borrowersLoading && (
            <InlineLoading
              status="active"
              iconDescription="Active loading indicator"
              description="Cargando..."
              className={"center-screen"}
            />
          )}
          {borrowersError && (
            <div
              style={{ marginBottom: "1rem" }}
              className="screen__notification_container"
            >
              <InlineNotification
                kind="error"
                iconDescription="close button"
                subtitle={<span>{borrowersError}</span>}
                title="Uups!"
                onClose={() => setBorrowersError(undefined)}
              />
            </div>
          )}
          {!borrowersLoading && !borrowersError && borrowers && (
            <>
              <AppDataTable
                title={"Lista"}
                description={"de los prestatarios"}
                headers={headers}
                rows={borrowers.slice(
                  firstRowIndex,
                  firstRowIndex + currentPageSize
                )}
              />
              <Pagination
                totalItems={borrowers.length}
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

export default Borrowers;
