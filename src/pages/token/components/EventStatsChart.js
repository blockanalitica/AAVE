import React from "react";
import _ from "lodash";
import LoadingOverlay from "react-loading-overlay";
import Graph from "../../../components/Graph/Graph.js";
import Loader from "../../../components/Loader/Loader.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";
import { tooltipLabelNumber, tooltipTitleDateTime } from "../../../utils/graph.js";
import { compact } from "../../../utils/number.js";

function EventStatsChart(props) {
  const { symbol, timePeriod, isTokenCurrency, ...rest } = props;
  const { data, isLoading, isPreviousData, isError, ErrorFallbackComponent } = useFetch(
    `/aave/tokens/${symbol}/event-stats/`,
    { days_ago: timePeriod },
    { keepPreviousData: true }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  let grouped;
  grouped = _.groupBy(data, "event");
  const series = [];
  Object.entries(grouped).forEach(([key, rows]) => {
    let item = {
      label: key,
      data: rows.map((row) => ({
        x: row["dt"],
        y: row[isTokenCurrency ? "amount" : "amount_usd"],
      })),
      stack: ["Borrow", "Repay"].includes(key) ? "0" : "1",
    };
    series.push(item);
  });

  const options = {
    aspectRatio: 3,
    interaction: {
      axis: "x",
    },
    scales: {
      x: {
        stacked: true,
        type: "time",
        time: {
          unit: "day",
        },
      },
      y: {
        stacked: true,
        ticks: {
          callback: (value) => (!isTokenCurrency ? "$" : "") + compact(value, 2, true),
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            return tooltipTitleDateTime(tooltipItems, true, false);
          },
          label: (tooltipItem) => {
            return tooltipLabelNumber(
              tooltipItem,
              isTokenCurrency ? `${symbol} ` : "$"
            );
          },
        },
      },
    },
  };

  return (
    <div {...rest}>
      <LoadingOverlay active={isPreviousData} spinner>
        <Graph series={series} options={options} type="bar" />
      </LoadingOverlay>
    </div>
  );
}

export default withErrorBoundary(EventStatsChart);
