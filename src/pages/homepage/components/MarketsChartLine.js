import React from "react";
import Graph from "../../../components/Graph/Graph.js";
import Loader from "../../../components/Loader/Loader.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";
import { tooltipLabelNumber, tooltipTitleDateTime } from "../../../utils/graph.js";
import { compact } from "../../../utils/number.js";
import _ from "lodash";

function MarketsChartLine(props) {
  const { timePeriod, dataType } = props;
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `aave/protocols/stats/`,
    { days_ago: timePeriod }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const results_eth_v2 = [];
  const results_opt_v3 = [];
  const grouped = _.groupBy(data.historic, "key");
  Object.entries(grouped).forEach(([key, rows]) =>
    rows.forEach((row) => {
      if (dataType === "supply") {
        if (key === "ethereum") {
          results_eth_v2.push({
            x: row["dt"],
            y: row["supply"],
          });
        } else {
          results_opt_v3.push({
            x: row["dt"],
            y: row["supply"],
          });
        }
      }

      if (dataType === "borrow") {
        if (key === "ethereum") {
          results_eth_v2.push({
            x: row["dt"],
            y: row["borrow"],
          });
        } else {
          results_opt_v3.push({
            x: row["dt"],
            y: row["borrow"],
          });
        }
      }
      if (dataType === "tvl") {
        if (key === "ethereum") {
          results_eth_v2.push({
            x: row["dt"],
            y: row["tvl"],
          });
        } else {
          results_opt_v3.push({
            x: row["dt"],
            y: row["tvl"],
          });
        }
      }
    })
  );

  let series = [];
  series = [
    {
      label: "Ethereum V2 " + dataType,
      data: results_eth_v2,
    },
    {
      label: "Optimism V3 " + dataType,
      data: results_opt_v3,
    },
  ];

  const options = {
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
        stacked: true,
        ticks: {
          callback: (value) => "$" + compact(value, 2, true),
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
            return tooltipTitleDateTime(tooltipItems);
          },
          label: (tooltipItem) => {
            return tooltipLabelNumber(tooltipItem);
          },
        },
      },
    },
  };

  return <Graph series={series} options={options} />;
}

export default withErrorBoundary(MarketsChartLine);
