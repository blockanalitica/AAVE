import React from "react";
import _ from "lodash";
import Graph from "../../../../components/Graph/Graph.js";
import Loader from "../../../../components/Loader/Loader.js";
import { withErrorBoundary } from "../../../../hoc.js";
import { useFetch } from "../../../../hooks";
import { tooltipLabelNumber, tooltipTitleDateTime } from "../../../../utils/graph.js";
import { compact } from "../../../../utils/number.js";

function DebtDropChartLine(props) {
  const { timePeriod } = props;
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `markets/total-stats/debt-drop/`,
    { days_ago: timePeriod }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const grouped = _.groupBy(data.results, "drop");

  const series = [];

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
          unit: timePeriod > 30 ? "day" : "hour",
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

export default withErrorBoundary(DebtDropChartLine);
