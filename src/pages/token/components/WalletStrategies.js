import React, { useState } from "react";
import { faChartPie, faTable } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import { Col, Row } from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import Graph from "../../../components/Graph/Graph.js";
import IconTabs from "../../../components/Tabs/IconTabs.js";
import Value from "../../../components/Value/Value.js";
import SideTabNav from "../../../components/SideTab/SideTabNav.js";
import Loader from "../../../components/Loader/Loader.js";
import { useFetch } from "../../../hooks";
import { withErrorBoundary } from "../../../hoc.js";
import {
  tooltipLabelNumberWithPercent,
  barGraphDataLimiter,
} from "../../../utils/graph.js";
import { compact } from "../../../utils/number.js";

function WalletStrategiesChart(props) {
  const { slug, ...rest } = props;
  const [currentTab, setCurrentTab] = useState("piechart");
  const [type, setType] = useState("supply");

  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `aave/tokens/${slug}/strategies/`
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  if (!data || data.length === 0) {
    return <>No data</>;
  }

  const { series } = barGraphDataLimiter(
    data,
    "type",
    type === "supply" ? "supply_usd" : "borrow_usd",
    0
  );

  let tableData = [];
  if (currentTab === "table") {
    const total = series[0].data.reduce((a, b) => a + b.y, 0);
    tableData = data.reduce((t, item) => {
      const value = type === "supply" ? item.supply_usd : item.borrow_usd;
      t.push({ type: item.type, value: value || 0, share: value / total });
      return t;
    }, []);
  }

  const title = type[0].toUpperCase() + type.slice(1);

  const options = {
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

  return (
    <div {...rest}>
      <h1 className="h3">wallet strategies</h1>
      <Row>
        <Col md={3}>
          <SideTabNav
            activeTab={type}
            toggleTab={setType}
            tabs={[
              { id: "supply", text: "Supply" },
              { id: "borrow", text: "Borrow" },
            ]}
          />
        </Col>
        <Col md={9}>
          <IconTabs
            activeTab={currentTab}
            onTabChange={setCurrentTab}
            tabs={[
              {
                id: "piechart",
                title: <FontAwesomeIcon icon={faChartPie} />,
                content: <Graph series={series} type="bar" options={options} />,
              },
              {
                id: "table",
                title: <FontAwesomeIcon icon={faTable} />,
                content: (
                  <BootstrapTable
                    wrapperClasses="mt-3"
                    bootstrap4
                    bordered={false}
                    keyField="type"
                    defaultSorted={[
                      {
                        dataField: "share",
                        order: "desc",
                      },
                    ]}
                    data={tableData}
                    columns={[
                      {
                        dataField: "type",
                        text: "Type",
                        sort: true,
                      },
                      {
                        dataField: "value",
                        text: title,
                        sort: true,
                        formatter: (cell, row) => (
                          <Value value={cell} decimals={2} prefix="$" compact />
                        ),
                      },
                      {
                        dataField: "share",
                        text: "Share",
                        sort: true,
                        formatter: (cell, row) => (
                          <Value value={cell * 100} decimals={2} suffix="%" />
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
WalletStrategiesChart.propTypes = {
  slug: PropTypes.string.isRequired,
};

export default withErrorBoundary(WalletStrategiesChart);
