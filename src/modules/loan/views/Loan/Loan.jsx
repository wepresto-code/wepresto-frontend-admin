import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  InlineLoading,
  InlineNotification,
  Button,
  Pagination,
} from "@carbon/react";
import { List, Currency, Review, Close, Checkmark, Finance } from "@carbon/icons-react";

import environment from "../../../../environment";

import loanService from "../../loan.service";

import BackButton from "../../../../components/BackButton";
import AppDataTable from "../../../../components/AppDataTable";

import { delay, getMessageFromAxiosError } from "../../../../utils";
import { formatCurrency } from "../../../../utils/format-concurrency";
import { formatDate } from "../../../../utils/format-date";
import { approximateToTwoDecimals } from "../../../../utils/approximate-to-two-decimals";

import { GlobalContext } from "../../../../App.jsx";

const headers = [
  {
    key: "dueDate",
    header: "Due Date",
  },
  {
    key: "type",
    header: "Type",
  },
  {
    key: "amount",
    header: "Amount",
  },
  {
    key: "principal",
    header: "Principal",
  },
  {
    key: "interest",
    header: "Interest",
  },
];

const Loan = () => {
  const [loan, setLoan] = useState(undefined);
  const [minimumPaymentInfo, setMinimumPaymentInfo] = useState(undefined);
  const [totalPaymentInfo, setTotalPaymentInfo] = useState(undefined);
  const [loanLoading, setLoanLoading] = useState(true);
  const [loanError, setLoanError] = useState("");

  const [firstRowIndex, setFirstRowIndex] = useState(0);
  const [currentPageSize, setCurrentPageSize] = useState(5);

  const [firstRowIndex1, setFirstRowIndex1] = useState(0);
  const [currentPageSize1, setCurrentPageSize1] = useState(5);

  const ctx = useContext(GlobalContext);
  const navigate = useNavigate();

  const { user } = ctx;

  const { uid } = useParams();

  const getRowItems = (rows) =>
    rows.map((row) => {
      return {
        ...row,
        id: "" + row.id,
        dueDate: formatDate(new Date(row.dueDate)),
        amount: formatCurrency(row.amount),
        principal: row.principal ? formatCurrency(row.principal) : "-",
        interest: row.interest ? formatCurrency(row.interest) : "-",
      };
    });

  const fetchLoan = async ({ uid }) => {
    setLoanLoading(true);

    try {
      const [loan, minimumPaymentInfo, totalPaymentInfo] = await Promise.all([
        loanService.getOne({ uid }),
        loanService.getMinimumPaymentAmount({ uid }),
        loanService.getTotalPaymentAmount({ uid }),
        delay(),
      ]);

      setLoan(loan);
      setMinimumPaymentInfo(minimumPaymentInfo);
      setTotalPaymentInfo(totalPaymentInfo);
    } catch (error) {
      setLoanError(getMessageFromAxiosError(error));
    }

    setLoanLoading(false);
  };

  useEffect(() => {
    if (!user) {
      return navigate("/");
    }

    fetchLoan({ uid });
  }, [navigate, user, uid]);

  return (
    <div className="cds--grid">
      <div className="cds--row">
        <div className="cds--col-sm-4">
          <BackButton />
          {loanLoading && (
            <InlineLoading
              status="active"
              iconDescription="Active loading indicator"
              description="Loading..."
              className={"center-screen"}
            />
          )}
          {loanError && (
            <div
              style={{ marginBottom: "1rem" }}
              className="screen__notification_container"
            >
              <InlineNotification
                kind="error"
                iconDescription="close button"
                subtitle={<span>{loanError}</span>}
                title="Oops!"
                onClose={() => setLoanError(undefined)}
              />
            </div>
          )}
          {!loanLoading && !loanError && loan && (
            <>
              <h3 className="screen__heading">{loan?.uid}</h3>
              <div style={{ marginBottom: "1rem" }}>
                <div className="cds--row">
                  <div className="cds--col-lg-2 cds--col-sm-4">
                    <p className="screen__label">ID</p>
                    <p>{loan?.id}</p>
                  </div>
                  <div className="cds--col-lg-2 cds--col-sm-4">
                    <p className="screen__label">Alias</p>
                    <p>{loan?.alias || "-"}</p>
                  </div>
                  <div className="cds--col-lg-2 cds--col-sm-4">
                    <p className="screen__label">Amount</p>
                    <p>{formatCurrency(loan?.amount)}</p>
                  </div>
                  <div className="cds--col-lg-2 cds--col-sm-4">
                    <p className="screen__label">A.I.R</p>
                    <p>{loan?.annualInterestRate * 100}%</p>
                  </div>
                  <div className="cds--col-lg-2 cds--col-sm-4">
                    <p className="screen__label">A.I.O.R</p>
                    <p>{loan?.annualInterestOverdueRate * 100}%</p>
                  </div>
                  <div className="cds--col-lg-2 cds--col-sm-4">
                    <p className="screen__label">Term</p>
                    <p>{loan?.term} months</p>
                  </div>
                  <div className="cds--col-lg-2 cds--col-sm-4">
                    <p className="screen__label">Start date</p>
                    <p>{loan?.startDate ? formatDate(new Date(loan?.startDate)) : "-"}</p>
                  </div>
                  <div className="cds--col-lg-2 cds--col-sm-4">
                    <p className="screen__label">Status</p>
                    <p>{loan?.status}</p>
                  </div>
                  <div className="cds--col-lg-16 cds--col-sm-4">
                    <p className="screen__label">Comment</p>
                    <p>{loan?.comment ? loan?.comment : "-"}</p>
                  </div>
                  {loan.status === environment.DISBURSED_LOAN_STATUS && (
                    <>
                      <div
                        className="cds--col-lg-16 cds--col-sm-4"
                        style={{ marginTop: "1rem", marginBottom: "1rem" }}
                      >
                        <p>Minimum payment information:</p>
                        <hr />
                      </div>
                      <div className="cds--col-lg-2 cds--col-sm-4">
                        <p className="screen__label">Total amount</p>
                        <p>
                          {formatCurrency(
                            approximateToTwoDecimals(
                              minimumPaymentInfo?.totalAmount
                            )
                          )}
                        </p>
                      </div>
                      <div className="cds--col-lg-2 cds--col-sm-4">
                        <p className="screen__label">Interest</p>
                        <p>
                          {formatCurrency(
                            approximateToTwoDecimals(
                              minimumPaymentInfo?.interest
                            )
                          )}
                        </p>
                      </div>
                      <div className="cds--col-lg-2 cds--col-sm-4">
                        <p className="screen__label">Principal</p>
                        <p>
                          {formatCurrency(
                            approximateToTwoDecimals(
                              minimumPaymentInfo?.principal
                            )
                          )}
                        </p>
                      </div>
                      <div className="cds--col-lg-2 cds--col-sm-4">
                        <p className="screen__label">Over due interest</p>
                        <p>
                          {minimumPaymentInfo?.overDueInterest
                            ? formatCurrency(
                                approximateToTwoDecimals(
                                  minimumPaymentInfo?.overDueInterest
                                )
                              )
                            : "-"}
                        </p>
                      </div>
                      <div className="cds--col-lg-2 cds--col-sm-4">
                        <p className="screen__label">Payment date</p>
                        <p>
                          {minimumPaymentInfo?.paymentDate
                            ? formatDate(
                                new Date(minimumPaymentInfo?.paymentDate)
                              )
                            : "-"}
                        </p>
                      </div>
                      <div className="cds--col-lg-16 cds--col-sm-4">
                        <p className="screen__label">Movements</p>
                        <AppDataTable
                          title={"Lista"}
                          description={"de los ultimos 30 días"}
                          headers={headers}
                          rows={getRowItems(
                            minimumPaymentInfo.movements.slice(
                              firstRowIndex,
                              firstRowIndex + currentPageSize
                            )
                          )}
                        />
                        <Pagination
                          totalItems={minimumPaymentInfo.movements.length}
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
                      </div>
                      <div
                        className="cds--col-lg-16 cds--col-sm-4"
                        style={{ marginTop: "1rem", marginBottom: "1rem" }}
                      >
                        <p>Total payment information:</p>
                        <hr />
                      </div>
                      <div className="cds--col-lg-2 cds--col-sm-4">
                        <p className="screen__label">Total amount</p>
                        <p>
                          {formatCurrency(
                            approximateToTwoDecimals(
                              totalPaymentInfo?.totalAmount
                            )
                          )}
                        </p>
                      </div>
                      <div className="cds--col-lg-2 cds--col-sm-4">
                        <p className="screen__label">Interest</p>
                        <p>
                          {formatCurrency(
                            approximateToTwoDecimals(totalPaymentInfo?.interest)
                          )}
                        </p>
                      </div>
                      <div className="cds--col-lg-2 cds--col-sm-4">
                        <p className="screen__label">Principal</p>
                        <p>
                          {formatCurrency(
                            approximateToTwoDecimals(
                              totalPaymentInfo?.principal
                            )
                          )}
                        </p>
                      </div>
                      <div className="cds--col-lg-2 cds--col-sm-4">
                        <p className="screen__label">Over due interest</p>
                        <p>
                          {totalPaymentInfo?.overDueInterest
                            ? formatCurrency(
                                approximateToTwoDecimals(
                                  totalPaymentInfo?.overDueInterest
                                )
                              )
                            : "-"}
                        </p>
                      </div>
                      <div className="cds--col-lg-2 cds--col-sm-4">
                        <p className="screen__label">Payment date</p>
                        <p>
                          {totalPaymentInfo?.paymentDate
                            ? formatDate(
                                new Date(totalPaymentInfo?.paymentDate)
                              )
                            : "-"}
                        </p>
                      </div>
                      <div className="cds--col-lg-16 cds--col-sm-4">
                        <p className="screen__label">Movements</p>
                        <AppDataTable
                          title={"Lista"}
                          description={"de los ultimos 30 días"}
                          headers={headers}
                          rows={getRowItems(
                            totalPaymentInfo.movements.slice(
                              firstRowIndex1,
                              firstRowIndex1 + currentPageSize1
                            )
                          )}
                        />
                        <Pagination
                          totalItems={totalPaymentInfo.movements.length}
                          backwardText="Anterior"
                          forwardText="Siguiente"
                          pageSize={currentPageSize1}
                          pageSizes={[5, 10, 15, 25]}
                          itemsPerPageText=""
                          onChange={({ page, pageSize }) => {
                            if (pageSize !== currentPageSize1) {
                              setCurrentPageSize1(pageSize);
                            }
                            setFirstRowIndex1(pageSize * (page - 1));
                          }}
                          size="sm"
                        />
                      </div>
                    </>
                  )}
                  {loan.status !== environment.REJECTED_LOAN_STATUS && (
                    <div
                      className="cds--col-lg-16 cds--col-sm-4"
                      style={{ marginTop: "1rem", marginBottom: "1rem" }}
                    >
                      <p>Actions:</p>
                      <hr />
                    </div>
                  )}
                  {loan.status === environment.APPLIED_LOAN_STATUS && (
                    <div className="cds--col screen__centered_button_container">
                      <Button
                        kind="ghost"
                        size="sm"
                        label="Review the loan"
                        iconDescription="Review the loan"
                        renderIcon={Review}
                        onClick={() => navigate("/home")}
                        className="screen__centered_button"
                      >
                        Review
                      </Button>
                    </div>
                  )}
                  {loan.status === environment.REVIEWED_LOAN_STATUS && (
                    <div className="cds--col screen__centered_button_container">
                      <Button
                        kind="ghost"
                        size="sm"
                        label="Reject the loan"
                        iconDescription="Reject the loan"
                        renderIcon={Close}
                        onClick={() => navigate("/home")}
                        className="screen__centered_button"
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                  {loan.status === environment.REVIEWED_LOAN_STATUS && (
                    <div className="cds--col screen__centered_button_container">
                      <Button
                        kind="ghost"
                        size="sm"
                        label="Approve the loan"
                        iconDescription="Approve the loan"
                        renderIcon={Checkmark}
                        onClick={() => navigate("/home")}
                        className="screen__centered_button"
                      >
                        Approve
                      </Button>
                    </div>
                  )}
                  {loan.status === environment.APPROVED_LOAN_STATUS && (
                    <div className="cds--col screen__centered_button_container">
                      <Button
                        kind="ghost"
                        size="sm"
                        label="Report payment"
                        iconDescription="Report payment"
                        renderIcon={Finance}
                        onClick={() => navigate("/home")}
                        className="screen__centered_button"
                      >
                        Disburse
                      </Button>
                    </div>
                  )}
                  {loan.status === environment.DISBURSED_LOAN_STATUS && (
                    <div className="cds--col screen__centered_button_container">
                      <Button
                        kind="ghost"
                        size="sm"
                        label="View movements"
                        iconDescription="View movements"
                        renderIcon={List}
                        onClick={() => navigate(`/loans/${uid}/movements`)}
                        className="screen__centered_button"
                      >
                        Movements
                      </Button>
                    </div>
                  )}
                  {loan.status === environment.DISBURSED_LOAN_STATUS && (
                    <div className="cds--col screen__centered_button_container">
                      <Button
                        kind="ghost"
                        size="sm"
                        label="Report payment"
                        iconDescription="Report payment"
                        renderIcon={Currency}
                        onClick={() => navigate("/home")}
                        className="screen__centered_button"
                      >
                        Report payment
                      </Button>
                    </div>
                  )}
                  <div style={{ marginBottom: "1rem" }}>&nbsp;</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Loan;
