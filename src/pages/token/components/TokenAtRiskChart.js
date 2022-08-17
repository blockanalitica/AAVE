import React from "react";
import Graph from "../../../components/Graph/Graph.js";
import Loader from "../../../components/Loader/Loader.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";
import { compact } from "../../../utils/number.js";

function TokenAtRiskChart(props) {
  const { slug, drop, isTokenCurrencyTotal, chartType } = props;

  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `aave/tokens/${slug}/at-risk/`
  );
  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  if (!data) {
    return <div>No data</div>;
  }

  const amounts = [];
  data.forEach((row) => {
    if (drop >= row["drop"]) {
      let y;
      if (isTokenCurrencyTotal) {
        if (chartType === "bar") {
          y = row["amount"];
        } else {
          y = row["total_amount"];
        }
      } else {
        if (chartType === "bar") {
          y = row["amount_usd"];
        } else {
          y = row["total_amount_usd"];
        }
      }

      amounts.push({ x: row["drop"], y: y });
    }
  });
  const series = [
    {
      data: amounts,
    },
  ];

  const options = {
    fill: true,
    interaction: {
      axis: "x",
    },
    scales: {
      x: {
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
        display: false,
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            return `At ${compact(tooltipItems[0].parsed.x, 2)}% market drop`;
          },
          label: (tooltipItem) => {
            let label = `Total ${slug} at risk: `;
            let info;

            if (tooltipItem.parsed.y !== null) {
              if (isTokenCurrencyTotal) {
                info = compact(tooltipItem.parsed.y, 2, true) + ` ${slug}`;
              } else {
                info = "$" + compact(tooltipItem.parsed.y, 2, true);
              }
              label += info;
            }
            return label;
          },
        },
      },
    },
  };

  return <Graph series={series} options={options} type={chartType} />;
}

export default withErrorBoundary(TokenAtRiskChart);
