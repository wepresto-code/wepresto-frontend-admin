import React, { useState, useEffect, useContext } from "react";
import {
  InlineLoading,
  InlineNotification,
  Accordion,
  AccordionItem,
  Form,
  FileUploader,
  Button,
  IconButton,
} from "@carbon/react";
import { useNavigate, useParams } from "react-router-dom";
import { View } from "@carbon/icons-react";

import environment from "../../../../environment";

import withdrawalService from "../../withdrawal.service";

import { formatCurrency, getMessageFromAxiosError } from "../../../../utils";

import BackButton from "../../../../components/BackButton";

import { GlobalContext } from "../../../../App.jsx";

const WithdrawalPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(undefined);
  const [withdrawal, setWithdrawal] = useState(undefined);

  const [file, setFile] = useState(undefined);

  const ctx = useContext(GlobalContext);
  const navigate = useNavigate();

  const { user } = ctx;

  const { uid } = useParams();

  const fetchWithdrawal = async ({ uid }) => {
    try {
      const data = await withdrawalService.getOne({ uid });

      setWithdrawal(data);
    } catch (error) {
      setError(getMessageFromAxiosError(error.message));
    }
  };

  useEffect(() => {
    if (!user) {
      return navigate("/");
    }

    fetchWithdrawal({ uid }).finally(() => setLoading(false));
  }, []);

  const handleCompleteWithdrawalSubmit = async (event) => {
    event.preventDefault();

    // check the file size
    if (!file) {
      alert("Please select a file");
      return;
    }

    const { size } = file;
    if (size > environment.MAX_PROOF_FILE_SIZE) {
      alert("The file size is too big");
      return;
    }

    try {
      const { message } = await withdrawalService.complete({
        uid,
        file,
      });

      alert(message);
    } catch (error) {
      setError(getMessageFromAxiosError(error));
    }
  };

  return (
    <div className="cds--grid">
      <div className="cds--row">
        <BackButton />
        <div className="cds--col-sm-4">
          {loading && (
            <InlineLoading
              status="active"
              iconDescription="Active loading indicator"
              description="Loading..."
              className={"center-screen"}
            />
          )}
          {error && (
            <div
              style={{ marginBottom: "1rem" }}
              className="screen__notification_container"
            >
              <InlineNotification
                kind="error"
                subtitle={error}
                title="Oops!"
                onClose={() => setError(undefined)}
              />
            </div>
          )}

          {!loading && !error && withdrawal && (
            <>
              <h3 className="screen__heading">Withdrawal</h3>
              <Accordion>
                <AccordionItem title="Details">
                  <div className="cds--row">
                    <div className="cds--col-lg-2 cds--col-sm-4">
                      <p className="screen__label">ID</p>
                      <p>{withdrawal?.id}</p>
                    </div>
                    <div className="cds--col-lg-6 cds--col-sm-4">
                      <p className="screen__label">UID</p>
                      <p>{withdrawal?.uid}</p>
                    </div>
                    <div className="cds--col-lg-4 cds--col-sm-4">
                      <p className="screen__label">Amount</p>
                      <p>{formatCurrency(withdrawal?.amount)}</p>
                    </div>
                    <div className="cds--col-lg-4 cds--col-sm-4">
                      <p className="screen__label">Deposit amount</p>
                      <p>{formatCurrency(withdrawal?.depositAmount)}</p>
                    </div>
                    <div className="cds--col-lg-4 cds--col-sm-4">
                      <p className="screen__label">Comission amount</p>
                      <p>{formatCurrency(withdrawal?.comissionAmount)}</p>
                    </div>
                    <div className="cds--col-lg-4 cds--col-sm-4">
                      <p className="screen__label">Status</p>
                      <p>{withdrawal?.status}</p>
                    </div>
                    <div className="cds--col-lg-2 cds--col-sm-4">
                      <p className="screen__label">Bank</p>
                      <p>{withdrawal?.accountInfo?.bank}</p>
                    </div>
                    <div className="cds--col-lg-2 cds--col-sm-4">
                      <p className="screen__label">Account type</p>
                      <p>{withdrawal?.accountInfo?.accountType}</p>
                    </div>
                    <div className="cds--col-lg-4 cds--col-sm-4">
                      <p className="screen__label">Account number</p>
                      <p>{withdrawal?.accountInfo?.accountNumber}</p>
                    </div>
                    {withdrawal?.proofURL && (
                      <div className="cds--col-lg-4 cds--col-sm-4">
                        <p className="screen__label">Proof</p>
                        <IconButton
                          kind="ghost"
                          size="sm"
                          label="Ver"
                          iconDescription="Ver"
                          renderIcon={View}
                          onClick={() => {
                            window.open(withdrawal?.proofURL, "_blank");
                          }}
                        />
                      </div>
                    )}
                  </div>
                </AccordionItem>
                <AccordionItem title="Deposit">
                  <Form onSubmit={handleCompleteWithdrawalSubmit}>
                    <div style={{ marginBottom: "1rem" }}>
                      <FileUploader
                        labelTitle="Proof file"
                        labelDescription="Max file size is 15mb. Only [.jpg, .png] files are supported."
                        buttonLabel="Add file"
                        buttonKind="primary"
                        size="sm"
                        filenameStatus="edit"
                        accept={[".jpg", ".png"]}
                        iconDescription="Delete file"
                        name="file"
                        multiple={false}
                        disabled={false}
                        onChange={(event) => setFile(event.target.files[0])}
                        onDelete={() => setFile(undefined)}
                      />
                    </div>
                    <div>
                      <Button
                        type="submit"
                        size="sm"
                        disabled={
                          withdrawal?.status !==
                          environment.REQUESTED_WITHDRAWAL_STATUS
                        }
                      >
                        Enviar
                      </Button>
                    </div>
                  </Form>
                </AccordionItem>
              </Accordion>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WithdrawalPage;
