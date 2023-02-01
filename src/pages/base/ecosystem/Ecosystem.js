import _ from "lodash";
import React, { useState } from "react";
import { Col, Row } from "reactstrap";
import CurrencySwitch from "../../../components/CurrencySwitch/CurrencySwitch.js";
import EtherscanShort from "../../../components/EtherscanShort/EtherscanShort.js";
import Graph from "../../../components/Graph/Graph.js";
import Loader from "../../../components/Loader/Loader.js";
import SideTabNav from "../../../components/SideTab/SideTabNav.js";
import TimeSwitch from "../../../components/TimeSwitch/TimeSwitch.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch, usePageTitle } from "../../../hooks";
import { tooltipLabelNumber } from "../../../utils/graph.js";
import { compact } from "../../../utils/number.js";
import styles from "./Ecosystem.module.scss";

function Ecosystem(props) {
  usePageTitle("Ecosystem reserves");
  const [type, setType] = useState("safety-module");
  const [isTokenCurrency, setIsTokenCurrency] = useState(false);
  const [timePeriod, setTimePeriod] = useState(30);

  const timeOptions = [
    { key: 7, value: "7 days" },
    { key: 30, value: "30 days" },
    { key: 180, value: "180 days" },
    { key: 365, value: "1 year" },
    { key: "all", value: "all" },
  ];

  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    "ecosystem/reserves/",
    { type, days_ago: timePeriod !== "all" ? timePeriod : null }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  let contractAddress;
  if (type === "safety-module") {
    contractAddress = (
      <>
        <div>
          <div>
            <small className={styles.contractAddress}>{"stkAave:  "}</small>
            <EtherscanShort address="0x4da27a545c0c5b758a6ba100e3a049001de870f5" />
          </div>
          <div>
            <small className={styles.contractAddress}>{"stkABPT:  "}</small>
            <EtherscanShort address="0xa1116930326d21fb917d5a27f1e9943a9595fb47" />
          </div>
        </div>
      </>
    );
  } else if (type === "collector-reserve") {
    contractAddress = (
      <>
        <div>
          <small className={styles.contractAddress}>{"aave collector:  "}</small>
          <EtherscanShort address="0x464c71f6c2f760dda6093dcb91c24c39e5d6e18c" />
        </div>
      </>
    );
  } else if (type === "aave-reserve") {
    contractAddress = (
      <>
        <div>
          <small className={styles.contractAddress}>{"ecosystem reserve:  "}</small>
          <EtherscanShort address="0x25f2226b597e8f9514b3f68f00f494cf4f286491" />
        </div>
      </>
    );
  } else {
    contractAddress = (
      <>
        <div>
          <small className={styles.contractAddress}>{"ABPT:  "}</small>
          <EtherscanShort address="0xc697051d1c6296c24ae3bcef39aca743861d9a81" />
        </div>
      </>
    );
  }

  const grouped = _.groupBy(data, "label");
  const series = [];

  Object.entries(grouped).forEach(([key, rows]) => {
    series.push({
      label: key,
      data: rows.map((row) => ({
        x: row["datetime"],
        y:
          isTokenCurrency && type !== "collector-reserve"
            ? row["value"]
            : row["value_usd"],
      })),
    });
  });

  const options = {
    fill:
      isTokenCurrency || type === "collector-reserve" || type === "aave-reserve"
        ? false
        : true,
    interaction: {
      axis: "x",
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
        },
      },
      y: {
        stacked: isTokenCurrency ? false : true,
        ticks: {
          callback: (value) => compact(value, 2, true),
        },
      },
    },

    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            let prefix = isTokenCurrency && type !== "collector-reserve" ? "" : "$";
            return tooltipLabelNumber(tooltipItem, prefix);
          },

          footer: (tooltipItems) => {
            const total = tooltipItems.reduce(
              (total, tooltip) => total + tooltip.parsed.y,
              0
            );
            if (
              !isTokenCurrency &&
              (type === "safety-module" || type === "abp-composition")
            ) {
              return "Total: $" + compact(total, 2, true);
            }
          },
        },
      },
    },
  };

  return (
    <>
      <Row className="mb-4">
        <Col>
          <h3>Ecosystem reserves</h3>
        </Col>
      </Row>
      <Row>
        <Col md={3}>
          <SideTabNav
            activeTab={type}
            toggleTab={setType}
            tabs={[
              { id: "safety-module", text: "safety module reserve" },
              { id: "abp-composition", text: "ABP composition" },
              { id: "aave-reserve", text: "Aave reserve" },
              { id: "collector-reserve", text: "treasury reserve" },
            ]}
          />
        </Col>
        <Col md={9}>
          <div className="mb-3 d-flex flex-direction-row align-items-center justify-content-between">
            {contractAddress}
            {type !== "collector-reserve" ? (
              <small>
                <CurrencySwitch
                  label="show amounts in:"
                  options={[
                    { key: "USD", value: "$" },
                    { key: "token", value: "Token" },
                  ]}
                  onChange={(option) => setIsTokenCurrency(option === "token")}
                />
              </small>
            ) : null}
            <TimeSwitch
              activeOption={timePeriod}
              label={""}
              onChange={setTimePeriod}
              options={timeOptions}
            />
          </div>

          <Graph series={series} options={options} />
        </Col>
      </Row>
    </>
  );
}

export default withErrorBoundary(Ecosystem);
