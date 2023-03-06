import React, { useState } from "react";
import { UncontrolledTooltip } from "reactstrap";
import _ from "lodash";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EtherscanShort from "../../../../components/EtherscanShort/EtherscanShort.js";
import Loader from "../../../../components/Loader/Loader.js";
import RemoteTable from "../../../../components/Table/RemoteTable.js";
import ValueChange from "../../../../components/Value/ValueChange.js";
import { withErrorBoundary } from "../../../../hoc.js";
import { useFetch } from "../../../../hooks";
import CryptoIcon from "../../../../components/CryptoIcon/CryptoIcon.js";
import { parseUTCDateTimestamp } from "../../../../utils/datetime.js";
import DateTimeAgo from "../../../../components/DateTime/DateTimeAgo.js";

function WalletRawActivityTable(props) {
  const { symbol } = props;
  const pageSize = 10;
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState("-timestamp");

  const { data, isLoading, isPreviousData, isError, ErrorFallbackComponent } = useFetch(
    `markets/${symbol}/events-raw/`,
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

  const uniqueId = () => {
    return _.uniqueId("amount-");
  };

  return (
    <>
      <RemoteTable
        loading={isPreviousData}
        hover={false}
        keyField="id"
        data={data.results}
        defaultSorted={[
          {
            dataField: "timestamp",
            order: "desc",
          },
        ]}
        columns={[
          {
            dataField: "symbol",
            text: "Token",
            formatter: (cell, row) => {
              if (row.event_type === "LiquidationCall") {
                let debtId = uniqueId();
                let collId = uniqueId();
                return (
                  <span>
                    <CryptoIcon name={row.debt_symbol} size="2em" id={debtId} />
                    <UncontrolledTooltip placement="bottom" target={debtId}>
                      {row.debt_symbol}
                    </UncontrolledTooltip>
                    <FontAwesomeIcon icon={faArrowRight} className="mx-2" />
                    <CryptoIcon name={row.symbol} size="2em" id={collId} />
                    <UncontrolledTooltip placement="bottom" target={collId}>
                      {cell}
                    </UncontrolledTooltip>
                  </span>
                );
              } else {
                let id = uniqueId();
                return (
                  <>
                    <span>
                      <CryptoIcon name={cell} size="2em" id={id} className="me-4" />
                      {cell}
                    </span>
                  </>
                );
              }
            },
            headerAlign: "left",
            align: "left",
          },
          {
            dataField: "event_type",
            text: "Event",
            headerAlign: "left",
            align: "left",
          },
          {
            dataField: "amount",
            text: "Amount",
            formatter: (cell, row) => (
              <ValueChange
                value={cell.toFixed(2)}
                decimals={2}
                compact
                className="me-2"
              />
            ),
            headerAlign: "right",
            align: "right",
          },
          {
            dataField: "amount_usd",
            text: "$ amount",
            sort: true,
            formatter: (cell, row) => (
              <ValueChange
                value={cell}
                decimals={2}
                prefix="$"
                compact
                className="me-2"
              />
            ),
            headerAlign: "right",
            align: "right",
          },
          {
            dataField: "tx_hash",
            text: "Tx Hash",
            formatter: (cell) => <EtherscanShort address={cell} type="txhash" />,
            headerAlign: "center",
            align: "center",
          },

          {
            dataField: "timestamp",
            text: "Date",
            sort: true,
            formatter: (cell, row) => (
              <>
                <DateTimeAgo dateTime={parseUTCDateTimestamp(cell)} />
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
        onPageChange={setPage}
        onSortChange={setOrder}
      />
    </>
  );
}

export default withErrorBoundary(WalletRawActivityTable);
