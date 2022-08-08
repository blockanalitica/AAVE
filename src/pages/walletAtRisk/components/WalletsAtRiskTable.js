import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Address from "../../../components/Address/Address.js";
import Loader from "../../../components/Loader/Loader.js";
import RemoteTable from "../../../components/Table/RemoteTable.js";
import Value from "../../../components/Value/Value.js";
import { useFetch } from "../../../hooks";

function WalletsAtRiskTable(props) {
  const { address, drop } = props;
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [drop]);

  let pageSize;
  if (address) {
    pageSize = 10;
  } else {
    pageSize = 50;
  }

  const { data, isLoading, isPreviousData, isError, ErrorFallbackComponent } = useFetch(
    "aave/risk/wallets-at-risk/",
    {
      drop,
      address,
      p: page,
      p_size: pageSize,
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
      {data.results.length > 0 ? (
        <RemoteTable
          loading={isPreviousData}
          keyField="id"
          hover={false}
          data={data.results}
          columns={[
            {
              dataField: "address",
              text: "Address",
              sort: false,
              formatter: (cell) => (
                <Link to={`/wallets/${cell}/`} key={cell}>
                  <Address value={cell} />
                </Link>
              ),
            },
            {
              dataField: "drop",
              text: "Price drop",
              sort: false,
              formatter: (cell) => (
                <Value value={cell * -100} decimals={0} suffix="%" />
              ),
            },
            {
              dataField: "ca",
              text: "Collateral Amount",
              sort: false,
              formatter: (cell, row) => (
                <Value
                  value={row.collateral_amount / row.collateral_price}
                  decimals={2}
                  suffix={" " + row.collateral_symbol}
                  compact100k
                />
              ),
            },
            {
              dataField: "collateral_amount",
              text: " Collateral Amount USD",
              sort: false,
              formatter: (cell) => (
                <Value value={cell} decimals={2} prefix="$" compact100k />
              ),
            },
            {
              dataField: "da",
              text: "Debt Amount",
              sort: false,
              formatter: (cell, row) => (
                <Value
                  value={row.debt_amount / row.debt_price}
                  decimals={2}
                  suffix={" " + row.debt_symbol}
                  compact100k
                />
              ),
            },
            {
              dataField: "debt_amount",
              text: "Debt Amount USD",
              sort: false,
              formatter: (cell) => (
                <Value value={cell} decimals={2} prefix="$" compact100k />
              ),
            },
          ]}
          page={page}
          pageSize={pageSize}
          totalPageSize={data.count}
          onPageChange={setPage}
        />
      ) : (
        <div className="text-center mt-4 gray">
          No wallets at risk of being liquidated at {drop}% general market price drop
        </div>
      )}
    </>
  );
}

export default WalletsAtRiskTable;
