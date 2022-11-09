import _ from "lodash";
import React from "react";
import Graph from "../../../components/Graph/Graph.js";
import Loader from "../../../components/Loader/Loader.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";
import { parseUTCDateTimestamp } from "../../../utils/datetime.js";
import { tooltipLabelNumber, tooltipTitleDateTime } from "../../../utils/graph.js";
import { compact } from "../../../utils/number.js";

function TokenBackedHistoricShare(props) {
  const { slug, type, timePeriod, withLtv } = props;
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `/aave/tokens/${slug}/backed/history/share/`,
    { type: type, days_ago: timePeriod, with_ltv: withLtv, apply_ltv: 1 }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const grouped = _.groupBy(data, "key");
  const series = [];
  Object.entries(grouped).forEach(([key, rows]) => {
    series.push({
      label: key,
      symbol: key,
      data: rows.map((row) => ({
        x: parseUTCDateTimestamp(row["timestamp"]),
        y: row["share"],
      })),
    });
  });
  const options = {
    fill: true,
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
          callback: (value) => compact(value, 2, true) + "%",
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
            return tooltipLabelNumber(tooltipItem) + "%";
          },
        },
      },
    },
  };

  return <Graph series={series} type="line" options={options} />;
}

export default withErrorBoundary(TokenBackedHistoricShare);