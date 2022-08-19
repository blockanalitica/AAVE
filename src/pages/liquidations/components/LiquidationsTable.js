import CurrencySwitch from "../../../components/CurrencySwitch/CurrencySwitch.js";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Address from "../../../components/Address/Address.js";
import EtherscanShort from "../../../components/EtherscanShort/EtherscanShort.js";
import Loader from "../../../components/Loader/Loader.js";
import RemoteTable from "../../../components/Table/RemoteTable.js";
import Value from "../../../components/Value/Value.js";
import { UncontrolledTooltip } from "reactstrap";
import WalletOrZapper from "../../../components/Other/WalletOrZapper.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";
import { useNavigate } from "react-router-dom";
import { parseUTCDateTime } from "../../../utils/datetime.js";
import DateTimeAgo from "../../../components/DateTime/DateTimeAgo.js";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CryptoIcon from "../../../components/CryptoIcon/CryptoIcon.js";
import styles from "./LiquidationsTable.module.scss";
import _ from "lodash";

function LiquidationsTable(props) {
  const navigate = useNavigate();
  const pageSize = 10;
  const { daysAgo } = props;
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState(null);
  const [isTokenCurrency, setIsTokenCurrency] = useState(false);

  const { data, isLoading, isPreviousData, isError, ErrorFallbackComponent } = useFetch(
    "aave/liquidations/",
    {
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

  const uniqueId = () => {
    return _.uniqueId("amount-");
  };

  const onRowClick = (row) => {
    navigate(`/wallets/${row.debt_wallet}/`);
  };

  return (
    <>
      <div className="mb-3 d-flex flex-direction-row align-items-center justify-content-end">
        <small>
          <CurrencySwitch
            label="show amounts in:"
            options={[
              { key: "USD", value: "$" },
              { key: "token", value: "Token" },
            ]}
            onChange={(option) => setIsTokenCurrency(option === "token")}
          />
        </small>
      </div>
      <RemoteTable
        loading={isPreviousData}
        keyField="id"
        onRowClick={onRowClick}
        data={data.results}
        columns={[
          {
            dataField: "collateral_symbol",
            text: "token",
            formatter: (cell, row) => {
              let collId = uniqueId();
              let debtId = uniqueId();
              return (
                <span className={styles.liquidationIcons}>
                  <CryptoIcon name={row.debt_symbol} size="2em" id={debtId} />
                  <UncontrolledTooltip placement="bottom" target={debtId}>
                    {row.debt_symbol}
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
            formatExtraData: { isTokenCurrency },
            headerAlign: "right",
            align: "right",
            formatter: (cell, row) => (
              <Value
                value={isTokenCurrency ? cell : row.debt_repaid_usd}
                decimals={isTokenCurrency ? 3 : 2}
                prefix={isTokenCurrency ? "" : "$"}
                suffix={isTokenCurrency ? " " + row.debt_symbol : ""}
                compact
                hideIfZero
              />
            ),
          },
          {
            dataField: "collateral_seized",
            text: "Collateral Seized",
            formatExtraData: { isTokenCurrency },
            headerAlign: "right",
            align: "right",
            formatter: (cell, row) => (
              <Value
                value={isTokenCurrency ? cell : row.collateral_seized_usd}
                decimals={isTokenCurrency ? 3 : 2}
                prefix={isTokenCurrency ? "" : "$"}
                suffix={isTokenCurrency ? " " + row.collateral_symbol : ""}
                compact
                hideIfZero
              />
            ),
          },
          {
            dataField: "tx_hash",
            text: "Tx Hash",
            headerAlign: "center",
            align: "center",
            formatter: (cell) => <EtherscanShort address={cell} type="txhash" />,
          },
          {
            dataField: "debt_owner",
            text: "Debt Owner",
            headerAlign: "center",
            align: "center",
            formatter: (cell, row) => (
              <WalletOrZapper address={cell} isZapper={!row.debt_wallet} key={cell} />
            ),
          },
          {
            dataField: "liquidator",
            text: "Liquidator",
            headerAlign: "center",
            align: "center",
            formatter: (cell) => (
              <Link to={`/liquidations/liquidator/${cell}/`} key={cell}>
                <Address value={cell} short />
              </Link>
            ),
          },
          {
            dataField: "timestamp",
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
    </>
  );
}

export default withErrorBoundary(LiquidationsTable);
