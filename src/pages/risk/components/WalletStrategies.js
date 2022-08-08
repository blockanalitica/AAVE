import React, { useState } from "react";
import { faChartPie, faTable } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Row } from "reactstrap";
import LoadingOverlay from "react-loading-overlay";
import BootstrapTable from "react-bootstrap-table-next";
import Graph from "../../../components/Graph/Graph.js";
import IconTabs from "../../../components/Tabs/IconTabs.js";
import Loader from "../../../components/Loader/Loader.js";
import Value from "../../../components/Value/Value.js";
import SideTabNav from "../../../components/SideTab/SideTabNav.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";
import {
  barGraphDataLimiter,
  tooltipLabelNumberWithPercent,
} from "../../../utils/graph.js";
import { compact } from "../../../utils/number.js";

function WalletStrategies(props) {
  const { ...rest } = props;
  const [type, setType] = useState("supply");
  const [currentTab, setCurrentTab] = useState("piechart");
  const { data, isLoading, isPreviousData, isError, ErrorFallbackComponent } = useFetch(
    "aave/risk/wallet-strategies/",
    null,
    { keepPreviousData: true }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  let tableData = [];
  if (currentTab === "table") {
    const total = data.reduce((a, b) => a + b[type], 0);
    tableData = data.reduce((t, item) => {
      const value = item[type];
      t.push({
        type: item.strategy,
        raw_type: item.raw_type,
        value: value || 0,
        share: value / total,
      });
      return t;
    }, []);
  }

  const { series } = barGraphDataLimiter(data, "strategy", type, 0);
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

  const title = type[0].toUpperCase() + type.slice(1);
  return (
    <div {...rest}>
      <h3 className="mb-4">wallet strategies</h3>
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
          <LoadingOverlay active={isPreviousData} spinner>
            <IconTabs
              name={`Distribution of ${type} market side by position strategy.`}
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
                          headerAlign: "right",
                          align: "right",
                        },
                        {
                          dataField: "share",
                          text: "Share",
                          sort: true,
                          formatter: (cell, row) => (
                            <Value value={cell * 100} decimals={2} suffix="%" />
                          ),
                          headerAlign: "right",
                          align: "right",
                        },
                      ]}
                    />
                  ),
                },
              ]}
            />
          </LoadingOverlay>
        </Col>
      </Row>
    </div>
  );
}

export default withErrorBoundary(WalletStrategies);
