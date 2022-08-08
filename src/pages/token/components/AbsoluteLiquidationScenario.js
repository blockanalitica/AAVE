import React, { useState } from "react";
import { Col, Row } from "reactstrap";
import LoadingOverlay from "react-loading-overlay";
import Graph from "../../../components/Graph/Graph.js";
import Loader from "../../../components/Loader/Loader.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";
import { compact } from "../../../utils/number.js";
import { tooltipLabelNumber } from "../../../utils/graph.js";
import TimeSwitch from "../../../components/TimeSwitch/TimeSwitch.js";

function AbsoluteLiquidationScenario(props) {
  const { slug, type, sum } = props;
  const [drop, setDrop] = useState(50);

  const dropOptions = [
    { key: 5, value: "5%" },
    { key: 10, value: "10%" },
    { key: 25, value: "25%" },
    { key: 50, value: "50%" },
    { key: 60, value: "60%" },
    { key: 70, value: "70%" },
    { key: 80, value: "80%" },
  ];

  const { data, isLoading, isPreviousData, isError, ErrorFallbackComponent } = useFetch(
    `aave/tokens/${slug}/liquidation-scenario/absolute/`,
    { type, sum }
  );
  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  if (!data) {
    return <div>No data</div>;
  }

  const series = [];
  let options;
  let content;

  if (sum === "absolute") {
    Object.entries(data).forEach(([key, rows]) => {
      let yAxis = key === "USD" ? "y" : "y1";
      series.push({
        label: key,
        yAxisID: yAxis,
        data: rows.map((row) =>
          row.drop <= drop
            ? {
                x: row["drop"],
                y: row["amount"],
              }
            : true
        ),
      });
    });

    options = {
      fill: false,
      interaction: {
        axis: "x",
      },
      scales: {
        x: {
          type: "linear",
          ticks: {
            callback: (value) => `-${value}%`,
          },
          title: {
            display: true,
            text: "price drop",
          },
        },
        y: {
          position: "left",
          ticks: {
            callback: (value) => "$" + compact(value, 2, true),
          },
          title: {
            display: true,
            text: `${type} liquidated`,
          },
        },
        y1: {
          position: "right",
          ticks: {
            callback: (value) => value + ` ${slug}`,
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            title: (tooltipItems) => {
              return `At ${tooltipItems[0].parsed.x}% drop`;
            },
            label: (tooltipItem) => {
              let label = `Total ${type} liquidated: `;
              let info;

              if (tooltipItem.parsed.y !== null) {
                if (tooltipItem.dataset.label === "USD") {
                  info = "$" + compact(tooltipItem.parsed.y, 2, true);
                } else {
                  info = compact(tooltipItem.parsed.y, 2, true) + ` ${slug}`;
                }
                label += info;
              }
              return label;
            },
          },
        },
      },
    };
    content = <Graph series={series} options={options} />;
  } else {
    Object.entries(data).forEach(([key, rows]) => {
      let yAxis = key === "USD" ? "y" : "y1";
      series.push({
        label: key,
        yAxisID: yAxis,
        data: rows.map((row) =>
          row["drop"] <= drop
            ? {
                x: row["drop"],
                y: row["amount"],
              }
            : true
        ),
      });
    });

    options = {
      interaction: {
        intersect: false,
      },
      scales: {
        x: {
          type: "linear",
          ticks: {
            callback: (value) => "-" + value + "%",
          },
        },
        y: {
          position: "left",
          ticks: {
            callback: (value) => "$" + compact(value, 2, true),
          },
          title: {
            display: true,
            text: `${type} liquidated`,
          },
        },
        y1: {
          position: "right",
          ticks: {
            callback: (value) => value + ` ${slug}`,
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            title: (tooltipItems) => {
              if (tooltipItems[0].parsed.y > 0) {
                return `At ${tooltipItems[0].parsed.x}% drop`;
              }
            },
            label: (tooltipItem) => {
              if (tooltipItem.parsed.y > 0) {
                return tooltipLabelNumber(tooltipItem, "$");
              }
            },
          },
        },
      },
    };

    content = <Graph series={series} options={options} type="bar" />;
  }

  let description;

  if (type === "collateral") {
    description =
      "Simulation of collateral assets to be sold in liquidations after certain price drops.";
  } else {
    description =
      "Simulation of borrowed assets to be repaid in liquidations after certain price drops.";
  }

  return (
    <div>
      <div className="d-flex flex-direction-row justify-content-between align-items-center mb-4">
        <h3 className="flex-grow-1">absolute liquidations curve</h3>
        <TimeSwitch
          className="mb-3 justify-content-end"
          label="Drop:"
          activeOption={drop}
          onChange={setDrop}
          options={dropOptions}
        />
      </div>
      <Row>
        <Col md={12}>
          <LoadingOverlay active={isPreviousData} spinner>
            <p>{description}</p>
            {content}
          </LoadingOverlay>
        </Col>
      </Row>
    </div>
  );
}

export default withErrorBoundary(AbsoluteLiquidationScenario);
