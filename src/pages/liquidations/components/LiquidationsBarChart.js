import PropTypes from "prop-types";
import React from "react";
import Graph from "../../../components/Graph/Graph.js";
import { withErrorBoundary } from "../../../hoc.js";
import { compact } from "../../../utils/number.js";
import {
  tooltipFooterTotal,
  tooltipLabelNumber,
  tooltipTitleDateTime,
} from "../../../utils/graph.js";

function LiquidationsBarChart(props) {
  const { results, daysAgo } = props;

  let xUnit = "day";
  if (daysAgo > 180) {
    xUnit = "month";
  } else if (daysAgo > 30) {
    xUnit = "week";
  }
  const series = [];
  Object.entries(results).forEach(([key, rows]) => {
    series.push({
      label: key,
      data: rows.map((row) => ({
        x: row["datetime"],
        y: row["collateral_seized_usd"],
      })),
    });
  });

  const options = {
    aspectRatio: 1.5,
    interaction: {
      axis: "x",
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: xUnit,
          displayFormats: {
            week: "W yyyy",
          },
        },
        stacked: true,
      },
      y: {
        stacked: true,
        ticks: {
          callback: (value) => "$" + compact(value, 2, true),
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            let format = "LLL yyyy";
            let prefix = "";
            if (xUnit === "week") {
              prefix = "Week starting on ";
              format = null;
            }
            return prefix + tooltipTitleDateTime(tooltipItems, true, false, format);
          },
          label: (tooltipItem) => {
            return tooltipLabelNumber(tooltipItem, "$");
          },
          footer: (tooltipItems) => {
            return tooltipFooterTotal(tooltipItems, "Total: $");
          },
        },
      },
    },
  };
  return (
    <>
      <p>Collateral sold in liquidations per certain time period.</p>
      <Graph series={series} options={options} type="bar" />
    </>
  );
}

LiquidationsBarChart.propTypes = {
  period: PropTypes.string,
};

export default withErrorBoundary(LiquidationsBarChart);
