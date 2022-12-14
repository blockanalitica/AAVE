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
    `aave/protocols/total-stats/`,
    { days_ago: timePeriod }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const results = [];
  const real_results = [];
  data.results.forEach((row) => {
    if (dataType === "supply") {
      results.push({
        x: row.dt,
        y: row.supply,
      });
      real_results.push({
        x: row.dt,
        y: row.real_supply,
      });
    }
    if (dataType === "borrow") {
      results.push({
        x: row.dt,
        y: row.borrow,
      });
      real_results.push({
        x: row.dt,
        y: row.real_borrow,
      });
    }
    if (dataType === "tvl") {
      results.push({
        x: row.dt,
        y: row.supply - row.borrow,
      });
    }
  });
  let series = [];
  if (dataType === "tvl") {
    series = [
      {
        label: dataType,
        data: results,
      },
    ];
  } else {
    series = [
      {
        label: dataType,
        data: results,
      },
      {
        label: "real " + dataType,
        data: real_results,
      },
    ];
  }
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
