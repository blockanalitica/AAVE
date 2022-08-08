import React from "react";
import Graph from "../../../components/Graph/Graph.js";
import Loader from "../../../components/Loader/Loader.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";
import { tooltipLabelNumberWithPercent } from "../../../utils/graph.js";
import { compact } from "../../../utils/number.js";
import { SYMBOLS_PALETTE } from "../../../utils/colors.js";

function TokenBackedChart(props) {
  const { slug, type } = props;

  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `aave/tokens/${slug}/backed/`,
    { type }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  if (!data || data.length === 0) {
    return <>No data</>;
  }
  let backgroundColors = [];

  data.forEach((row) => {
    backgroundColors.push(SYMBOLS_PALETTE[row["symbol"]]);
  });

  const series = [
    {
      data: data.map((row) => ({
        symbol: row["symbol"],
        x: row["symbol"],
        y: row["amount_usd"],
      })),
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

  return <Graph series={series} type="bar" options={options} />;
}

export default withErrorBoundary(TokenBackedChart);
