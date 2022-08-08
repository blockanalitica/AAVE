import React from "react";
import Graph from "../../../components/Graph/Graph.js";
import Loader from "../../../components/Loader/Loader.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";
import {
  tooltipLabelNumberWithPercent,
  barGraphSeriesCountLimiter,
} from "../../../utils/graph.js";
import { compact } from "../../../utils/number.js";
import { SYMBOLS_PALETTE } from "../../../utils/colors.js";

function MarketsChartBar(props) {
  const { dataType } = props;

  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `aave/tokens/market-share/`,
    { type: dataType }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const { results } = data;

  if (!results || results.length === 0) {
    return <>No data</>;
  }

  const { series } = barGraphSeriesCountLimiter(results, "symbol", "amount_usd", 10);
  const backgroundColors = series[0]["data"].map((row) => {
    return SYMBOLS_PALETTE[row["x"]] || "#0e1726";
  });

  const newSeries = [
    {
      data: series[0]["data"],
      backgroundColor: backgroundColors,
    },
  ];

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

  return <Graph series={newSeries} type="bar" options={options} />;
}

export default withErrorBoundary(MarketsChartBar);
