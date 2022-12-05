import _ from "lodash";
import React, { useState } from "react";
import { Col, Row } from "reactstrap";

import EtherscanShort from "../../../../components/EtherscanShort/EtherscanShort.js";
import Loader from "../../../../components/Loader/Loader.js";
import RemoteTable from "../../../../components/Table/RemoteTable.js";
import Value from "../../../../components/Value/Value.js";
import { withErrorBoundary } from "../../../../hoc.js";
import { useFetch, useSmartNavigate } from "../../../../hooks";
import { parseUTCDateTime } from "../../../../utils/datetime.js";
import DateTimeAgo from "../../../../components/DateTime/DateTimeAgo.js";
import { UncontrolledTooltip } from "reactstrap";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CryptoIcon from "../../../../components/CryptoIcon/CryptoIcon.js";
import styles from "./LiquidationsTable.module.scss";

function LiquidatorTable(props) {
  const { address, daysAgo } = props;
  const pageSize = 25;
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState(null);
  const navigate = useSmartNavigate();
  const { data, isLoading, isPreviousData, isError, ErrorFallbackComponent } = useFetch(
    `liquidations/liquidator/${address}`,
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
  //use smart
  const uniqueId = () => {
    return _.uniqueId("amount-");
  };

  const onRowClick = (row) => {
    navigate(`wallets/${row.wallet_address}/`);
  };

  return (
    <>
      <Row>
        <Col className="mb-4">
          <RemoteTable
            loading={isPreviousData}
            onRowClick={onRowClick}
            keyField="id"
            data={data.results}
            columns={[
              {
                dataField: "collateral_underlying_symbol",
                text: "token",
                formatter: (cell, row) => {
                  let collId = uniqueId();
                  let debtId = uniqueId();
                  return (
                    <span className={styles.liquidationIcons}>
                      <CryptoIcon
                        name={row.debt_underlying_symbol}
                        size="2em"
                        id={debtId}
                      />
                      <UncontrolledTooltip placement="bottom" target={debtId}>
                        {row.debt_underlying_symbol}
                      </UncontrolledTooltip>
                      <FontAwesomeIcon icon={faArrowRight} />
                      <CryptoIcon name={cell} size="2em" id={collId} />
                      <UncontrolledTooltip placement="bottom" target={collId}>
                        {cell}
                      </UncontrolledTooltip>
                    </span>
                  );
                },
              },
              {
                dataField: "debt_repaid",
                text: "Debt Repaid",
                formatter: (cell, row) => (
                  <>
                    <Value value={cell} decimals={2} compact /> {row.debt_symbol}
                  </>
                ),
                headerAlign: "right",
                align: "right",
              },
              {
                dataField: "debt_repaid_usd",
                text: "Debt Repaid USD",
                sort: true,
                formatter: (cell) => (
                  <Value value={cell} decimals={2} prefix="$" compact />
                ),
                headerAlign: "right",
                align: "right",
              },
              {
                dataField: "collateral_seized",
                text: "Collateral Seized",
                formatter: (cell, row) => (
                  <>
                    <Value value={cell} decimals={2} compact /> {row.collateral_symbol}
                  </>
                ),
                headerAlign: "right",
                align: "right",
              },
              {
                dataField: "collateral_seized_usd",
                text: "Collateral Seized USD",
                sort: true,
                formatter: (cell) => (
                  <Value value={cell} decimals={2} prefix="$" compact />
                ),
                headerAlign: "right",
                align: "right",
              },
              {
                dataField: "tx_hash",
                text: "Tx Hash",
                formatter: (cell) => <EtherscanShort address={cell} type="txhash" />,
              },

              {
                dataField: "datetime",
                text: "Date",
                sort: true,
                formatter: (cell, row) => (
                  <>
                    <DateTimeAgo dateTime={parseUTCDateTime(cell)} />
                    <br />
                    <small>{row.block_number}</small>
                  </>
                ),
                headerAlign: "right",
                align: "right",
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
