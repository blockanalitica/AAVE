import React, { useState } from "react";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { useParams } from "react-router-dom";
import { Col, Row } from "reactstrap";
import makeBlockie from "ethereum-blockies-base64";
import classnames from "classnames";
import Address from "../../../components/Address/Address.js";
import Loader from "../../../components/Loader/Loader.js";
import RemoteTable from "../../../components/Table/RemoteTable.js";
import TimeSwitch from "../../../components/TimeSwitch/TimeSwitch.js";
import SearchInput from "../../../components/SearchInput/SearchInput.js";
import Value from "../../../components/Value/Value.js";
import ValueChange from "../../../components/Value/ValueChange.js";
import CurrencySwitch from "../../../components/CurrencySwitch/CurrencySwitch.js";
import EventStatsChart from "./components/EventStatsChart.js";
import { withErrorBoundary } from "../../../hoc.js";
import {
  useFetch,
  usePageTitle,
  useQueryParams,
  useSmartNavigate,
} from "../../../hooks";
import styles from "./MarketWallets.module.scss";

function MarketWallets(props) {
  const navigate = useSmartNavigate();
  const { symbol } = useParams();
  const queryParams = useQueryParams();
  usePageTitle(`${symbol} Wallet Positions`);
  const pageSize = 25;

  const page = parseInt(queryParams.get("page")) || 1;
  const searchText = queryParams.get("search");
  const [isTokenCurrency, setIsTokenCurrency] = useState(false);
  const [timePeriod, setTimePeriod] = useState(7);

  const { data, isLoading, isPreviousData, isError, ErrorFallbackComponent } = useFetch(
    `markets/${symbol}/wallets/`,
    {
      p: page,
      p_size: pageSize,
      order: queryParams.get("order"),
      search: searchText,
      days_ago: timePeriod,
    },
    { keepPreviousData: true }
  );
  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const onRowClick = (row) => {
    navigate(`wallets/${row.address}/`);
  };

  const priceFormatter = (cell, row) => (
    <Value
      value={cell}
      decimals={2}
      prefix={isTokenCurrency ? "" : "$"}
      compact
      className={styles.bigText}
    />
  );

  const priceChangeFormatter = (cell, row) => (
    <ValueChange
      value={cell}
      decimals={2}
      prefix={isTokenCurrency ? "" : "$"}
      compact
      hideIfZero
    />
  );

  // The formatExtraData: { timePeriod } is set per column so that
  // it invalidates the column cache, otherwise it won't render correct values on change

  let fieldSuffix = "_usd";
  if (isTokenCurrency) {
    fieldSuffix = "";
  }

  const columns = [
    {
      dataField: "",
      text: "",
      formatter: (_, row) => {
        const blockie = makeBlockie(row.address);
        return (
          <>
            <img
              className={classnames(styles.roundedCircle, styles.walletLogo, "me-3")}
              src={blockie}
              alt={row.address}
            />
          </>
        );
      },
    },

    {
      dataField: `supply${fieldSuffix}`,
      text: "Supply",
      sort: true,
      formatter: priceFormatter,
      headerAlign: "right",
      align: "right",
    },
    {
      dataField: `supply_change_${timePeriod}d${fieldSuffix}`,
      text: "Supply Change",
      sort: true,
      formatExtraData: { timePeriod },
      formatter: priceChangeFormatter,
      headerAlign: "right",
      align: "right",
    },
    {
      dataField: `borrow${fieldSuffix}`,
      text: "Borrow",
      sort: true,
      formatter: priceFormatter,
      headerAlign: "right",
      align: "right",
    },
    {
      dataField: `borrow_change_${timePeriod}d${fieldSuffix}`,
      text: "Borrow Change",
      sort: true,
      formatExtraData: { timePeriod },
      formatter: priceChangeFormatter,
      headerAlign: "right",
      align: "right",
    },
    {
      dataField: `account_liquidity${fieldSuffix}`,
      text: "token liquidity",
      sort: true,

      formatter: priceChangeFormatter,
      headerAlign: "right",
      align: "right",
    },
    {
      dataField: "address",
      text: "Wallet Address",
      formatter: (cell, row) => <Address value={cell} short />,
    },
  ];

  return (
    <>
      <h1 className="h3 mb-4">{symbol} positions</h1>
      <Row className="mb-3">
        <Col lg={6} className="d-flex react-bootstrap-table-filter align-items-center">
          <CurrencySwitch
            label="show amounts in:"
            options={[
              { key: "$", value: "$" },
              { key: symbol, value: symbol },
            ]}
            onChange={(option) => setIsTokenCurrency(option === symbol)}
          />
        </Col>
        <Col
          lg={6}
          className="d-flex react-bootstrap-table-filter align-items-center justify-content-end"
        >
          <TimeSwitch activeOption={timePeriod} onChange={setTimePeriod} />
        </Col>
      </Row>

      <EventStatsChart
        className="mb-4"
        symbol={symbol}
        timePeriod={timePeriod}
        isTokenCurrency={isTokenCurrency}
      />

      <ToolkitProvider
        bootstrap4
        search
        keyField="address"
        data={data.results}
        columns={columns}
      >
        {(props) => (
          <div>
            <Row>
              <Col
                lg={12}
                className="d-flex react-bootstrap-table-filter align-items-baseline justify-content-end mb-3"
              >
                <div className="text-content">Search:</div>
                <div className="ps-2">
                  <SearchInput
                    initialSearchText={searchText}
                    placeholder="address"
                    {...props.searchProps}
                  />
                </div>
              </Col>
            </Row>
            <RemoteTable
              {...props.baseProps}
              loading={isPreviousData}
              onRowClick={onRowClick}
              page={page}
              pageSize={pageSize}
              totalPageSize={data.count}
            />
          </div>
        )}
      </ToolkitProvider>
    </>
  );
}

export default withErrorBoundary(MarketWallets);
