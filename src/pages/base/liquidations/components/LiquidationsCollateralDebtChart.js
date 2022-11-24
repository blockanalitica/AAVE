import React from "react";
import Graph from "../../../../components/Graph/Graph.js";
import Loader from "../../../../components/Loader/Loader.js";
import { withErrorBoundary } from "../../../../hoc.js";
import { useFetch } from "../../../../hooks";
import { SYMBOLS_PALETTE } from "../../../../utils/colors.js";
import {
  barGraphSeriesCountLimiter,
  tooltipLabelNumberWithPercent,
} from "../../../../utils/graph.js";
import { compact } from "../../../../utils/number.js";
function LiquidationsCollateralDebtChart(props) {
  const { daysAgo, type } = props;
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    "liquidations/collateral-debt/",
    { type: type, days_ago: daysAgo }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  } else if (data.length === 0) {
    return <>No data</>;
  }

  const { series } = barGraphSeriesCountLimiter(data, "key", "value", 7, true);
  const backgroundColor = series[0]["data"].map((row) => {
    return SYMBOLS_PALETTE[row["x"]] || "#0e1726";
  });

  const newSeries = [
    {
      data: series[0]["data"],
      backgroundColor,
    },
  ];

  const options = {
    interaction: {
      axis: "x",
    },
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

  let description;
  let title;
  if (type === "collateral") {
    description =
      "shows distribution of bought collateral assets in the protocol for selected timeframe.";
    title = `collateral seized for last ${daysAgo} days`;
  } else if (type === "debt") {
    description =
      "shows distribution of repaid borrowed assets in the protocol for selected timeframe.";
    title = `debt repaid for last ${daysAgo} days`;
  }

  return (
    <>
      <h4>{title}</h4>
      <p className="gray">{description}</p>
      <Graph series={newSeries} options={options} type="bar" />
    </>
  );
}

export default withErrorBoundary(LiquidationsCollateralDebtChart);
