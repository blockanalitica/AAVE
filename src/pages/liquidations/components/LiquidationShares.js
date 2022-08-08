import { faChartArea, faTable } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Link } from "react-router-dom";
import Address from "../../../components/Address/Address.js";
import { Button, Col, Row } from "reactstrap";
import React, { useState } from "react";
import SideTabNav from "../../../components/SideTab/SideTabNav.js";
import BootstrapTable from "react-bootstrap-table-next";
import Graph from "../../../components/Graph/Graph.js";
import Loader from "../../../components/Loader/Loader.js";
import IconTabs from "../../../components/Tabs/IconTabs.js";
import Value from "../../../components/Value/Value.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";
import { compact } from "../../../utils/number.js";
import { shorten } from "../../../utils/address.js";
import { SYMBOLS_PALETTE } from "../../../utils/colors.js";
import {
  tooltipLabelNumberWithPercent,
  barGraphSeriesCountLimiter,
} from "../../../utils/graph.js";

function LiquidationShares(props) {
  const { daysAgo, address } = props;
  const [type, setType] = useState("collateral");
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    "aave/liquidations/share/",
    { type, days_ago: daysAgo, address }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  } else if (data.length === 0) {
    return <>No data</>;
  }

  let limit;
  if (type === "top_ten") {
    limit = false;
  } else {
    limit = true;
  }
  const { series } = barGraphSeriesCountLimiter(data, "key", "value", 7, limit);

  const backgroundColor = series[0]["data"].map((row) => {
    return SYMBOLS_PALETTE[row["x"]] || (limit ? "#0e1726" : "#03A9F4");
  });

  const newSeries = [
    {
      data: series[0]["data"],
      backgroundColor,
    },
  ];

  const options = {
    interaction: {
      axis: "x",
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => "$" + compact(value, 2, true),
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
            return tooltipLabelNumberWithPercent(tooltipItem, "$");
          },
        },
      },
    },
  };

  let description;
  let title;
  if (type === "collateral") {
    description =
      "Shows distribution of bought collateral assets in the protocol since April 2021.";
    title = "collateral seized";
  } else if (type === "debt") {
    description =
      "Shows distribution of repaid borrowed assets in the protocol since April 2021.";
    title = "debt repaid";
  } else {
    description = "Shows distribution of volume in liquidation events per liquidator.";
    title = "top ten liquidators";
    options["scales"]["x"] = {
      ticks: {
        callback: function (value, index, ticks) {
          return shorten(this.getLabelForValue(value));
        },
      },
    };
  }
  return (
    <Row>
      <Col md={3}>
        <SideTabNav
          activeTab={type}
          toggleTab={setType}
          tabs={[
            { id: "collateral", text: "collateral seized" },
            { id: "debt", text: "debt repaid" },
            { id: "top_ten", text: "top 10 liquidators" },
          ]}
        />
      </Col>
      <Col md={9}>
        <IconTabs
          name={title}
          description={description}
          tabs={[
            {
              title: <FontAwesomeIcon icon={faChartArea} />,
              content: (
                <>
                  <Graph series={newSeries} options={options} type="bar" />
                  {type === "top_ten" ? (
                    <Col className="text-center mt-4">
                      <Link to={`/liquidations/liquidators/?daysAgo=${daysAgo}`}>
                        <Button color="primary">View More</Button>
                      </Link>
                    </Col>
                  ) : (
                    <></>
                  )}
                </>
              ),
            },
            {
              title: <FontAwesomeIcon icon={faTable} />,
              content: (
                <>
                  <BootstrapTable
                    wrapperClasses="mt-3"
                    bootstrap4
                    bordered={false}
                    keyField="key"
                    defaultSorted={[
                      {
                        dataField: "share",
                        order: "desc",
                      },
                    ]}
                    pagination={paginationFactory({
                      sizePerPageList: [],
                      sizePerPage: 5,
                      showTotal: true,
                    })}
                    data={data}
                    columns={[
                      {
                        dataField: "key",
                        text: "Symbol",
                        sort: true,
                        formatter: (cell) =>
                          cell.length === 42 ? (
                            <Link to={`/wallets/${cell}/`} key={cell}>
                              <Address value={cell} short />
                            </Link>
                          ) : (
                            cell
                          ),
                      },

                      {
                        dataField: "value",
                        text: "Total",
                        sort: true,
                        headerAlign: "right",
                        align: "right",
                        formatter: (cell, row) => (
                          <Value value={cell} decimals={2} prefix="$" compact />
                        ),
                      },
                      {
                        dataField: "share",
                        text: "Share",
                        sort: true,
                        headerAlign: "right",
                        align: "right",
                        formatter: (cell) => (
                          <Value value={cell} decimals={2} suffix="%" />
                        ),
                      },
                    ]}
                  />
                </>
              ),
            },
          ]}
        />
      </Col>
    </Row>
  );
}

LiquidationShares.propTypes = {
  type: PropTypes.string,
  address: PropTypes.string,
  daysAgo: PropTypes.number.isRequired,
};

export default withErrorBoundary(LiquidationShares);
