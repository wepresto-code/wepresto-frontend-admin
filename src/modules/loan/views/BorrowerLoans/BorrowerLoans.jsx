import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  InlineNotification,
  Pagination,
  IconButton,
  Search,
  Button,
} from "@carbon/react";
import { View } from "@carbon/icons-react";

import loanService from "../../loan.service";

import { delay, getMessageFromAxiosError } from "../../../../utils";
import { formatCurrency } from "../../../../utils/format-currency";
import { formatDate } from "../../../../utils/format-date";

import BackButton from "../../../../components/BackButton";
import AppDataTable from "../../../../components/AppDataTable";

import { GlobalContext } from "../../../../App.jsx";

const headers = [
  {
    key: "alias",
    header: "Alias",
  },
  {
    key: "amount",
    header: "Amount",
  },
  {
    key: "annualInterestRate",
    header: "A.I.R",
  },
  {
    key: "annualInterestOverdueRate",
    header: "A.I.O.R",
  },
  {
    key: "term",
    header: "Term",
  },
  {
    key: "startDate",
    header: "Start Date",
  },
  {
    key: "status",
    header: "Status",
  },
  {
    key: "comment",
    header: "Comment",
  },
  {
    key: "actions",
    header: "Actions",
  },
];

const BorrowerLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loansLoading, setLoansLoading] = useState(true);
  const [loansError, setLoansError] = useState("");

  const [totalRows, setTotalRows] = useState(0);
  const [currentPageSize, setCurrentPageSize] = useState(10);

  const [q, setQ] = useState(undefined);

  const ctx = useContext(GlobalContext);
  const navigate = useNavigate();

  const { user } = ctx;

  const { uid } = useParams();

  const getRowItems = (rows) =>
    rows.map((row) => {
      return {
        ...row,
        amount: formatCurrency(row.amount),
        annualInterestRate: `${row.annualInterestRate * 100}%`,
        annualInterestOverdueRate: `${row.annualInterestOverdueRate * 100}%`,
        term: `${row.term} months`,
        startDate: row.startDate ? formatDate(new Date(row.startDate), "UTC") : "-",

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

  const fetchLoans = async ({
    borrowerUid = undefined,
    q = undefined,
    take = undefined,
    skip = undefined,
  }) => {
    setLoansLoading(true);

    try {
      const [{ count, loans }] = await Promise.all([
        loanService.getBorrowerLoans({ borrowerUid, q, take, skip }),
        delay(),
      ]);

      setTotalRows(count);
      setLoans(getRowItems(loans));
    } catch (error) {
      setLoansError(getMessageFromAxiosError(error));
    }

    setLoansLoading(false);
  };

  useEffect(() => {
    if (!user) {
      return navigate("/");
    }
    fetchLoans({ borrowerUid: uid, q, take: currentPageSize, skip: 0 });
  }, [navigate, user, uid]);
  return (
    <div className="cds--grid">
      <div className="cds--row">
        <BackButton />
        <div className="cds--col-sm-4">
          <h3 className="screen__heading">Borrower Loans</h3>
          {loansError && (
            <div
              style={{ marginBottom: "1rem" }}
              className="screen__notification_container"
            >
              <InlineNotification
                kind="error"
                subtitle={loansError}
                title="Uups!"
                onClose={() => setLoansError("")}
              />
            </div>
          )}
          {!loansError && loans && (
            <>
              <div className="cds--row">
                <div className="cds--col-lg-14 cds--col-sm-2">
                  <Search
                    placeholder="Find your items"
                    labelText="Search"
                    closeButtonLabelText="Clear search input"
                    id="search-1"
                    onChange={(event) => {
                      setQ(event.target.value);
                    }}
                    onKeyDown={() => {}}
                  />
                </div>
                <div className="cds--col-lg-2 cds--col-sm-2">
                  <Button
                    kind="primary"
                    size="md"
                    label=""
                    iconDescription=""
                    onClick={() =>
                      fetchLoans({ borrowerUid: uid, q, take: currentPageSize })
                    }
                    disabled={loansLoading}
                    style={{ width: "inherit" }}
                  >
                    Search
                  </Button>
                </div>
              </div>
              <AppDataTable
                title={"Loans"}
                description={"List of loans"}
                headers={headers}
                rows={loans}
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

                  fetchLoans({
                    borrowerUid: uid,
                    q,
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

export default BorrowerLoans;
