import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "reactstrap";
import CurrencySwitch from "../../../components/CurrencySwitch/CurrencySwitch.js";
import CryptoIcon from "../../../components/CryptoIcon/CryptoIcon.js";
import Loader from "../../../components/Loader/Loader.js";
import paginationFactory from "react-bootstrap-table2-paginator";
import LinkTable from "../../../components/Table/LinkTable.js";
import Value from "../../../components/Value/Value.js";
import ValueChange from "../../../components/Value/ValueChange.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch, usePageTitle } from "../../../hooks";
import TimeSwitch from "../../../components/TimeSwitch/TimeSwitch.js";

function Markets(props) {
  usePageTitle("Markets");
  const navigate = useNavigate();
  const [timePeriod, setTimePeriod] = useState(1);
  const [isTokenCurrency, setIsTokenCurrency] = useState(false);
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch("markets/", {
    days_ago: timePeriod,
  });
  let fieldSuffix = "_usd";
  if (isTokenCurrency) {
    fieldSuffix = "";
  }
  let symbol = "token";

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const onRowClick = (row) => {
    navigate(`/v2/mainnet/markets/${row.symbol}/`);
  };

  return (
    <>
      <div className="mb-4 d-flex align-items-center">
        <h3 className="mb-4">markets</h3>
        <div className="mb-2 flex-grow-1 d-flex align-items-center justify-content-end">
          <TimeSwitch activeOption={timePeriod} label={""} onChange={setTimePeriod} />
        </div>
      </div>
      <div className="mb-2 flex-grow-1 d-flex align-items-right justify-content-end">
        <CurrencySwitch
          label="show amounts in:"
          options={[
            { key: "$", value: "$" },
            { key: symbol, value: symbol },
          ]}
          onChange={(option) => setIsTokenCurrency(option === symbol)}
        />
      </div>
      <Row className="mb-4">
        <Col>
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
                dataField: "tvl_usd",
                order: "desc",
              },
            ]}
            columns={[
              {
                dataField: "x",
                text: "",
                sort: false,
                formatter: (cell, row) => (
                  <CryptoIcon className="me-2" name={row.symbol} size="2rem" />
                ),
                footer: "",
              },
              {
                dataField: "symbol",
                text: "Market",
                sort: true,
                footer: "",
              },
              {
                dataField: "price",
                text: "Price",
                formatter: (cell, row) => (
                  <>
                    <Value value={cell} decimals={2} prefix="$" />
                    <br />
                    <ValueChange
                      value={cell - row["change"]["price"]}
                      decimals={2}
                      prefix={isTokenCurrency ? "" : "$"}
                      compact
                      icon
                      hideIfZero
                      tooltipValue={row["change"]["price"]}
                    />
                  </>
                ),
                headerAlign: "right",
                align: "right",
              },
              {
                dataField: `tvl${fieldSuffix}`,
                text: "TVL",
                sort: true,
                formatter: (cell, row) => (
                  <>
                    <Value
                      value={cell}
                      decimals={2}
                      prefix={isTokenCurrency ? "" : "$"}
                      compact
                    />
                    <br />
                    <ValueChange
                      value={cell - row["change"][`tvl${fieldSuffix}`]}
                      decimals={2}
                      prefix={isTokenCurrency ? "" : "$"}
                      compact
                      icon
                      hideIfZero
                      tooltipValue={row["change"]["tvl_usd"]}
                    />
                  </>
                ),
                headerAlign: "right",
                align: "right",
              },
              {
                dataField: `total_supply${fieldSuffix}`,
                text: "Supply",
                sort: true,
                formatter: (cell, row) => (
                  <>
                    <Value
                      value={cell}
                      decimals={2}
                      prefix={isTokenCurrency ? "" : "$"}
                      compact
                    />
                    <br />
                    <ValueChange
                      value={cell - row["change"][`total_supply${fieldSuffix}`]}
                      decimals={2}
                      prefix={isTokenCurrency ? "" : "$"}
                      compact
                      icon
                      hideIfZero
                      tooltipValue={row["change"]["total_supply_usd"]}
                    />
                  </>
                ),
                headerAlign: "right",
                align: "right",
              },
              {
                dataField: `total_borrow${fieldSuffix}`,
                text: "Borrow",
                sort: true,
                formatter: (cell, row) => (
                  <>
                    <Value
                      value={cell}
                      decimals={2}
                      prefix={isTokenCurrency ? "" : "$"}
                      compact
                    />
                    <br />
                    <ValueChange
                      value={cell - row["change"][`total_borrow${fieldSuffix}`]}
                      decimals={2}
                      prefix={isTokenCurrency ? "" : "$"}
                      compact
                      icon
                      hideIfZero
                      tooltipValue={row["change"]["total_borrow_usd"]}
                    />
                  </>
                ),
                headerAlign: "right",
                align: "right",
              },
              {
                dataField: "supply_apy",
                text: "Supply APY",
                sort: true,
                formatter: (cell, row) => (
                  <>
                    <Value value={cell * 100} decimals={2} suffix="%" />
                    <br />
                    <ValueChange
                      value={(cell - row["change"]["supply_apy"]) * 100}
                      decimals={2}
                      suffix="%"
                      icon
                      hideIfZero
                      tooltipValue={row["change"]["supply_apy"] * 100}
                    />
                  </>
                ),
                headerAlign: "right",
                align: "right",
              },
              {
                dataField: "borrow_variable_apy",
                text: "Borrow APY",
                sort: true,
                formatter: (cell, row) => (
                  <>
                    <Value value={cell * 100} decimals={2} suffix="%" />
                    <br />
                    <ValueChange
                      value={(cell - row["change"]["borrow_variable_apy"]) * 100}
                      decimals={2}
                      suffix="%"
                      icon
                      reverse
                      hideIfZero
                      tooltipValue={row["change"]["borrow_variable_apy"] * 100}
                    />
                  </>
                ),
                headerAlign: "right",
                align: "right",
              },
              {
                dataField: "borrow_stable_apy",
                text: "Stable Borrow APY",
                sort: true,
                formatter: (cell, row) => (
                  <>
                    <Value value={cell * 100} decimals={2} suffix="%" hideIfZero />
                    <br />
                    <ValueChange
                      value={(cell - row["change"]["borrow_stable_apy"]) * 100}
                      decimals={2}
                      suffix="%"
                      icon
                      reverse
                      hideIfZero
                      tooltipValue={row["change"]["borrow_stable_apy"] * 100}
                    />
                  </>
                ),
                headerAlign: "right",
                align: "right",
              },
            ]}
          />
        </Col>
      </Row>
    </>
  );
}

export default withErrorBoundary(Markets);
