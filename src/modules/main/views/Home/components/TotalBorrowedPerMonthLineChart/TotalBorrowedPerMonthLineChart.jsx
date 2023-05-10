import React, { useState, useEffect } from "react";
import { InlineLoading, InlineNotification } from "@carbon/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import loanService from "../../../../../../modules/loan/loan.service";

import {
  delay,
  getMessageFromAxiosError,
  formatCurrency,
  monthNumberToMonthName,
} from "../../../../../../utils";

const TotalBorrowedPerMonthLineChart = () => {
  const [totalBorrowedPerMonth, setTotalBorrowedPerMonth] = useState([]);
  const [totalBorrowedPerMonthLoading, setTotalBorrowedPerMonthLoading] =
    useState(false);
  const [totalBorrowedPerMonthError, setTotalBorrowedPerMonthError] =
    useState(undefined);

  const getLoanAmountsChartItems = (items) => {
    return items.map((item) => {
      return {
        month:
          monthNumberToMonthName(item.month) +
          " - " +
          (item.year + "").slice(2),
        Monto: item.amount,
      };
    });
  };

  const fetchTotalBorrowedPerMonth = async () => {
    setTotalBorrowedPerMonthLoading(true);

    try {
      const [data] = await Promise.all([
        loanService.getTotalBorrowedPerMonth(),
        delay(),
      ]);

      setTotalBorrowedPerMonth(getLoanAmountsChartItems(data));
    } catch (error) {
      setTotalBorrowedPerMonthError(getMessageFromAxiosError(error));
    }

    setTotalBorrowedPerMonthLoading(false);
  };

  useEffect(() => {
    fetchTotalBorrowedPerMonth();
  }, []);

  return (
    <div style={{ marginBottom: "1rem" }}>
      {totalBorrowedPerMonthLoading && (
        <InlineLoading
          status="active"
          description="Cargando..."
          className="screen__center_loading"
        />
      )}
      {totalBorrowedPerMonthError && (
        <div
          style={{ marginBottom: "1rem" }}
          className="screen__notification_container"
        >
          <InlineNotification
            kind="error"
            subtitle={<span>{totalBorrowedPerMonthError}</span>}
            title="Uups!"
            onClose={() => setTotalBorrowedPerMonthError(undefined)}
          />
        </div>
      )}
      {!totalBorrowedPerMonthLoading &&
        !totalBorrowedPerMonthError &&
        totalBorrowedPerMonth && (
          <>
            <div style={{ marginBottom: "1rem" }}>
              <div className="cds--row">
                <div className="cds--col">
                  <p className="screen__label screen__text--center">
                    Prestado por mes:
                  </p>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      width={500}
                      height={300}
                      data={totalBorrowedPerMonth}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis
                        tickFormatter={(value) =>
                          new Intl.NumberFormat("es-CO", {
                            notation: "compact",
                            compactDisplay: "short",
                          }).format(value)
                        }
                      />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="Monto"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}
    </div>
  );
};

export default TotalBorrowedPerMonthLineChart;
