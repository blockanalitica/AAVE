import React from "react";
import Graph from "../../../components/Graph/Graph.js";
import Loader from "../../../components/Loader/Loader.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";
import { tooltipLabelNumber, tooltipTitleDateTime } from "../../../utils/graph.js";
import { compact } from "../../../utils/number.js";

function RateHistoryChart(props) {
  const { slug, timePeriod } = props;
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `/aave/tokens/${slug}/historic-details/`,
    { days_ago: timePeriod }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const borrow = [];
  const supply = [];
  data.forEach((row) => {
    borrow.push({
      x: row.dt,
      y: row.borrow_apy * 100,
    });
    supply.push({
      x: row.dt,
      y: row.supply_apy * 100,
    });
  });

  const series = [
    {
      label: "supply APY",
      data: supply,
    },
    {
      label: "borrow APY",
      data: borrow,
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
        stacked: false,
        ticks: {
          callback: (value) => compact(value, 2, true),
        },
      },
    },
    plugins: {
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

export default withErrorBoundary(RateHistoryChart);
