import React from "react";
import classnames from "classnames";
import { Badge } from "reactstrap";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { useNavigate } from "react-router-dom";
import Address from "../../components/Address/Address.js";
import SearchInput from "../../components/SearchInput/SearchInput.js";
import Loader from "../../components/Loader/Loader.js";
import RemoteTable from "../../components/Table/RemoteTable.js";
import Value from "../../components/Value/Value.js";
import ValueChange from "../../components/Value/ValueChange.js";
import { useFetch, usePageTitle, useQueryParams } from "../../hooks";
import DateTimeAgo from "../../components/DateTime/DateTimeAgo.js";
import { parseUTCDateTime } from "../../utils/datetime.js";
import AdditionalFilters from "./components/AdditionalFilters.js";
import makeBlockie from "ethereum-blockies-base64";
import styles from "./Wallets.module.scss";

function Wallets(props) {
  usePageTitle("Wallets");

  const navigate = useNavigate();
  const queryParams = useQueryParams();
  const pageSize = 25;
  const page = parseInt(queryParams.get("page")) || 1;
  const searchText = queryParams.get("search");
  const assets = queryParams.getAll("asset");

  const { data, isLoading, isPreviousData, isError, ErrorFallbackComponent } = useFetch(
    "aave/wallets/",
    {
      p: page,
      p_size: pageSize,
      order: queryParams.get("order") || "-borrow",
      search: searchText,
      asset: assets,
      non_insolvent: queryParams.get("non_insolvent"),
      supply_borrow: queryParams.get("supply_borrow"),
      no_dust: queryParams.get("no_dust"),
      risk: queryParams.get("risk"),
    },
    { keepPreviousData: true }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const { assets: allAssets } = data;

  const onRowClick = (row) => {
    navigate(`/wallets/${row.address}/`);
  };

  return (
    <>
      <h3 className="mb-4">wallets</h3>
      <p className="gray">
        List of open positions in the protocol. When liquidation buffer is lower than 0,
        the position can be liquidated.
      </p>
      <p className="gray">
        *drop: markets price drop for wallet to be liquidated. All assets fall for x% at
        the same time (excluding stable coins)
      </p>
      <ToolkitProvider
        bootstrap4
        search
        keyField="address"
        data={data.results}
        columns={[
          {
            dataField: "address",
            text: "",
            formatter: (cell, row) => {
              const blockie = makeBlockie(cell);
              return (
                <>
                  <img
                    className={classnames(
                      styles.roundedCircle,
                      styles.walletLogo,
                      "me-3"
                    )}
                    src={blockie}
                    alt={row.address}
                  />
                </>
              );
            },
          },
          {
            dataField: "supply",
            text: "Supply",
            sort: true,
            formatter: (cell, row) => (
              <Value
                value={cell}
                decimals={2}
                prefix="$"
                compact
                className={styles.bigText}
              />
            ),
            headerAlign: "right",
            align: "right",
          },
          {
            dataField: "borrow",
            text: "Borrow",
            sort: true,
            formatter: (cell, row) => (
              <Value
                value={cell}
                decimals={2}
                prefix="$"
                compact
                className={styles.bigText}
              />
            ),
            headerAlign: "right",
            align: "right",
          },
          {
            dataField: "net_with_cf",
            text: "Account liquidity",
            sort: true,
            formatter: (cell, row) => (
              <ValueChange value={cell} decimals={2} prefix="$" compact />
            ),
            headerAlign: "right",
            align: "right",
          },
          {
            dataField: "net_with_lt",
            text: "Liquidation Buffer",
            sort: true,
            formatter: (cell, row) => (
              <ValueChange value={cell} decimals={2} prefix="$" compact />
            ),
            headerAlign: "right",
            align: "right",
          },
          {
            dataField: "health_rate",
            text: "Health rate",
            sort: true,
            formatter: (cell, row) => <Value value={cell} decimals={2} />,
            headerAlign: "right",
            align: "right",
          },
          {
            dataField: "liquidation_drop",
            text: "Drop*",
            sort: true,
            formatter: (cell, row) => {
              if (cell === null) {
                return ">80%";
              } else {
                return <Value value={cell} decimals={2} suffix="%" />;
              }
            },
            headerAlign: "right",
            align: "right",
          },
          {
            dataField: "protection_score",
            text: "risk",
            sort: true,
            headerAlign: "center",
            align: "center",
            formatter: (cell, row) => {
              if (cell === "low") {
                return (
                  <Badge color="success" className="mr-1">
                    {cell} risk
                  </Badge>
                );
              } else if (cell === "medium") {
                return (
                  <Badge color="warning" className="mr-1">
                    {cell} risk
                  </Badge>
                );
              } else if (cell === "high") {
                return (
                  <Badge color="danger" className="mr-1">
                    {cell} risk
                  </Badge>
                );
              }
              return null;
            },
          },

          {
            dataField: "last_activity",
            text: "lastest activity",
            sort: true,
            formatter: (cell, row) => (
              <DateTimeAgo dateTime={parseUTCDateTime(cell)} inDays />
            ),
            headerAlign: "right",
            align: "right",
          },
          {
            dataField: "first_activity",
            text: "earliest activity",
            sort: true,
            formatter: (cell, row) => (
              <DateTimeAgo dateTime={parseUTCDateTime(cell)} inDays />
            ),
            headerAlign: "right",
            align: "right",
          },
          {
            dataField: "address",
            text: "Address",
            formatter: (cell, row) => row.ens || <Address value={cell} short />,
          },
        ]}
      >
        {(props) => (
          <div>
            <div className="d-flex flex-wrap">
              <div className="d-flex flex-grow-1 align-items-baseline mb-3">
                <AdditionalFilters assets={allAssets} />
              </div>
              <div className="react-bootstrap-table-search d-flex justify-content-end align-items-baseline mb-3">
                Search:
                <div className="ps-2">
                  <SearchInput
                    placeholder="wallet address"
                    initialSearchText={searchText}
                    {...props.searchProps}
                  />
                </div>
              </div>
            </div>
            <RemoteTable
              {...props.baseProps}
              loading={isPreviousData}
              onRowClick={onRowClick}
              page={page}
              pageSize={pageSize}
              totalPageSize={data.count}
              defaultSorted={[
                {
                  dataField: "borrow",
                  order: "desc",
                },
              ]}
            />
          </div>
        )}
      </ToolkitProvider>
    </>
  );
}

export default Wallets;
