import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  InlineLoading,
  InlineNotification,
  Tag,
  Button,
  ActionableNotification,
} from "@carbon/react";
import { Search, CloseOutline, CheckmarkOutline } from "@carbon/icons-react";

import loanRequestService from "../../../loan-request/loan-request.service";

import {
  delay,
  getMessageFromAxiosError,
  formatCurrency,
  capitalizeFirstLetter,
  formatDate,
} from "../../../../utils";

import BackButton from "../../../../components/BackButton";

import { GlobalContext } from "../../../../App.jsx";

const getTagType = (status) => {
  switch (status) {
    case "CREADA":
      return "gray";
    case "REVISION":
      return "high-contrast";
    case "RECHAZADA":
      return "red";
    case "APROBADA":
      return "green";
    default:
      return "";
  }
};

const BorrowerLoanRequest = () => {
  const [loanRequestDetails, setLoanRequestDetails] = useState(undefined);
  const [loanRequestDetailsLoading, setLoanRequestDetailsLoading] =
    useState(true);
  const [loanRequestDetailsError, setLoanRequestDetailsError] =
    useState(undefined);

  const [wantToReview, setWantToReview] = useState(false);
  const [reviewError, setReviewError] = useState(undefined);
  const [reviewMessage, setReviewMessage] = useState(undefined);

  const [wantToReject, setWantToReject] = useState(false);
  const [rejectError, setRejectError] = useState(undefined);
  const [rejectMessage, setRejectMessage] = useState(undefined);

  const [wantToApprove, setWantToApprove] = useState(false);
  const [approveError, setApproveError] = useState(undefined);
  const [approveMessage, setApproveMessage] = useState(undefined);

  const [buttonsDisabled, setButtonsDisabled] = useState(false);

  const ctx = useContext(GlobalContext);
  const navigate = useNavigate();

  const { user } = ctx;

  const { authUid, loanRequestUid } = useParams();

  const fetchLoanDetails = async ({ loanRequestUid }) => {
    setLoanRequestDetailsLoading(true);

    try {
      const [data] = await Promise.all([
        loanRequestService.getLoanRequest({ loanRequestUid }),
        delay(),
      ]);

      setLoanRequestDetails(data);
    } catch (error) {
      console.error(error);
      setLoanRequestDetailsError(getMessageFromAxiosError(error));
    }

    setLoanRequestDetailsLoading(false);
  };

  // check if the user is logged in
  // if not, redirect to login page
  // and set the variables to the state
  useEffect(() => {
    if (!user) {
      return navigate("/");
    }

    fetchLoanDetails({ loanRequestUid });
  }, [navigate, user, authUid, loanRequestUid]);

  const handleReviewLoanRequestClick = async (event) => {
    event.preventDefault();

    setWantToReview(false);
    setButtonsDisabled(true);

    try {
      const { message } = await loanRequestService.reviewLoanRequest({
        loanRequestUid,
      });

      setReviewMessage(message);
    } catch (error) {
      setReviewError(getMessageFromAxiosError(error));
    }

    setButtonsDisabled(false);
  };

  const handleRejectLoanRequestClick = async (event) => {
    event.preventDefault();

    setWantToReject(false);
    setButtonsDisabled(true);

    try {
      const { message } = await loanRequestService.rejectLoanRequest({
        loanRequestUid,
      });

      setRejectMessage(message);
    } catch (error) {
      setRejectError(getMessageFromAxiosError(error));
    }

    setButtonsDisabled(false);
  };

  const handleApproveLoanRequestClick = async (event) => {
    event.preventDefault();

    setWantToApprove(false);
    setButtonsDisabled(true);

    try {
      const { message } = await loanRequestService.approveLoanRequest({
        loanRequestUid,
      });

      setApproveMessage(message);
    } catch (error) {
      setApproveError(getMessageFromAxiosError(error));
    }

    setButtonsDisabled(false);
  };

  const getButtonsDisabled = () => {
    return wantToApprove || wantToReject || wantToReview || buttonsDisabled;
  };

  return (
    <div className="cds--grid">
      <div className="cds--row">
        <div className="cds--offset-lg-5 cds--col-lg-6 cds--col-md-8 cds--col-sm-4">
          <BackButton />
          <h3 className="screen__heading">Detalles de la solicitud</h3>
          {loanRequestDetailsLoading && (
            <InlineLoading
              status="active"
              iconDescription="Active loading indicator"
              description="Cargando..."
              className={"center-screen"}
            />
          )}
          {loanRequestDetailsError && (
            <div style={{ marginBottom: "1rem" }} className="screen__notification_container">
              <InlineNotification
                kind="error"
                iconDescription="close button"
                subtitle={<span>{loanRequestDetailsError}</span>}
                title="Uups!"
                onClose={() => setLoanRequestDetailsError(undefined)}
              />
            </div>
          )}
          {!loanRequestDetailsLoading &&
            !loanRequestDetailsError &&
            loanRequestDetails && (
              <>
                <div style={{ marginBottom: "1rem" }}>
                  <div className="cds--row">
                    <div className="cds--col">
                      <p className="screen__label screen__text--center">
                        {capitalizeFirstLetter(loanRequestDetails?.description)}
                      </p>
                    </div>
                  </div>
                  <div className="cds--row">
                    <div className="cds--col">
                      <p className="screen__label screen__text--center">
                        Monto
                      </p>
                      <p className="screen__text--center">
                        <strong>
                          {formatCurrency(loanRequestDetails?.amount)}
                        </strong>
                      </p>
                    </div>
                    <div className="cds--col">
                      <p className="screen__label screen__text--center">
                        Fecha de solicitud
                      </p>
                      <p className="screen__text--center">
                        {formatDate(loanRequestDetails?.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="cds--row">
                    <div className="cds--col screen__tag_container">
                      <Tag
                        type={getTagType(loanRequestDetails?.status)}
                        size="md"
                        title="Loan status tag"
                      >
                        {capitalizeFirstLetter(loanRequestDetails?.status)}
                      </Tag>
                    </div>
                  </div>
                </div>
                {wantToReview && (
                  <div style={{ marginBottom: "1rem" }} className="screen__notification_container">
                    <ActionableNotification
                      kind="warning"
                      title="Confirmación!"
                      subtitle="Estas segur@?"
                      onClose={() => setWantToReview(false)}
                      actionButtonLabel="Continuar"
                      onActionButtonClick={handleReviewLoanRequestClick}
                      onCloseButtonClick={() => setWantToReview(false)}
                    />
                  </div>
                )}
                {reviewError && (
                  <div style={{ marginBottom: "1rem" }} className="screen__notification_container">
                    <InlineNotification
                      kind="error"
                      iconDescription="close button"
                      subtitle={<span>{reviewError}</span>}
                      title="Uups!"
                      onClose={() => setReviewError(undefined)}
                    />
                  </div>
                )}
                {reviewMessage && (
                  <div style={{ marginBottom: "1rem" }} className="screen__notification_container">
                    <InlineNotification
                      kind="success"
                      icondescription="close button"
                      subtitle={reviewMessage}
                      title="Cool!"
                      onClose={() => setReviewMessage(undefined)}
                    />
                  </div>
                )}
                {wantToReject && (
                  <div style={{ marginBottom: "1rem" }} className="screen__notification_container">
                    <ActionableNotification
                      kind="warning"
                      title="Confirmación!"
                      subtitle="Estas segur@?"
                      onClose={() => setWantToReject(false)}
                      actionButtonLabel="Continuar"
                      onActionButtonClick={handleRejectLoanRequestClick}
                      onCloseButtonClick={() => setWantToReject(false)}
                    />
                  </div>
                )}
                {rejectError && (
                  <div style={{ marginBottom: "1rem" }} className="screen__notification_container">
                    <InlineNotification
                      kind="error"
                      iconDescription="close button"
                      subtitle={<span>{rejectError}</span>}
                      title="Uups!"
                      onClose={() => setRejectError(undefined)}
                    />
                  </div>
                )}
                {rejectMessage && (
                  <div style={{ marginBottom: "1rem" }} className="screen__notification_container">
                    <InlineNotification
                      kind="success"
                      icondescription="close button"
                      subtitle={rejectMessage}
                      title="Cool!"
                      onClose={() => setRejectMessage(undefined)}
                    />
                  </div>
                )}
                {wantToApprove && (
                  <div style={{ marginBottom: "1rem" }} className="screen__notification_container">
                    <ActionableNotification
                      kind="warning"
                      title="Confirmación!"
                      subtitle="Estas segur@?"
                      onClose={() => setWantToReject(false)}
                      actionButtonLabel="Continuar"
                      onActionButtonClick={handleApproveLoanRequestClick}
                      onCloseButtonClick={() => setWantToApprove(false)}
                    />
                  </div>
                )}
                {approveError && (
                  <div style={{ marginBottom: "1rem" }} className="screen__notification_container">
                    <InlineNotification
                      kind="error"
                      iconDescription="close button"
                      subtitle={<span>{approveError}</span>}
                      title="Uups!"
                      onClose={() => setApproveError(undefined)}
                    />
                  </div>
                )}
                {approveMessage && (
                  <div style={{ marginBottom: "1rem" }} className="screen__notification_container">
                    <InlineNotification
                      kind="success"
                      icondescription="close button"
                      subtitle={approveMessage}
                      title="Cool!"
                      onClose={() => setApproveMessage(undefined)}
                    />
                  </div>
                )}
                <div style={{ marginBottom: "1rem" }}>&nbsp;</div>
                <div style={{ marginBottom: "1rem" }}>
                  <div className="cds--row">
                    <div className="cds--col screen__centered_button_container">
                      <Button
                        kind="ghost"
                        size="sm"
                        label="Revisar solicitud"
                        iconDescription="Revisar solicitud"
                        className="screen__centered_button"
                        renderIcon={Search}
                        onClick={() => setWantToReview(true)}
                        disabled={getButtonsDisabled()}
                      >
                        Revisar
                      </Button>
                    </div>
                    <div className="cds--col screen__centered_button_container">
                      <Button
                        kind="ghost"
                        size="sm"
                        label="Rechazar solicitud"
                        iconDescription="Rechazar solicitud"
                        className="screen__centered_button"
                        renderIcon={CloseOutline}
                        onClick={() => setWantToReject(true)}
                        disabled={getButtonsDisabled()}
                      >
                        Rechazar
                      </Button>
                    </div>
                    <div className="cds--col screen__centered_button_container">
                      <Button
                        kind="ghost"
                        size="sm"
                        label="Aprobar solicitud"
                        iconDescription="Aprobar solicitud"
                        className="screen__centered_button"
                        renderIcon={CheckmarkOutline}
                        onClick={() => setWantToApprove(true)}
                        disabled={getButtonsDisabled()}
                      >
                        Aprobar
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

export default BorrowerLoanRequest;
