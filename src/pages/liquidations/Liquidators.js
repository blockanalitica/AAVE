import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "reactstrap";
import paginationFactory from "react-bootstrap-table2-paginator";
import TimeSwitch from "../../components/TimeSwitch/TimeSwitch.js";
import Address from "../../components/Address/Address.js";
import Loader from "../../components/Loader/Loader.js";
import LinkTable from "../../components/Table/LinkTable.js";
import Value from "../../components/Value/Value.js";
import { withErrorBoundary } from "../../hoc.js";

import { useFetch, usePageTitle, useQueryParams } from "../../hooks";
import { parseUTCDateTime } from "../../utils/datetime.js";
import DateTimeAgo from "../../components/DateTime/DateTimeAgo.js";
import StatsBar from "../../components/Stats/StatsBar.js";

function Liquidators(props) {
  usePageTitle("Liquidators");
  const queryParams = useQueryParams();
  const queryDaysAgo = queryParams.get("daysAgo") || 30;
  const [daysAgo, setDaysAgo] = useState(queryDaysAgo);

  const timeOptions = [
    { key: 7, value: "7 days" },
    { key: 30, value: "30 days" },
    { key: 90, value: "90 days" },
    { key: 365, value: "1 year" },
    { key: 9999, value: "All" },
  ];
  let navigate = useNavigate();
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    "aave/liquidations/liquidators/",
    { days_ago: daysAgo }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }
  const { results, stats } = data;
  const onRowClick = (row) => {
    navigate(`/liquidations/liquidators/${row.liquidator}/?daysAgo=${daysAgo}`);
  };

  const statsCard = [
    {
      title: "Liquidations",
      bigValue: <Value value={stats.liquidations} decimals={0} />,
    },
    {
      title: "Debt repaid",
      bigValue: <Value value={stats.total_debt} decimals={2} prefix="$" compact />,
    },
    {
      title: "Collateral seized",
      bigValue: (
        <Value value={stats.total_collateral} decimals={2} prefix="$" compact />
      ),
    },
    {
      title: "Incentives",
      bigValue: <Value value={stats.total_profits} decimals={2} prefix="$" compact />,
    },
  ];

  const content = (
    <LinkTable
      bootstrap4
      hover
      keyField="liquidator"
      onRowClick={onRowClick}
      data={results}
      bordered={false}
      defaultSorted={[
        {
          dataField: "share",
          order: "desc",
        },
      ]}
      pagination={paginationFactory({
        sizePerPageList: [],
        sizePerPage: 15,
        showTotal: true,
      })}
      columns={[
        {
          dataField: "liquidator",
          text: "Liquidator",
          formatter: (cell) => {
            return (
              <>
                <Address value={cell} short />
              </>
            );
          },
        },
        {
          dataField: "liquidations",
          text: "Liquidations",
          sort: true,
        },
        {
          dataField: "total_debt",
          text: "Total Debt Repaid",
          sort: true,
          formatter: (cell) => <Value value={cell} decimals={2} prefix="$" compact />,
        },
        {
          dataField: "total_collateral",
          text: "Total Collateral Seized",
          sort: true,
          formatter: (cell) => <Value value={cell} decimals={2} prefix="$" compact />,
        },
        {
          dataField: "total_profits",
          text: "Total Profits",
          sort: true,
          formatter: (cell) => <Value value={cell} decimals={2} prefix="$" compact />,
        },
        {
          dataField: "share",
          text: "Share",
          sort: true,
          formatter: (cell) => <Value value={cell} decimals={2} suffix="%" />,
        },
        {
          dataField: "last_active",
          text: "Last Active",
          formatter: (cell, row) => <DateTimeAgo dateTime={parseUTCDateTime(cell)} />,
          sort: true,
        },
      ]}
    />
  );

  return (
    <>
      <div className="mb-4">
        <TimeSwitch
          className="mb-3 justify-content-end"
          activeOption={daysAgo}
          onChange={setDaysAgo}
          options={timeOptions}
        />
        <StatsBar stats={statsCard} />
      </div>
      <Row>
        <Col xl={12} className="mb-4">
          {content}
        </Col>
      </Row>
    </>
  );
}

export default withErrorBoundary(Liquidators);
