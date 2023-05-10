import React, { useState, useEffect } from "react";
import { InlineLoading, InlineNotification } from "@carbon/react";
import {
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Sector,
} from "recharts";

import loanService from "../../../../../../modules/loan/loan.service";

import { delay, getMessageFromAxiosError, formatCurrency } from "../../../../../../utils";

const TotalByTypesPieChart = () => {
  const [totalByTypes, setTotalByTypes] = useState([]);
  const [totalByTypesLoading, setTotalByTypesLoading] = useState(false);
  const [totalByTypesError, setTotalByTypesError] = useState(undefined);

  const [activeIndex, setActiveIndex] = useState(0);

  const COLORS = ["yellow", "orange", "red", "green"];

  const getTotalByTypesChartItems = (items) => {
    return items.map((item) => {
      return {
        ...item,
      };
    });
  };

  const fetchTotalByTypes = async () => {
    setTotalByTypesLoading(true);

    try {
      const [data] = await Promise.all([
        loanService.getTotalByTypes(),
        delay(),
      ]);

      setTotalByTypes(getTotalByTypesChartItems(data));
    } catch (error) {
      setTotalByTypesError(getMessageFromAxiosError(error));
    }

    setTotalByTypesLoading(false);
  };

  useEffect(() => {
    fetchTotalByTypes();
  }, []);

  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
        >
          {`${formatCurrency(value)}`}
        </text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="#999"
        >
          {`(${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      {totalByTypesLoading && (
        <InlineLoading
          status="active"
          description="Cargando..."
          className="screen__center_loading"
        />
      )}
      {totalByTypesError && (
        <div className="screen__notification_container">
          <InlineNotification
            kind="error"
            subtitle={<span>{totalByTypesError}</span>}
            title="Uups!"
            onClose={() => setTotalByTypesError(undefined)}
          />
        </div>
      )}
      {!totalByTypesLoading && !totalByTypesError && totalByTypes && (
        <>
          <div className="cds--row">
            <div className="cds--col">
              <p className="screen__label screen__text--center">
                Totales por tipo:
              </p>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart width={500} height={300}>
                  <Legend
                    layout="horizontal"
                    verticalAlign="top"
                    align="center"
                    payload={[
                      {
                        value: "Prestamo",
                        color: COLORS[0],
                      },
                      {
                        value: "Interes",
                        color: COLORS[1],
                      },
                      {
                        value: "Interes mora",
                        color: COLORS[2],
                      },
                      {
                        value: "Pago",
                        color: COLORS[3],
                      },
                    ]}
                  />
                  <Pie
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={totalByTypes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="total"
                    onClick={(_, index) => setActiveIndex(index)}
                  >
                    {totalByTypes.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TotalByTypesPieChart;
