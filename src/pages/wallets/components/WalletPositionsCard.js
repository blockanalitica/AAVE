import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UncontrolledTooltip } from "reactstrap";
import CryptoIcon from "../../../components/CryptoIcon/CryptoIcon.js";
import Loader from "../../../components/Loader/Loader.js";
import LinkTable from "../../../components/Table/LinkTable.js";
import Value from "../../../components/Value/Value.js";
import ValueChange from "../../../components/Value/ValueChange.js";
import CurrencySwitch from "../../../components/CurrencySwitch/CurrencySwitch.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";

function WalletPositionsCard(props) {
  const { address } = props;
  const [isTokenCurrency, setIsTokenCurrency] = useState(false);
  let navigate = useNavigate();
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `aave/wallets/${address}/positions/`
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }
  const onRowClick = (row) => {
    navigate(`/markets/${row.token_slug}/`);
  };

  let columns;
  if (isTokenCurrency) {
    columns = [
      {
        dataField: "token_slug",
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
        dataField: "borrow",
        text: "Borrow",
        sort: true,
        formatter: (cell, row) => (
          <Value value={cell} decimals={2} compact hideIfZero />
        ),
        headerAlign: "right",
        align: "right",
      },
      {
        dataField: "net_with_cf",
        text: "Token liquidity",
        sort: true,
        formatter: (cell, row) => (
          <ValueChange value={cell} decimals={2} compact noPositive />
        ),
        headerAlign: "right",
        align: "right",
      },
      {
        dataField: "net_with_lt",
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
        dataField: "collateral_factor",
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
        dataField: "token_slug",
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
            {cell}
          </>
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
        dataField: "borrow_usd",
        text: "Borrow",
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
        dataField: "net_with_cf_usd",
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
        dataField: "net_with_lt_usd",
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
        dataField: "collateral_factor",
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
      <>
        <h4>positions</h4>
        <div>no current positions</div>
      </>
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
            keyField="token_address"
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

  return (
    <>
      <div>{content}</div>
    </>
  );
}

export default withErrorBoundary(WalletPositionsCard);
