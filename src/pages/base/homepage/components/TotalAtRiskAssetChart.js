import _ from "lodash";
import React from "react";
import Graph from "../../../../components/Graph/Graph.js";
import Loader from "../../../../components/Loader/Loader.js";
import { withErrorBoundary } from "../../../../hoc.js";
import { useFetch } from "../../../../hooks";
import { compact } from "../../../../utils/number.js";
import { tooltipLabelNumber } from "../../../../utils/graph.js";
import { parseUTCDateTime } from "../../../../utils/datetime.js";
import DateTimeAgo from "../../../../components/DateTime/DateTimeAgo.js";

function TotalAtRiskAssetChart(props) {
  const { chartType } = props;

  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `at-risk/protection-score/token/`
  );
  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  if (!data) {
    return <div>No data</div>;
  }

  let y;
  if (chartType === "bar") {
    y = "total_amount_usd";
  } else {
    y = "total_amount_usd";
  }

  const { results, last_updated } = data;

  let grouped;
  grouped = _.groupBy(results, "underlying_symbol");
  const series = [];
  Object.entries(grouped)
    .sort((a, b) => b[1][0].total_amount_usd - a[1][0].total_amount_usd)
    .forEach(([key, rows]) => {
      let item = {
        label: key + " risk",
        protection_score: key,
        data: rows.map((row) =>
          row.drop <= 100
            ? {
                x: row["drop"],
                y: row[y],
              }
            : true
        ),
      };
      series.push(item);
    });

  const options = {
    aspectRatio: 2.5,
    fill: true,
    interaction: {
      axis: "x",
    },
    scales: {
      x: {
        stacked: true,
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
        stacked: true,
        ticks: {
          callback: (value) => "$" + compact(value, 2, true),
        },
        title: {
          display: true,
          text: `collateral USD amount at risk`,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            const total = tooltipItems.reduce(
              (total, tooltip) => total + tooltip.parsed.y,
              0
            );
            return "Total: $" + total.toFixed(2);
          },
          label: (tooltipItem) => {
            return tooltipLabelNumber(tooltipItem, "$");
          },
          footer: (tooltipItems) => {
            const total = tooltipItems.reduce(
              (total, tooltip) => total + tooltip.parsed.y,
              0
            );
            return "Total: $" + total.toFixed(2);
          },
        },
      },
    },
  };

  return (
    <>
      <Graph series={series} options={options} type={chartType} />
      <div className="d-flex flex-direction-row justify-content-end align-items-center">
        <small className="mb-3 justify-content-end">
          last updated: <DateTimeAgo dateTime={parseUTCDateTime(last_updated)} />
        </small>
      </div>
    </>
  );
}

export default withErrorBoundary(TotalAtRiskAssetChart);
