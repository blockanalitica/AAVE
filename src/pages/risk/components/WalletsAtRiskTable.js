import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Col, Row } from "reactstrap";
import Address from "../../../components/Address/Address.js";
import Card from "../../../components/Card/Card.js";
import Loader from "../../../components/Loader/Loader.js";
import RemoteTable from "../../../components/Table/RemoteTable.js";
import Value from "../../../components/Value/Value.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";

function WalletsAtRiskTable(props) {
  const pageSize = 25;
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState(null);
  const { data, isLoading, isPreviousData, isError, ErrorFallbackComponent } = useFetch(
    "aave/risk/wallets-at-risk",
    {
      p: page,
      p_size: pageSize,
      order,
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
          <Card title="Wallets at Risk">
            <RemoteTable
              loading={isPreviousData}
              keyField="address"
              hover={false}
              data={data.results}
              columns={[
                {
                  dataField: "address",
                  text: "Address",
                  sort: true,
                  formatter: (cell) => (
                    <Link to={`/wallets/${cell}/`} key={cell}>
                      <Address value={cell} />
                    </Link>
                  ),
                },
                {
                  dataField: "drop",
                  text: "Price drop",
                  sort: true,
                  formatter: (cell) => (
                    <Value value={cell * -100} decimals={0} suffix="%" />
                  ),
                },
                {
                  dataField: "collateral_amount",
                  text: "Collateral Amount",
                  sort: false,
                  formatter: (cell, row) => (
                    <Value
                      value={cell / row.collateral_price}
                      decimals={2}
                      suffix={" " + row.collateral_symbol}
                    />
                  ),
                },
                {
                  dataField: "collateral_amount",
                  text: " Collateral Amount USD",
                  sort: true,
                  formatter: (cell, row) => (
                    <Value value={cell} decimals={2} prefix="$" />
                  ),
                },
                {
                  dataField: "debt_amount",
                  text: "Debt Amount",
                  sort: true,
                  formatter: (cell, row) => (
                    <Value
                      value={cell / row.debt_price}
                      decimals={2}
                      suffix={" " + row.debt_symbol}
                    />
                  ),
                },
                {
                  dataField: "debt_amount",
                  text: "Debt Amount USD",
                  sort: true,
                  formatter: (cell, row) => (
                    <Value value={cell} decimals={2} prefix="$" />
                  ),
                },
              ]}
              page={page}
              pageSize={pageSize}
              totalPageSize={data.count}
              onSortChange={setOrder}
              onPageChange={setPage}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default withErrorBoundary(WalletsAtRiskTable);
