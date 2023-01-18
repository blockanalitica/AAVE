import _ from "lodash";
import React from "react";
import Graph from "../../../../components/Graph/Graph.js";
import Loader from "../../../../components/Loader/Loader.js";
import { withErrorBoundary } from "../../../../hoc.js";
import { useFetch } from "../../../../hooks";
import { compact } from "../../../../utils/number.js";
import { tooltipLabelNumber, tooltipTitleDateTime } from "../../../../utils/graph.js";
import { parseUTCDateTime } from "../../../../utils/datetime.js";
import DateTimeAgo from "../../../../components/DateTime/DateTimeAgo.js";

function DebtAtRiskChart(props) {
  const { symbol, timePeriod } = props;

  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `markets/${symbol}/at-risk/protection-score/`,
    { days_ago: timePeriod }
  );
  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  if (!data) {
    return <div>No data</div>;
  }

  const { drops, last_updated } = data;

  let grouped;

  grouped = _.groupBy(drops, "drop");
  let series = [];

  Object.entries(grouped).forEach(([key, rows]) => {
    series.push({
      label: key + "%",
      data: rows.map((row) => {
        return {
          x: row.dt,
          y: row.total_amount_usd,
        };
      }),
    });
  });

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

  return (
    <>
      <Graph series={series} options={options} />
      <div className="d-flex flex-direction-row justify-content-end align-items-center">
        <small className="mb-3 justify-content-end">
          last updated: <DateTimeAgo dateTime={parseUTCDateTime(last_updated)} />
        </small>
      </div>
    </>
  );
}

export default withErrorBoundary(DebtAtRiskChart);
