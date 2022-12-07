import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Col, Row } from "reactstrap";
import CryptoIcon from "../../../../components/CryptoIcon/CryptoIcon.js";
import Loader from "../../../../components/Loader/Loader.js";
import LinkTable from "../../../../components/Table/LinkTable.js";
import Value from "../../../../components/Value/Value.js";
import ValueChange from "../../../../components/Value/ValueChange.js";
import { withErrorBoundary } from "../../../../hoc.js";
import { useFetch } from "../../../../hooks";
import { Link } from "react-router-dom";

function Homepage(props) {
  const { daysAgo } = props;
  const navigate = useNavigate();
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    "aave/tokens/short/",
    { days_ago: daysAgo }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const { results } = data;

  const onRowClick = (row) => {
    navigate(`markets/${row.slug}/`);
  };

  return (
    <>
      <Row className="mb-4">
        <Col>
          <LinkTable
            keyField="address"
            data={results}
            onRowClick={onRowClick}
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
                  <CryptoIcon
                    className="me-2"
                    name={row.underlying_symbol}
                    size="2rem"
                  />
                ),
                footer: "",
              },
              {
                dataField: "underlying_symbol",
                text: "Market",
                sort: true,
                footer: "",
              },
              {
                dataField: "underlying_price",
                text: "Price",
                formatter: (cell, row) => (
                  <>
                    <Value value={cell} decimals={2} prefix="$" />
                    <br />
                    <ValueChange
                      value={cell - row["change"]["underlying_price"]}
                      decimals={2}
                      prefix="$"
                      compact
                      icon
                      hideIfZero
                      tooltipValue={row["change"]["underlying_price"]}
                    />
                  </>
                ),
                headerAlign: "right",
                align: "right",
              },
              {
                dataField: "tvl_usd",
                text: "TVL",
                sort: true,
                formatter: (cell, row) => (
                  <>
                    <Value value={cell} decimals={2} prefix="$" compact />
                    <br />
                    <ValueChange
                      value={cell - row["change"]["tvl_usd"]}
                      decimals={2}
                      prefix="$"
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
                dataField: "total_supply_usd",
                text: "Supply",
                sort: true,
                formatter: (cell, row) => (
                  <>
                    <Value value={cell} decimals={2} prefix="$" compact />
                    <br />
                    <ValueChange
                      value={cell - row["change"]["total_supply_usd"]}
                      decimals={2}
                      prefix="$"
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
                dataField: "total_borrow_usd",
                text: "Borrow",
                sort: true,
                formatter: (cell, row) => (
                  <>
                    <Value value={cell} decimals={2} prefix="$" compact />
                    <br />
                    <ValueChange
                      value={cell - row["change"]["total_borrow_usd"]}
                      decimals={2}
                      prefix="$"
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
      <Row className="mb-4">
        <Col>
          <div className="text-center mb-4">
            <Link to={`/markets/`} key="markets">
              <Button color="primary">see all markets</Button>
            </Link>
          </div>
        </Col>
      </Row>
    </>
  );
}

export default withErrorBoundary(Homepage);
