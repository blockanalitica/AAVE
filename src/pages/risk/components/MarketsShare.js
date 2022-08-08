import React, { useState } from "react";
import { faChartPie, faTable } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Row } from "reactstrap";
import LoadingOverlay from "react-loading-overlay";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import Loader from "../../../components/Loader/Loader.js";
import Graph from "../../../components/Graph/Graph.js";
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

function MarketsShare(props) {
  const { ...rest } = props;
  const [type, setType] = useState("total_supply_usd");
  const [currentTab, setCurrentTab] = useState("piechart");

  const { data, isLoading, isPreviousData, isError, ErrorFallbackComponent } = useFetch(
    "aave/risk/markets-share/",
    null,
    { keepPreviousData: true }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  let tableData = [];
  let title = null;
  let valueKey = null;
  let name = null;
  let description = null;

  switch (type) {
    case "borrow":
      valueKey = "total_borrow_usd";
      title = "Borrow";
      name = "Borrow market side distribution between assets";
      break;
    case "real_supply":
      title = "Real Supply";
      valueKey = "net_supply_usd";
      name = "Supply market side distribution between assets";
      description =
        "Real Supply represent positions excluding recursive leverage farming positions optimized for liquidity mining.";
      break;
    case "real_borrow":
      title = "Real Borrow";
      valueKey = "net_borrow_usd";
      name = "Borrow market side distribution between assets";
      description =
        "Real Supply represent positions excluding recursive leverage farming positions optimized for liquidity mining.";
      break;
    case "tvl":
      title = "TVL";
      valueKey = "tvl_usd";
      name = "TVL market distribution between assets";
      break;
    default:
      valueKey = "total_supply_usd";
      title = "supply";
      name = "Supply market side distribution between assets";
  }

  const { series } = barGraphDataLimiter(data, "slug", valueKey);

  if (currentTab === "table") {
    const total = data.reduce((a, b) => a + b[valueKey], 0);
    tableData = data.reduce((t, item, idx) => {
      const value = item[valueKey];
      t.push({
        market: item.slug,
        value: value || 0,
        share: value / total,
      });
      return t;
    }, []);
  }

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
      <h3 className="mb-4">markets share</h3>
      <Row>
        <Col md={3}>
          <SideTabNav
            activeTab={type}
            toggleTab={setType}
            tabs={[
              { id: "supply", text: "Supply" },
              { id: "borrow", text: "Borrow" },
              { id: "real_supply", text: "Real Supply" },
              { id: "real_borrow", text: "Real borrow" },
              { id: "tvl", text: "TVL" },
            ]}
          />
        </Col>
        <Col md={9}>
          <LoadingOverlay active={isPreviousData} spinner>
            <IconTabs
              name={name}
              description={description}
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
                      keyField="market"
                      defaultSorted={[
                        {
                          dataField: "share",
                          order: "desc",
                        },
                      ]}
                      data={tableData}
                      columns={[
                        {
                          dataField: "market",
                          text: "Market",
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
                      pagination={paginationFactory({
                        sizePerPageList: [],
                        sizePerPage: 10,
                        showTotal: true,
                      })}
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

export default withErrorBoundary(MarketsShare);
