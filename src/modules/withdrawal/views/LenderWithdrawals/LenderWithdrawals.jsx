import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  InlineNotification,
  Pagination,
  IconButton,
  Button,
  NumberInput,
} from "@carbon/react";
import { View } from "@carbon/icons-react";

import withdrawalService from "../../withdrawal.service";

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
    key: "depositAmount",
    header: "Deposit Amount",
  },
  {
    key: "comissionAmount",
    header: "Comission Amount",
  },
  {
    key: "status",
    header: "Status",
  },
  {
    key: "actions",
    header: "Actions",
  },
];

const LenderWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [withdrawalsLoading, setWithdrawalsLoading] = useState(true);
  const [withdrawalsError, setWithdrawalsError] = useState("");
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
            onClick={() => navigate(`/withdrawals/${row.uid}`)}
          />
        ),
      };
    });

  const fetchWithdrawals = async ({
    lenderUid = undefined,
    startAmount = undefined,
    endAmount = undefined,
    take = undefined,
    skip = undefined,
  }) => {
    setWithdrawalsLoading(true);

    try {
      const [{ count, withdrawals }] = await Promise.all([
        withdrawalService.getLenderWithdrawals({
          lenderUid,
          startAmount,
          endAmount,
          take,
          skip,
        }),
        delay(),
      ]);

      setTotalRows(count);
      setWithdrawals(getRowItems(withdrawals));
    } catch (error) {
      setWithdrawalsError(getMessageFromAxiosError(error));
    }

    setWithdrawalsLoading(false);
  };

  useEffect(() => {
    if (!user) {
      return navigate("/");
    }
    fetchWithdrawals({ lenderUid: uid, take: currentPageSize, skip: 0 });
  }, [navigate, user, uid]);
  return (
    <div className="cds--grid">
      <div className="cds--row">
        <BackButton />
        <div className="cds--col-sm-4">
          <h3 className="screen__heading">Lender Withdrawals</h3>
          {withdrawalsError && (
            <div
              style={{ marginBottom: "1rem" }}
              className="screen__notification_container"
            >
              <InlineNotification
                kind="error"
                subtitle={withdrawalsError}
                title="Uups!"
                onClose={() => setWithdrawalsError("")}
              />
            </div>
          )}
          {!withdrawalsError && withdrawals && (
            <>
              <div className="cds--row">
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
                      fetchWithdrawals({
                        lenderUid: uid,
                        take: currentPageSize,
                        startAmount,
                        endAmount,
                      })
                    }
                    disabled={withdrawalsLoading}
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
                title={"Loan Withdrawals"}
                description={"List of loan withdrawals"}
                headers={headers}
                rows={withdrawals}
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

                  fetchWithdrawals({
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

export default LenderWithdrawals;
