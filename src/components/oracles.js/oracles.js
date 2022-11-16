import paginationFactory from "react-bootstrap-table2-paginator";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "reactstrap";
import CryptoIcon from "../../components/CryptoIcon/CryptoIcon.js";
import DateTimeAgo from "../../components/DateTime/DateTimeAgo.js";
import Loader from "../../components/Loader/Loader.js";
import LinkTable from "../../components/Table/LinkTable.js";
import Value from "../../components/Value/Value.js";
import ValueChange from "../../components/Value/ValueChange.js";
import { withErrorBoundary } from "../../hoc.js";
import { useFetch, usePageTitle } from "../../hooks";
import { parseUTCDateTimestamp } from "../../utils/datetime.js";

function Ilks(props) {
  usePageTitle("Oracles");
  let navigate = useNavigate();
  const { data, isLoading, isError, ErrorFallbackComponent } =
    useFetch("aave/oracles/");

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const onRowClick = (row) => {
    navigate(`/oracles/${row.symbol}/`);
  };

  const assetsTable = (
    <Row>
      <h4>assets</h4>
      <Col className="mb-4">
        <LinkTable
          keyField="symbol"
          data={data}
          onRowClick={onRowClick}
          pagination={paginationFactory({
            sizePerPageList: [],
            sizePerPage: 15,
            showTotal: true,
          })}
          defaultSorted={[
            {
              dataField: "symbol",
              order: "asc",
            },
          ]}
          columns={[
            {
              dataField: "symbol",
              text: "Asset",
              sort: false,
              formatter: (cell, row) => (
                <>
                  <CryptoIcon className="me-2" name={row.symbol} size="1.5rem" />
                  {cell}
                </>
              ),
            },
            {
              dataField: "price_market",
              text: "Market price",
              formatter: (cell, row) => <Value value={cell} decimals={2} prefix="$" />,
              sort: true,
              headerAlign: "right",
              align: "right",
            },
            {
              dataField: "timestamp_market",
              text: "Last updated",
              sort: true,
              formatter: (cell, row) => (
                <DateTimeAgo dateTime={parseUTCDateTimestamp(cell)} />
              ),
              headerAlign: "right",
              align: "right",
            },

            {
              dataField: "price_ethereum",
              text: "Ethereum price",
              formatter: (cell, row) => (
                <>
                  <div className="text-nowrap">
                    <Value value={cell} decimals={2} prefix="$" />
                    <br />
                    <ValueChange
                      className="pl-2"
                      value={row.diff}
                      suffix="%"
                      hideIfZero
                      decimals={2}
                      icon
                    />
                  </div>
                </>
              ),
              sort: true,
              headerAlign: "right",
              align: "right",
            },
            {
              dataField: "timestamp_ethereum",
              text: "Last updated",
              sort: true,
              formatter: (cell, row) => (
                <DateTimeAgo dateTime={parseUTCDateTimestamp(cell)} />
              ),
              headerAlign: "right",
              align: "right",
            },
            {
              dataField: "price_optimism",
              text: "Optimism price",
              formatter: (cell, row) => <Value value={cell} decimals={2} prefix="$" />,
              sort: true,
              headerAlign: "right",
              align: "right",
            },
            {
              dataField: "timestamp_optimism",
              text: "Last updated",
              sort: true,
              formatter: (cell, row) => (
                <DateTimeAgo dateTime={parseUTCDateTimestamp(cell)} />
              ),
              headerAlign: "right",
              align: "right",
            },
          ]}
        />
      </Col>
    </Row>
  );

  return <>{assetsTable}</>;
}

export default withErrorBoundary(Ilks);
