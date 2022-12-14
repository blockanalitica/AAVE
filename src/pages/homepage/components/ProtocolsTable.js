import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Col, Row } from "reactstrap";
import CryptoIcon from "../../../components/CryptoIcon/CryptoIcon.js";
import Loader from "../../../components/Loader/Loader.js";
import LinkTable from "../../../components/Table/LinkTable.js";
import Value from "../../../components/Value/Value.js";
import ValueChange from "../../../components/Value/ValueChange.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";
import { Link } from "react-router-dom";

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

  console.log(data)

  const onRowClick = (row) => {
    navigate(`/${row.version}/${row.network}/`);
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
                sort: true,
                footer: "",
              },
              {
                dataField: "tvl",
                text: "TVL",
                formatter: (cell, row) => (
                  <>
                    <Value value={cell} decimals={2} prefix="$" compact />
                    <br />
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
