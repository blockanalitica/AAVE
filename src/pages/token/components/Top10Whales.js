import React, { useState } from "react";
import { faChartPie, faTable } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Row } from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import { Link } from "react-router-dom";
import Address from "../../../components/Address/Address.js";
import Graph from "../../../components/Graph/Graph.js";
import Loader from "../../../components/Loader/Loader.js";
import IconTabs from "../../../components/Tabs/IconTabs.js";
import Value from "../../../components/Value/Value.js";
import SideTabNav from "../../../components/SideTab/SideTabNav.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";
import {
  barGraphDataLimiter,
  tooltipLabelNumberWithPercent,
} from "../../../utils/graph.js";
import { compact } from "../../../utils/number.js";

function Top10Whales(props) {
  const { tokenAddress, symbol, ...rest } = props;
  const [position, setPosition] = useState("supply");

  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    "aave/risk/top-whales/",
    { position, token_address: tokenAddress }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const suffix = symbol ? ` ${symbol}` : "";
  const prefix = symbol ? "" : "$";

  const { series } = barGraphDataLimiter(data, "label", "amount", 0);

  const options = {
    scales: {
      y: {
        ticks: {
          callback: (value) => compact(value, 2, true),
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return tooltipLabelNumberWithPercent(tooltipItem, null, ` ${symbol}`);
          },
        },
      },
    },
  };

  const description = "Showing the distribution of open interest by accounts.";

  return (
    <div {...rest}>
      <h1 className="h3">top wallets</h1>
      <Row>
        <Col md={3}>
          <SideTabNav
            activeTab={position}
            toggleTab={setPosition}
            tabs={[
              { id: "supply", text: "Supply" },
              { id: "borrow", text: "Borrow" },
            ]}
          />
        </Col>
        <Col md={9}>
          <IconTabs
            description={description}
            tabs={[
              {
                title: <FontAwesomeIcon icon={faChartPie} />,
                content: <Graph series={series} type="bar" options={options} />,
              },
              {
                title: <FontAwesomeIcon icon={faTable} />,
                content: (
                  <BootstrapTable
                    wrapperClasses="mt-3"
                    bootstrap4
                    bordered={false}
                    keyField="share"
                    defaultSorted={[
                      {
                        dataField: "share",
                        order: "desc",
                      },
                    ]}
                    data={data}
                    columns={[
                      {
                        dataField: "address",
                        text: "Wallet",
                        formatter: (cell) =>
                          cell.toLowerCase() !== "others" ? (
                            <Link to={`/wallets/${cell}/`} key={cell}>
                              <Address value={cell} />
                            </Link>
                          ) : (
                            <>{cell}</>
                          ),
                      },
                      {
                        dataField: "amount",
                        text: "Amount",
                        sort: true,
                        formatter: (cell) => (
                          <Value
                            value={cell}
                            decimals={2}
                            prefix={prefix}
                            suffix={suffix}
                          />
                        ),
                      },
                      {
                        dataField: "share",
                        text: "Share",
                        sort: true,
                        formatter: (cell) => (
                          <Value value={cell} decimals={2} suffix="%" />
                        ),
                      },
                    ]}
                  />
                ),
              },
            ]}
          />
        </Col>
      </Row>
    </div>
  );
}

export default withErrorBoundary(Top10Whales);
