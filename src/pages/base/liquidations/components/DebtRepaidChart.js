import React from "react";
import Graph from "../../../../components/Graph/Graph.js";
import Loader from "../../../../components/Loader/Loader.js";
import { withErrorBoundary } from "../../../../hoc.js";
import { useFetch } from "../../../../hooks";
import { tooltipFooterTotal, tooltipLabelNumber } from "../../../../utils/graph.js";
import { compact } from "../../../../utils/number.js";

function DebtRepaidChart(props) {
  const { daysAgo } = props;
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    "liquidations/debt-repaid/",
    { days_ago: daysAgo }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const series = [];
  Object.entries(data).forEach(([key, rows]) => {
    series.push({
      label: key,
      symbol: key,
      data: rows.map((row) => ({
        x: row["debt_symbol"],
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
      <div className="d-flex">
        <h4 className="flex-grow-1">
          collateral seized per debt asset for last {daysAgo} days
        </h4>
      </div>
      <p className="gray">
        shows which collateral was bought in liquidations per repaid borrowed asset for
        selected timeframe..
      </p>
      <Graph series={series} options={options} type="bar" />
    </>
  );
}

export default withErrorBoundary(DebtRepaidChart);
