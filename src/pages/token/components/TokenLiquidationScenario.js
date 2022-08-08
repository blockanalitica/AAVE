import React from "react";
import { Col, Row } from "reactstrap";
import LoadingOverlay from "react-loading-overlay";
import Graph from "../../../components/Graph/Graph.js";
import Loader from "../../../components/Loader/Loader.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";
import { compact } from "../../../utils/number.js";
import { tooltipLabelNumber } from "../../../utils/graph.js";

function TokenLiquidationScenarioChart(props) {
  const { slug, type, sum, drop } = props;

  const { data, isLoading, isPreviousData, isError, ErrorFallbackComponent } = useFetch(
    `aave/tokens/${slug}/liquidation-scenario/relative/`,
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

  return (
    <div>
      <Row>
        <Col md={12}>
          <LoadingOverlay active={isPreviousData} spinner>
            {content}
          </LoadingOverlay>
        </Col>
      </Row>
    </div>
  );
}

export default withErrorBoundary(TokenLiquidationScenarioChart);
