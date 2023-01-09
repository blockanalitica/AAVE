import React, { useState } from "react";
import { UncontrolledTooltip } from "reactstrap";
import CryptoIcon from "../../../../components/CryptoIcon/CryptoIcon.js";
import Loader from "../../../../components/Loader/Loader.js";
import LinkTable from "../../../../components/Table/LinkTable.js";
import Value from "../../../../components/Value/Value.js";
import ValueChange from "../../../../components/Value/ValueChange.js";
import CurrencySwitch from "../../../../components/CurrencySwitch/CurrencySwitch.js";
import { withErrorBoundary } from "../../../../hoc.js";
import { useFetch, useSmartNavigate } from "../../../../hooks.js";

function WalletPositionsCard(props) {
  const { address } = props;
  const [isTokenCurrency, setIsTokenCurrency] = useState(false);
  const navigate = useSmartNavigate();
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `wallets/${address}/positions/`
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }
  const onRowClick = (row) => {
    navigate(`markets/${row.underlying_symbol}/`);
  };

  let columns;
  if (isTokenCurrency) {
    columns = [
      {
        dataField: "underlying_symbol",
        text: "",
        sort: false,
        formatter: (cell, row) => (
          <>
            <CryptoIcon
              className="me-4"
              name={row.underlying_symbol}
              size="2em"
              id={cell}
            />
            <UncontrolledTooltip placement="bottom" target={cell}>
              {cell}
              <br />
              <Value value={row.price} decimals={2} prefix="$" />
            </UncontrolledTooltip>
          </>
        ),
      },
      {
        dataField: "price",
        text: "price",
        sort: false,
        formatter: (cell, row) => <Value value={row.price} decimals={2} prefix="$" />,
        footer: () => {
          <></>;
        },
        headerAlign: "right",
        align: "right",
        footerAlign: "right",
      },
      {
        dataField: "supply",
        text: "Supply",
        sort: true,
        formatter: (cell, row) => (
          <Value value={cell} decimals={2} compact hideIfZero />
        ),
        headerAlign: "right",
        align: "right",
      },
      {
        dataField: "variable_borrow",
        text: "Variable Borrow",
        sort: true,
        formatter: (cell, row) => (
          <Value value={cell} decimals={2} compact hideIfZero />
        ),
        headerAlign: "right",
        align: "right",
      },
      {
        dataField: "stable_borrow",
        text: "Stable Borrow",
        sort: true,
        formatter: (cell, row) => (
          <Value value={cell} decimals={2} compact hideIfZero />
        ),
        headerAlign: "right",
        align: "right",
      },
      {
        dataField: "borrow",
        text: "Total Borrow",
        sort: true,
        formatter: (cell, row) => (
          <Value value={cell} decimals={2} compact hideIfZero />
        ),
        headerAlign: "right",
        align: "right",
      },
      {
        dataField: "account_liquidity",
        text: "Token liquidity",
        sort: true,
        formatter: (cell, row) => (
          <ValueChange value={cell} decimals={2} compact noPositive />
        ),
        headerAlign: "right",
        align: "right",
      },
      {
        dataField: "liquidation_buffer",
        text: "Token liquidation buffer",
        sort: true,
        formatter: (cell, row) => (
          <ValueChange value={cell} decimals={2} compact noPositive />
        ),
        headerAlign: "right",
        align: "right",
      },
      {
        dataField: "liquidation_threshold",
        text: "liquidation threshold",
        sort: false,
        formatter: (cell, row) => <Value value={cell * 100} decimals={2} suffix="%" />,
        footer: () => {
          <></>;
        },
        headerAlign: "right",
        align: "right",
        footerAlign: "right",
      },
      {
        dataField: "ltv",
        text: "ltv",
        sort: false,
        formatter: (cell, row) => <Value value={cell * 100} decimals={2} suffix="%" />,
        footer: () => {
          <></>;
        },
        headerAlign: "right",
        align: "right",
        footerAlign: "right",
      },
    ];
  } else {
    columns = [
      {
        dataField: "underlying_symbol",
        text: "",
        sort: false,
        formatter: (cell, row) => (
          <div className="text-nowrap">
            <CryptoIcon
              className="me-4"
              name={row.underlying_symbol}
              size="2em"
              id={cell}
            />
            {cell}
          </div>
        ),
        footer: () => {
          <></>;
        },
      },
      {
        dataField: "price",
        text: "price",
        sort: false,
        formatter: (cell, row) => <Value value={row.price} decimals={2} prefix="$" />,
        footer: () => {
          <></>;
        },
        headerAlign: "right",
        align: "right",
        footerAlign: "right",
      },

      {
        dataField: "supply_usd",
        text: "Supply",
        sort: true,
        formatter: (cell, row) => (
          <Value value={cell} decimals={2} prefix="$" compact />
        ),
        footer: (columnData) => {
          let sum = columnData.reduce((acc, item) => acc + item, 0);
          return <Value value={sum} decimals={2} prefix="$" compact />;
        },
        headerAlign: "right",
        align: "right",
        footerAlign: "right",
      },
      {
        dataField: "variable_borrow_usd",
        text: "Variable Borrow",
        sort: true,
        formatter: (cell, row) => (
          <Value value={cell} decimals={2} prefix="$" compact />
        ),
        footer: (columnData) => {
          let sum = columnData.reduce((acc, item) => acc + item, 0);
          return <Value value={sum} decimals={2} prefix="$" compact />;
        },
        headerAlign: "right",
        align: "right",
        footerAlign: "right",
      },
      {
        dataField: "stable_borrow_usd",
        text: "Stable Borrow",
        sort: true,
        formatter: (cell, row) => (
          <Value value={cell} decimals={2} prefix="$" compact />
        ),
        footer: (columnData) => {
          let sum = columnData.reduce((acc, item) => acc + item, 0);
          return <Value value={sum} decimals={2} prefix="$" compact />;
        },
        headerAlign: "right",
        align: "right",
        footerAlign: "right",
      },
      {
        dataField: "borrow_usd",
        text: "Total Borrow",
        sort: true,
        formatter: (cell, row) => (
          <Value value={cell} decimals={2} prefix="$" compact />
        ),
        footer: (columnData) => {
          let sum = columnData.reduce((acc, item) => acc + item, 0);
          return <Value value={sum} decimals={2} prefix="$" compact />;
        },
        headerAlign: "right",
        align: "right",
        footerAlign: "right",
      },
      {
        dataField: "account_liquidity_usd",
        text: "token liquidity",
        sort: true,
        formatter: (cell, row) => (
          <ValueChange value={cell} decimals={2} prefix="$" compact noPositive />
        ),
        footer: (columnData) => {
          let sum = columnData.reduce((acc, item) => acc + item, 0);
          return <ValueChange value={sum} decimals={2} prefix="$" compact noPositive />;
        },
        headerAlign: "right",
        align: "right",
        footerAlign: "right",
      },
      {
        dataField: "liquidation_buffer_usd",
        text: "token liquidation buffer",
        sort: true,
        formatter: (cell, row) => (
          <ValueChange value={cell} decimals={2} prefix="$" compact noPositive />
        ),
        footer: (columnData) => {
          let sum = columnData.reduce((acc, item) => acc + item, 0);
          return <ValueChange value={sum} decimals={2} prefix="$" compact noPositive />;
        },
        headerAlign: "right",
        align: "right",
        footerAlign: "right",
      },
      {
        dataField: "liquidation_threshold",
        text: "liquidation threshold",
        sort: false,
        formatter: (cell, row) => <Value value={cell * 100} decimals={2} suffix="%" />,
        footer: () => {
          <></>;
        },
        headerAlign: "right",
        align: "right",
        footerAlign: "right",
      },
      {
        dataField: "ltv",
        text: "ltv",
        sort: false,
        formatter: (cell, row) => <Value value={cell * 100} decimals={2} suffix="%" />,
        footer: () => {
          <></>;
        },
        headerAlign: "right",
        align: "right",
        footerAlign: "right",
      },
    ];
  }

  let content;
  if (data.length === 0) {
    content = (
      <div className="mb-4">
        <h4>positions</h4>
        <div>no current positions</div>
      </div>
    );
  } else {
    content = (
      <>
        <div className="mb-3 d-flex flex-direction-row align-items-center justify-content-between">
          <h4>positions</h4>
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
        <div>
          <LinkTable
            keyField="underlying_symbol"
            data={data}
            onRowClick={onRowClick}
            defaultSorted={[
              {
                dataField: "supply_usd",
                order: "desc",
              },
            ]}
            columns={columns}
          />
        </div>
      </>
    );
  }

  return content;
}

export default withErrorBoundary(WalletPositionsCard);
