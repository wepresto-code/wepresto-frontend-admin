import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  InlineNotification,
  Pagination,
  IconButton,
  Search,
  Button,
} from "@carbon/react";
import { View } from "@carbon/icons-react";

import userService from "../../user.service";

import { delay, getMessageFromAxiosError } from "../../../../utils";

import BackButton from "../../../../components/BackButton";
import AppDataTable from "../../../../components/AppDataTable";

import { GlobalContext } from "../../../../App.jsx";

const headers = [
  {
    key: "type",
    header: "User type",
  },
  {
    key: "documentType",
    header: "Document Type",
  },
  {
    key: "documentNumber",
    header: "Document",
  },
  {
    key: "fullName",
    header: "Nombre",
  },
  {
    key: "email",
    header: "Email",
  },
  {
    key: "phoneNumber",
    header: "Phone Number",
  },
  {
    key: "country",
    header: "Country",
  },
  {
    key: "city",
    header: "City",
  },
  {
    key: "address",
    header: "Address",
  },
  {
    key: "actions",
    header: "Actions",
  },
];

const Users = () => {
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState("");

  const [totalRows, setTotalRows] = useState(0);
  const [currentPageSize, setCurrentPageSize] = useState(10);

  const [q, setQ] = useState("");

  const ctx = useContext(GlobalContext);
  const navigate = useNavigate();

  const { user } = ctx;

  const getRowItems = (rows) =>
    rows.map((row) => {
      const type = row?.type.toLowerCase();

      return {
        ...row,

        actions: (
          <IconButton
            kind="ghost"
            size="sm"
            label="View"
            renderIcon={View}
            iconDescription="View"
            onClick={() => navigate(`/${type}s/${row[type]?.uid}`)}
          />
        ),
      };
    });

  const fetchUsers = async ({ q = "", take = undefined, skip = undefined }) => {
    setUsersLoading(true);

    try {
      const [{ count, users }] = await Promise.all([
        userService.getMany({ q, take, skip }),
        delay(),
      ]);

      setTotalRows(count);
      setUsers(getRowItems(users));
    } catch (error) {
      setUsersError(getMessageFromAxiosError(error));
    }

    setUsersLoading(false);
  };

  useEffect(() => {
    if (!user) {
      return navigate("/");
    }
    fetchUsers({ q, take: currentPageSize, skip: 0 });
  }, [navigate, user]);
  return (
    <div className="cds--grid">
      <div className="cds--row">
        <BackButton />
        <div className="cds--col-sm-4">
          <h3 className="screen__heading">Users</h3>
          {usersError && (
            <div
              style={{ marginBottom: "1rem" }}
              className="screen__notification_container"
            >
              <InlineNotification
                kind="error"
                subtitle={usersError}
                title="Uups!"
                onClose={() => setUsersError("")}
              />
            </div>
          )}
          {!usersError && users && (
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
                    onClick={() => fetchUsers({ q, take: currentPageSize })}
                    disabled={usersLoading}
                    style={{ width: "inherit" }}
                  >
                    Search
                  </Button>
                </div>
              </div>
              <AppDataTable
                title={"Users"}
                description={"List of users"}
                headers={headers}
                rows={users}
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

                  fetchUsers({
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

export default Users;
