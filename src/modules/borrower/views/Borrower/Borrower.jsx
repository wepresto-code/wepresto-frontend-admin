import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { InlineLoading, InlineNotification, Button } from "@carbon/react";
import { List } from "@carbon/icons-react";

import borrowerService from "../../borrower.service";

import { delay, getMessageFromAxiosError } from "../../../../utils";

import BackButton from "../../../../components/BackButton";

import { GlobalContext } from "../../../../App.jsx";

const Borrower = () => {
  const [borrower, setBorrower] = useState(undefined);
  const [borrowerLoading, setBorrowerLoading] = useState(true);
  const [borrowerError, setBorrowerError] = useState("");

  const ctx = useContext(GlobalContext);
  const navigate = useNavigate();

  const { user } = ctx;

  const { uid } = useParams();

  const fetchBorrower = async ({ uid }) => {
    setBorrowerLoading(true);

    try {
      const [data] = await Promise.all([
        borrowerService.getOne({ uid }),
        delay(),
      ]);

      setBorrower(data);
    } catch (error) {
      setBorrowerError(getMessageFromAxiosError(error));
    }

    setBorrowerLoading(false);
  };

  useEffect(() => {
    if (!user) {
      return navigate("/");
    }

    fetchBorrower({ uid });
  }, [navigate, user, uid]);
  return (
    <div className="cds--grid">
      <div className="cds--row">
        <BackButton />
        <div className="cds--col-sm-4">
          {borrowerLoading && (
            <InlineLoading
              status="active"
              iconDescription="Active loading indicator"
              description="Cargando..."
              className={"center-screen"}
            />
          )}
          {borrowerError && (
            <div style={{ marginBottom: "1rem" }} className="screen__notification_container">
              <InlineNotification
                kind="error"
                iconDescription="close button"
                subtitle={<span>{borrowerError}</span>}
                title="Uups!"
                onClose={() => setBorrowerError(undefined)}
              />
            </div>
          )}
          {!borrowerLoading && !borrowerError && borrower && (
            <>
              <h3 className="screen__heading">Borrower Details</h3>
              <div style={{ marginBottom: "1rem" }}>
                <div className="cds--row">
                  <div className="cds--col">
                    <p className="screen__label">ID</p>
                    <p>{borrower?.id}</p>
                  </div>
                  <div className="cds--col">
                    <p className="screen__label">UID</p>
                    <p>{borrower?.uid}</p>
                  </div>
                  <div className="cds--col">
                    <p className="screen__label">Created at</p>
                    <p>{borrower?.createdAt}</p>
                  </div>
                  <div className="cds--col">
                    <p className="screen__label">Updated at</p>
                    <p>{borrower?.updatedAt}</p>
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
                      label="Ver los préstamos"
                      iconDescription="Ver los préstamos"
                      renderIcon={List}
                      onClick={() => navigate(`/borrowers/${uid}/loans`)}
                      className="screen__centered_button"
                    >
                      Loans
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

export default Borrower;
