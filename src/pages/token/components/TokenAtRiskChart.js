import _ from "lodash";
import React from "react";
import Graph from "../../../components/Graph/Graph.js";
import Loader from "../../../components/Loader/Loader.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";
import { compact } from "../../../utils/number.js";
import { tooltipLabelNumber } from "../../../utils/graph.js";
import { parseUTCDateTime } from "../../../utils/datetime.js";
import DateTimeAgo from "../../../components/DateTime/DateTimeAgo.js";

function TokenAtRiskChart(props) {
  const { slug, drop, isTokenCurrencyTotal, chartType } = props;

  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `aave/tokens/${slug}/at-risk/protection-score/`
  );
  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  if (!data) {
    return <div>No data</div>;
  }

  let y;
  if (isTokenCurrencyTotal) {
    if (chartType === "bar") {
      y = "amount";
    } else {
      y = "total_amount";
    }
  } else {
    if (chartType === "bar") {
      y = "amount_usd";
    } else {
      y = "total_amount_usd";
    }
  }

  const { results, last_updated } = data;

  let grouped;
  grouped = _.groupBy(results, "protection_score");
  const series = [];
  Object.entries(grouped).forEach(([key, rows]) => {
    let item = {
      label: key + " risk",
      protection_score: key,
      data: rows.map((row) =>
        row.drop <= drop
          ? {
              x: row["drop"],
              y: row[y],
            }
          : true
      ),
    };
    series.push(item);
  });

  const options = {
    fill: true,
    interaction: {
      axis: "x",
    },
    scales: {
      x: {
        stacked: true,
        type: "linear",
        ticks: {
          callback: (value) => `-${value}%`,
        },
        title: {
          display: true,
          text: "markets price drop",
        },
      },
      y: {
        stacked: true,
        ticks: {
          callback: (value) => {
            if (isTokenCurrencyTotal) {
              return compact(value, 2, true) + ` ${slug}`;
            } else {
              return "$" + compact(value, 2, true);
            }
          },
        },
        title: {
          display: true,
          text: `${slug} seized`,
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
            return `At ${tooltipItems[0].parsed.x}% markets price drop`;
          },
          label: (tooltipItem) => {
            if (isTokenCurrencyTotal) {
              return tooltipLabelNumber(tooltipItem, null, ` ${slug}`);
            } else {
              return tooltipLabelNumber(tooltipItem, "$");
            }
          },
          footer: (tooltipItems) => {
            const total = tooltipItems.reduce(
              (total, tooltip) => total + tooltip.parsed.y,
              0
            );
            return "Total: $" + compact(total, 2, true);
          },
        },
      },
    },
  };

  return (
    <>
      <Graph series={series} options={options} type={chartType} />
      <div className="d-flex flex-direction-row justify-content-end align-items-center">
        <small className="mb-3 justify-content-end">
          last updated: <DateTimeAgo dateTime={parseUTCDateTime(last_updated)} />
        </small>
      </div>
    </>
  );
}

export default withErrorBoundary(TokenAtRiskChart);
