import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  InlineNotification,
  Pagination,
  IconButton,
  Button,
  NumberInput,
} from "@carbon/react";
import { Add, View } from "@carbon/icons-react";

import loanParticipationService from "../../loan-participation.service";

import { delay, getMessageFromAxiosError } from "../../../../utils";
// import { formatCurrency } from "../../../../utils/format-currency";
// import { formatDate } from "../../../../utils/format-date";

import BackButton from "../../../../components/BackButton";
import AppDataTable from "../../../../components/AppDataTable";

import { GlobalContext } from "../../../../App.jsx";

const headers = [
  {
    key: "id",
    header: "ID",
  },
  {
    key: "uid",
    header: "UID",
  },
  {
    key: "amount",
    header: "Amount",
  },
  {
    key: "participationRate",
    header: "Participation Rate",
  },
  {
    key: "annualInterestParticipationRate",
    header: "Annual Interest Participation Rate",
  },
  {
    key: "createdAt",
    header: "Created At",
  },
  {
    key: "updatedAt",
    header: "Updated At",
  },
  {
    key: "actions",
    header: "Actions",
  },
];

const LenderLoanParticipations = () => {
  const [loanParticipations, setLoanParticipations] = useState([]);
  const [loanParticipationsLoading, setLoanParticipationsLoading] =
    useState(true);
  const [loanParticipationsError, setLoanParticipationsError] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [startAmount, setStartAmount] = useState(undefined);
  // eslint-disable-next-line no-unused-vars
  const [endAmount, setEndAmount] = useState(undefined);

  const [totalRows, setTotalRows] = useState(0);
  const [currentPageSize, setCurrentPageSize] = useState(10);

  const ctx = useContext(GlobalContext);
  const navigate = useNavigate();

  const { user } = ctx;

  const { uid } = useParams();

  const getRowItems = (rows) =>
    rows.map((row) => {
      return {
        ...row,

        actions: (
          <IconButton
            kind="ghost"
            size="sm"
            label="View"
            renderIcon={View}
            iconDescription="View"
            onClick={() => navigate(`/loans/${row.uid}`)}
          />
        ),
      };
    });

  const fetchLoanParticipations = async ({
    lenderUid = undefined,
    startAmount = undefined,
    endAmount = undefined,
    take = undefined,
    skip = undefined,
  }) => {
    setLoanParticipationsLoading(true);

    try {
      const [{ count, participations }] = await Promise.all([
        loanParticipationService.getLenderParticipations({
          lenderUid,
          startAmount,
          endAmount,
          take,
          skip,
        }),
        delay(),
      ]);

      setTotalRows(count);
      setLoanParticipations(getRowItems(participations));
    } catch (error) {
      setLoanParticipationsError(getMessageFromAxiosError(error));
    }

    setLoanParticipationsLoading(false);
  };

  useEffect(() => {
    if (!user) {
      return navigate("/");
    }
    fetchLoanParticipations({ lenderUid: uid, take: currentPageSize, skip: 0 });
  }, [navigate, user, uid]);
  return (
    <div className="cds--grid">
      <div className="cds--row">
        <BackButton />
        <div className="cds--col-sm-4">
          <h3 className="screen__heading">Lender Loan Participations</h3>
          {loanParticipationsError && (
            <div
              style={{ marginBottom: "1rem" }}
              className="screen__notification_container"
            >
              <InlineNotification
                kind="error"
                subtitle={loanParticipationsError}
                title="Uups!"
                onClose={() => setLoanParticipationsError("")}
              />
            </div>
          )}
          {!loanParticipationsError && loanParticipations && (
            <>
              <div className="cds--row">
                <div
                  className="cds--col-lg-2 cds--col-sm-2"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    kind="ghost"
                    label="Create Loan Participation"
                    iconDescription="Create"
                    size="sm"
                    renderIcon={Add}
                    onClick={() => navigate("/home")}
                    style={{
                      width: "inherit",
                      marginBottom: "0.05rem",
                      minWidth: "100%",
                    }}
                  >
                    Create
                  </Button>
                </div>
                <div className="cds--col-lg-3 cds--col-sm-2">
                  <NumberInput
                    id="carbon-number"
                    min={0}
                    max={100000000}
                    label="Start amount"
                    helperText=""
                    invalidText=""
                    size="sm"
                    onChange={(e) => setStartAmount(e.target.value)}
                  />
                </div>
                <div className="cds--col-lg-3 cds--col-sm-2">
                  <NumberInput
                    id="carbon-number"
                    min={0}
                    max={100000000}
                    label="End amount"
                    helperText=""
                    invalidText=""
                    size="sm"
                    onChange={(e) => setEndAmount(e.target.value)}
                  />
                </div>
                <div
                  className="cds--col-lg-2 cds--col-sm-2"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    kind="primary"
                    label=""
                    iconDescription=""
                    size="sm"
                    onClick={() =>
                      fetchLoanParticipations({
                        lenderUid: uid,
                        take: currentPageSize,
                        startAmount,
                        endAmount,
                      })
                    }
                    disabled={loanParticipationsLoading}
                    style={{
                      width: "inherit",
                      marginBottom: "0.05rem",
                      minWidth: "100%",
                    }}
                  >
                    Search
                  </Button>
                </div>
              </div>
              <AppDataTable
                title={"Loan Participations"}
                description={"List of loan participations"}
                headers={headers}
                rows={loanParticipations}
              />
              <Pagination
                totalItems={totalRows}
                backwardText="Previous page"
                forwardText="Next page"
                pageSize={currentPageSize}
                pageSizes={[5, 10, 15, 25]}
                itemsPerPageText="Items per page"
                onChange={({ page, pageSize }) => {
                  if (pageSize !== currentPageSize) {
                    setCurrentPageSize(pageSize);
                  }

                  fetchLoanParticipations({
                    lenderUid: uid,
                    take: pageSize,
                    skip: pageSize * (page - 1),
                  });
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

export default LenderLoanParticipations;
