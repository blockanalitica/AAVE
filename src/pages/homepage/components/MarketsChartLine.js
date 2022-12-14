import React from "react";
import Graph from "../../../components/Graph/Graph.js";
import Loader from "../../../components/Loader/Loader.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";
import { tooltipLabelNumber, tooltipTitleDateTime } from "../../../utils/graph.js";
import { compact } from "../../../utils/number.js";

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
  data.historic.forEach((row) => {
    if (dataType === "supply") {
      results_eth_v2.push({
        x: row.dt_eth_v2,
        y: row.supply_eth_v2,
      });

      results_opt_v3.push({
        x: row.dt_opt_v3,
        y: row.supply_opt_v3,
      });
    }

    if (dataType === "borrow") {
      results_eth_v2.push({
        x: row.dt_eth_v2,
        y: row.borrow_eth_v2,
      });

      results_opt_v3.push({
        x: row.dt_opt_v3,
        y: row.borrow_opt_v3,
      });
    }
    if (dataType === "tvl") {
      results_eth_v2.push({
        x: row.dt_eth_v2,
        y: row.tvl_eth_v2,
      });

      results_opt_v3.push({
        x: row.dt_opt_v3,
        y: row.tvl_opt_v3,
      });
    }
  });
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
