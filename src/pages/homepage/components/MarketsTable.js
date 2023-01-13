import React from "react";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "reactstrap";
import CryptoIcon from "../../../components/CryptoIcon/CryptoIcon.js";
import Loader from "../../../components/Loader/Loader.js";
import LinkTable from "../../../components/Table/LinkTable.js";
import Value from "../../../components/Value/Value.js";
import ValueChange from "../../../components/Value/ValueChange.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";

function Homepage(props) {
  const { daysAgo } = props;
  const navigate = useNavigate();
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    "aave/protocols/stats/",
    { days_ago: daysAgo }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const onRowClick = (row) => {
    if (row.network === "arbitrum") {
      return;
    } else {
      navigate(`/${row.version}/${row.network}/`);
    }
  };

  return (
    <>
      <Row className="mb-4">
        <Col>
          <LinkTable
            keyField="tvl"
            data={data.stats}
            onRowClick={onRowClick}
            defaultSorted={[
              {
                dataField: "tvl",
                order: "desc",
              },
            ]}
            columns={[
              {
                dataField: "network",
                text: "",
                sort: false,
                formatter: (cell, row) => (
                  <CryptoIcon className="me-2" name={row.network} size="2rem" />
                ),
                footer: "",
              },
              {
                dataField: "network",
                text: "Protocol",
                sort: false,
                footer: "",
              },
              {
                dataField: "version",
                text: "Version",
                sort: false,
                footer: "",
              },
              {
                dataField: "tvl",
                text: "TVL",
                formatter: (cell, row) => (
                  <>
                    <Value value={cell} decimals={2} prefix="$" compact />
                    <br />
                    <ValueChange
                      value={cell - row["tvl_change"]}
                      decimals={2}
                      prefix="$"
                      compact
                      icon
                      hideIfZero
                      tooltipValue={row["tvl_change"]}
                    />
                  </>
                ),
                headerAlign: "right",
                align: "right",
              },
              {
                dataField: "supply",
                text: "Total Supply",
                sort: true,
                formatter: (cell, row) => (
                  <>
                    <Value value={cell} decimals={2} prefix="$" compact />
                    <br />
                    <ValueChange
                      value={cell - row["supply_change"]}
                      decimals={2}
                      prefix="$"
                      compact
                      icon
                      hideIfZero
                      tooltipValue={row["supply_change"]}
                    />
                  </>
                ),
                headerAlign: "right",
                align: "right",
              },
              {
                dataField: "borrow",
                text: "Total Borrow",
                sort: true,
                formatter: (cell, row) => (
                  <>
                    <Value value={cell} decimals={2} prefix="$" compact />
                    <br />
                    <ValueChange
                      value={cell - row["borrow_change"]}
                      decimals={2}
                      prefix="$"
                      compact
                      icon
                      hideIfZero
                      tooltipValue={row["borrow_change"]}
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

export default withErrorBoundary(Homepage);
