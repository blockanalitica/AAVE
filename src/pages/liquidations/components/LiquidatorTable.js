import React, { useState } from "react";
import { Col, Row } from "reactstrap";

import EtherscanShort from "../../../components/EtherscanShort/EtherscanShort.js";
import Loader from "../../../components/Loader/Loader.js";
import RemoteTable from "../../../components/Table/RemoteTable.js";
import WalletOrZapper from "../../../components/Other/WalletOrZapper.js";
import Value from "../../../components/Value/Value.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";
import { parseUTCDateTime } from "../../../utils/datetime.js";
import DateTimeAgo from "../../../components/DateTime/DateTimeAgo.js";

function LiquidatorTable(props) {
  const { address, daysAgo } = props;
  const pageSize = 25;
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState(null);

  const { data, isLoading, isPreviousData, isError, ErrorFallbackComponent } = useFetch(
    `aave/liquidations/liquidator/${address}`,
    {
      address,
      p: page,
      p_size: pageSize,
      order,
      days_ago: daysAgo,
    },
    { keepPreviousData: true }
  );
  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  return (
    <>
      <Row>
        <Col className="mb-4">
          <RemoteTable
            loading={isPreviousData}
            hover={false}
            keyField="id"
            data={data.results}
            columns={[
              {
                dataField: "timestamp",
                text: "Date",
                formatter: (cell, row) => (
                  <DateTimeAgo dateTime={parseUTCDateTime(cell)} />
                ),
                sort: true,
              },
              {
                dataField: "block_number",
                text: "Block Number",
                sort: true,
              },
              {
                dataField: "tx_hash",
                text: "Tx Hash",
                formatter: (cell) => <EtherscanShort address={cell} type="txhash" />,
              },
              {
                dataField: "debt_owner",
                text: "Debt Owner",
                formatter: (cell, row) => {
                  return (
                    <WalletOrZapper
                      address={cell}
                      isZapper={!row.debt_wallet}
                      key={cell}
                    />
                  );
                },
              },
              {
                dataField: "debt_token_price",
                text: "Debt Token Price",
                formatter: (cell) => <Value value={cell} decimals={2} prefix="$" />,
              },
              {
                dataField: "debt_repaid",
                text: "Debt Repaid",
                formatter: (cell, row) => (
                  <>
                    <Value value={cell} decimals={2} compact /> {row.debt_symbol}
                  </>
                ),
              },
              {
                dataField: "debt_repaid_usd",
                text: "Debt Repaid USD",
                sort: true,
                formatter: (cell) => (
                  <Value value={cell} decimals={2} prefix="$" compact />
                ),
              },
              {
                dataField: "collateral_token_price",
                text: "Collateral Token Price",
                formatter: (cell) => <Value value={cell} decimals={2} prefix="$" />,
              },
              {
                dataField: "collateral_seized",
                text: "Collateral Seized",
                formatter: (cell, row) => (
                  <>
                    <Value value={cell} decimals={2} compact /> {row.collateral_symbol}
                  </>
                ),
              },
              {
                dataField: "collateral_seized_usd",
                text: "Collateral Seized USD",
                sort: true,
                formatter: (cell) => (
                  <Value value={cell} decimals={2} prefix="$" compact />
                ),
              },
            ]}
            page={page}
            pageSize={pageSize}
            totalPageSize={data.count}
            onSortChange={setOrder}
            onPageChange={setPage}
          />
        </Col>
      </Row>
    </>
  );
}

export default withErrorBoundary(LiquidatorTable);
