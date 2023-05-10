import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { InlineLoading, InlineNotification, Button } from "@carbon/react";
import { View } from "@carbon/icons-react";

import userService from "../../../user/user.service";

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

  const { authUid } = useParams();

  const fetchBorrower = async ({ userAuthUid }) => {
    setBorrowerLoading(true);

    try {
      const [data] = await Promise.all([
        userService.getOne({ authUid: userAuthUid }),
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

    fetchBorrower({ userAuthUid: authUid });
  }, [navigate, user, authUid]);
  return (
    <div className="cds--grid">
      <div className="cds--row">
        <div className="cds--offset-lg-5 cds--col-lg-6 cds--col-md-8 cds--col-sm-4">
          <BackButton />
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
              <h3 className="screen__heading">{borrower?.fullName}</h3>
              <div style={{ marginBottom: "1rem" }}>
                <div className="cds--row">
                  <div className="cds--col">
                    <p className="screen__label">Número de identificación</p>
                    <p>{borrower?.documentNumber}</p>
                  </div>
                </div>
                <div className="cds--row">
                  <div className="cds--col">
                    <p className="screen__label">Email</p>
                    <p>{borrower?.email}</p>
                  </div>
                </div>
                <div className="cds--row">
                  <div className="cds--col">
                    <p className="screen__label">Télefono</p>
                    <p>{borrower?.phone}</p>
                  </div>
                </div>
                <div className="cds--row">
                  <div className="cds--col">
                    <p className="screen__label">Dirección</p>
                    <p>{borrower?.address}</p>
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
                      renderIcon={View}
                      onClick={() => navigate(`/borrowers/${authUid}/loans`)}
                      className="screen__centered_button"
                    >
                      Prestamos
                    </Button>
                  </div>
                  <div className="cds--col screen__centered_button_container">
                    <Button
                      kind="ghost"
                      size="sm"
                      label="Ver las solicitudes"
                      iconDescription="Ver las solicitudes"
                      renderIcon={View}
                      onClick={() =>
                        navigate(`/borrowers/${authUid}/loan-requests`)
                      }
                      className="screen__centered_button"
                    >
                      Solicitudes
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
