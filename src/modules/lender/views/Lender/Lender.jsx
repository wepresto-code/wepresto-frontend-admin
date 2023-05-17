import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { InlineLoading, InlineNotification, Button } from "@carbon/react";
import { List } from "@carbon/icons-react";

import lenderService from "../../lender.service";

import { delay, getMessageFromAxiosError } from "../../../../utils";
import { formatDate } from "../../../../utils/format-date";

import BackButton from "../../../../components/BackButton";

import { GlobalContext } from "../../../../App.jsx";

const Lender = () => {
  const [lender, setLender] = useState(undefined);
  const [lenderLoading, setLenderLoading] = useState(true);
  const [lenderError, setLenderError] = useState("");

  const ctx = useContext(GlobalContext);
  const navigate = useNavigate();

  const { user } = ctx;

  const { uid } = useParams();

  const fetchLender = async ({ uid }) => {
    setLenderLoading(true);

    try {
      const [data] = await Promise.all([
        lenderService.getOne({ uid }),
        delay(),
      ]);

      setLender(data);
    } catch (error) {
      setLenderError(getMessageFromAxiosError(error));
    }

    setLenderLoading(false);
  };

  useEffect(() => {
    if (!user) {
      return navigate("/");
    }

    fetchLender({ uid });
  }, [navigate, user, uid]);
  return (
    <div className="cds--grid">
      <div className="cds--row">
        <BackButton />
        <div className="cds--col-sm-4">
          {lenderLoading && (
            <InlineLoading
              status="active"
              iconDescription="Active loading indicator"
              description="Cargando..."
              className={"center-screen"}
            />
          )}
          {lenderError && (
            <div
              style={{ marginBottom: "1rem" }}
              className="screen__notification_container"
            >
              <InlineNotification
                kind="error"
                iconDescription="close button"
                subtitle={<span>{lenderError}</span>}
                title="Uups!"
                onClose={() => setLenderError(undefined)}
              />
            </div>
          )}
          {!lenderLoading && !lenderError && lender && (
            <>
              <h3 className="screen__heading">Lender Details</h3>
              <div style={{ marginBottom: "1rem" }}>
                <div className="cds--row">
                  <div
                    className="cds--col-lg-16 cds--col-sm-4"
                    style={{ marginTop: "1rem", marginBottom: "1rem" }}
                  >
                    <p>User Info:</p>
                    <hr />
                  </div>
                  <div className="cds--col-lg-2 cds--col-sm-4">
                    <p className="screen__label">ID</p>
                    <p>{lender?.user?.id}</p>
                  </div>
                  <div className="cds--col-lg-4 cds--col-sm-4">
                    <p className="screen__label">UID</p>
                    <p>{lender?.user?.authUid}</p>
                  </div>
                  <div className="cds--col-lg-2 cds--col-sm-4">
                    <p className="screen__label">D. Type</p>
                    <p>{lender?.user?.documentType}</p>
                  </div>
                  <div className="cds--col-lg-2 cds--col-sm-4">
                    <p className="screen__label">D. Number</p>
                    <p>{lender?.user?.documentNumber}</p>
                  </div>
                  <div className="cds--col-lg-4 cds--col-sm-4">
                    <p className="screen__label">Full name</p>
                    <p>{lender?.user?.fullName}</p>
                  </div>
                  <div className="cds--col-lg-2 cds--col-sm-4">
                    <p className="screen__label">Phone number</p>
                    <p>{lender?.user?.phoneNumber}</p>
                  </div>
                  <div className="cds--col-lg-4 cds--col-sm-4">
                    <p className="screen__label">Email</p>
                    <p>{lender?.user?.email}</p>
                  </div>
                  <div className="cds--col-lg-2 cds--col-sm-4">
                    <p className="screen__label">Country</p>
                    <p>{lender?.user?.country}</p>
                  </div>
                  <div className="cds--col-lg-2 cds--col-sm-4">
                    <p className="screen__label">City</p>
                    <p>{lender?.user?.city}</p>
                  </div>
                  <div className="cds--col-lg-4 cds--col-sm-4">
                    <p className="screen__label">Address</p>
                    <p>{lender?.user?.address}</p>
                  </div>
                  <div className="cds--col-lg-2 cds--col-sm-4">
                    <p className="screen__label">Created at</p>
                    <p>{formatDate(new Date(lender?.user?.createdAt), "UTC")}</p>
                  </div>
                  <div className="cds--col-lg-2 cds--col-sm-4">
                    <p className="screen__label">Updated at</p>
                    <p>{formatDate(new Date(lender?.user?.updatedAt), "UTC")}</p>
                  </div>
                  <div
                    className="cds--col-lg-16 cds--col-sm-4"
                    style={{ marginTop: "1rem", marginBottom: "1rem" }}
                  >
                    <p>Lender Info:</p>
                    <hr />
                  </div>
                  <div className="cds--col-lg-2 cds--col-sm-4">
                    <p className="screen__label">ID</p>
                    <p>{lender?.id}</p>
                  </div>
                  <div className="cds--col-lg-4 cds--col-sm-4">
                    <p className="screen__label">UID</p>
                    <p>{lender?.uid}</p>
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
                      onClick={() => navigate(`/lenders/${uid}/loan-participations`)}
                      className="screen__centered_button"
                    >
                      Loan participations
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

export default Lender;
