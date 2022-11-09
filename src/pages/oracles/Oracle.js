import { useNavigate } from "react-router-dom";
import { Col, Row } from "reactstrap";
import CryptoIcon from "../../components/CryptoIcon/CryptoIcon.js";
import Loader from "../../components/Loader/Loader.js";
import paginationFactory from "react-bootstrap-table2-paginator";
import LinkTable from "../../components/Table/LinkTable.js";
import Value from "../../components/Value/Value.js";
import ValueChange from "../../components/Value/ValueChange.js";
import { withErrorBoundary } from "../../hoc.js";
import { useFetch, usePageTitle } from "../../hooks";
import DateTimeAgo from "../../components/DateTime/DateTimeAgo.js";
import { parseUTCDateTimestamp } from "../../utils/datetime.js";

function Homepage(props) {
  usePageTitle("Oracles");
  const navigate = useNavigate();
  const { data, isLoading, isError, ErrorFallbackComponent } =
    useFetch("aave/oracles/");

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const onRowClick = (row) => {
    navigate(`/oracles/${row.symbol}/`);
  };

  return (
    <>
      <div className="mb-4 d-flex align-items-center">
        <h3 className="mb-4">Oracle</h3>
        <div className="mb-2 flex-grow-1 d-flex align-items-center justify-content-end"></div>
      </div>
      <Row className="mb-4">
        <Col>
          <LinkTable
            keyField="symbol"
            data={data}
            onRowClick={onRowClick}
            pagination={paginationFactory({
              sizePerPageList: [],
              sizePerPage: 15,
              showTotal: true,
            })}
            defaultSorted={[
              {
                dataField: "price",
                order: "desc",
              },
            ]}
            columns={[
              {
                dataField: "x",
                text: "",
                sort: false,
                formatter: (cell, row) => (
                  <CryptoIcon className="me-2" name={row.symbol} size="2rem" />
                ),
                footer: "",
              },
              {
                dataField: "symbol",
                text: "ASSET",
                sort: true,
                footer: "",
              },
              {
                dataField: "price",
                text: "Price",
                sort: true,
                formatter: (cell, row) => (
                  <>
                    <Value value={cell} decimals={2} prefix="$" />
                    <br />
                    <ValueChange
                      value={cell - row["price"]}
                      decimals={0}
                      prefix="$"
                      icon
                      hideIfZero
                      tooltipValue={row["price"]}
                    />
                  </>
                ),
                headerAlign: "right",
                align: "right",
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
          />
        </Col>
      </Row>
    </>
  );
}

export default withErrorBoundary(Homepage);
