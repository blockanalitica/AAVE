import React, { useState } from "react";
import { Col, Row } from "reactstrap";
import { UncontrolledTooltip } from "reactstrap";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch, usePageTitle, useSmartNavigate } from "../../../hooks";
import Loader from "../../../components/Loader/Loader.js";
import ValueChange from "../../../components/Value/ValueChange.js";
import RemoteTable from "../../../components/Table/RemoteTable.js";
import DateTimeAgo from "../../../components/DateTime/DateTimeAgo.js";
import CryptoIcon from "../../../components/CryptoIcon/CryptoIcon.js";
import EtherscanShort from "../../../components/EtherscanShort/EtherscanShort.js";
import Address from "../../../components/Address/Address.js";
import { parseUTCDateTimestamp } from "../../../utils/datetime.js";
import _ from "lodash";

function Activity(props) {
  usePageTitle("Activity last 24h");

  const navigate = useSmartNavigate();
  const pageSize = 50;
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState("-timestamp");

  const { data, isLoading, isPreviousData, isError, ErrorFallbackComponent } = useFetch(
    "activity/",
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

  const onRowClick = (row) => {
    navigate(`wallets/${row.address}/`);
  };

  return (
    <>
      <h4 className="mb-4">activity last 24h</h4>
      <Row>
        <Col className="mb-4">
          <RemoteTable
            loading={isPreviousData}
            onRowClick={onRowClick}
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
                  if (row.event === "LiquidationCall") {
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
                dataField: "event",
                text: "Event",
                sort: true,
                headerAlign: "center",
                align: "center",
              },

              {
                dataField: "amount",
                text: "Amount",
                formatter: (cell, row) => (
                  <ValueChange value={cell} decimals={2} compact className="me-2" />
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
                dataField: "address",
                text: "address",
                formatter: (cell) => <Address value={cell} short />,
                headerAlign: "center",
                align: "center",
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
        </Col>
      </Row>
    </>
  );
}

export default withErrorBoundary(Activity);
