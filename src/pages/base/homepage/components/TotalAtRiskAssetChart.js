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

  const { results, last_updated } = data;
  const grouped = _.groupBy(results, "underlying_symbol");

  const seriesData = [];
  const otherData = {};

  Object.entries(grouped)
    .sort((a, b) => b[1][0].total_amount_usd - a[1][0].total_amount_usd)
    .forEach(([key, rows], index) => {
      if (index < 10) {
        let item = {
          label: key + " risk",
          data: rows.map((row) => ({
            x: row["drop"],
            y: row["total_amount_usd"],
          })),
        };
        seriesData.push(item);
      } else {
        rows.forEach((row) => {
          otherData[row.drop] = otherData[row.drop] || 0;
          otherData[row.drop] += row["total_amount_usd"];
        });
      }
    });

  const otherDataArray = Object.entries(otherData).map(([drop, value]) => ({
    x: drop,
    y: value,
  }));

  if (otherDataArray.length > 0) {
    seriesData.push({
      label: "Other",
      data: otherDataArray,
    });
  }

  const series = seriesData;

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
            return `At ${tooltipItems[0].parsed.x}% markets price drop`;
          },

          label: (tooltipItem) => {
            return tooltipLabelNumber(tooltipItem, "$");
          },
          footer: (tooltipItems) => {
            const total = tooltipItems.reduce(
              (total, tooltip) => total + tooltip.parsed.y,
              0
            );
            return "Total: $" + compact(total.toFixed(2));
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
