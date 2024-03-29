import React, { useState } from "react";
import paginationFactory from "react-bootstrap-table2-paginator";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "reactstrap";
import CryptoIcon from "../../../components/CryptoIcon/CryptoIcon.js";
import CurrencySwitch from "../../../components/CurrencySwitch/CurrencySwitch.js";
import Loader from "../../../components/Loader/Loader.js";
import LinkTable from "../../../components/Table/LinkTable.js";
import TimeSwitch from "../../../components/TimeSwitch/TimeSwitch.js";
import Value from "../../../components/Value/Value.js";
import ValueChange from "../../../components/Value/ValueChange.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch, usePageTitle } from "../../../hooks";

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

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }
  let options = [
    { key: 1, value: "1 day" },
    { key: 7, value: "7 days" },
    { key: 30, value: "30 days" },
    { key: 90, value: "90 days" },
  ];

  const onRowClick = (row) => {
    navigate(`${row.symbol}/`);
  };

  return (
    <>
      <div className="mb-4 d-flex align-items-center">
        <h3 className="mb-4">markets</h3>
      </div>
      <div className="d-flex flex-direction-row justify-content-between mt-4">
        <CurrencySwitch
          label="show amounts in:"
          options={[
            { key: "$", value: "$" },
            { key: "token", value: "token" },
          ]}
          onChange={(option) => setIsTokenCurrency(option === "token")}
        />

        <div className="mb-2 flex-grow-1 d-flex align-items-right justify-content-end">
          <TimeSwitch
            activeOption={timePeriod}
            label={""}
            onChange={setTimePeriod}
            options={options}
          />
        </div>
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
                dataField: "total_supply_usd",
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
                sort: true,
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
                dataField: `total_supply${fieldSuffix}`,
                text: "Supply",
                sort: true,
                formatExtraData: { isTokenCurrency },
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
                      tooltipValue={row["change"][`total_supply${fieldSuffix}`]}
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
                formatExtraData: { isTokenCurrency },
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
                      tooltipValue={row["change"][`total_borrow${fieldSuffix}`]}
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
                formatExtraData: { isTokenCurrency },
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
                      tooltipValue={row["change"][`tvl${fieldSuffix}`]}
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
