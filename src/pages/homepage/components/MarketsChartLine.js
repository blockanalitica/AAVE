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
    `aave/protocols/stats/historic/`,
    { days_ago: timePeriod, data_type: dataType }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const results = {
    ethereum: [],
    optimism: [],
    arbitrum: [],
    ethereum_v3: [],
    avalanche_v2: [],
    avalanche_v3: [],
    polygon_v3: [],
  };
  data.reduce((acc, row) => {
    const key = row.key;
    const value = row[dataType];

    if (key in acc) {
      acc[key].push({
        x: row["dt"],
        y: value,
      });
    }

    return acc;
  }, results);

  let series = [
    {
      label: "Ethereum V2 " + dataType,
      data: results["ethereum"],
    },
    {
      label: "Optimism V3 " + dataType,
      data: results["optimism"],
    },
    {
      label: "Arbitrum V3 " + dataType,
      data: results["arbitrum"],
    },
    {
      label: "Ethereum V3 " + dataType,
      data: results["ethereum_v3"],
    },
    {
      label: "Avalanche V3 " + dataType,
      data: results["avalanche_v3"],
    },
    {
      label: "Avalanche V2 " + dataType,
      data: results["avalanche_v2"],
    },
    {
      label: "Polygon V3 " + dataType,
      data: results["polygon_v3"],
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
        beginAtZero: true,
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
    fill: true,
  };

  return <Graph series={series} options={options} />;
}

export default withErrorBoundary(MarketsChartLine);
