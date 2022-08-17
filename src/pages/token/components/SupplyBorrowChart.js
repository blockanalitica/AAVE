import React from "react";
import Graph from "../../../components/Graph/Graph.js";
import Loader from "../../../components/Loader/Loader.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";
import { tooltipLabelNumber, tooltipTitleDateTime } from "../../../utils/graph.js";
import { compact } from "../../../utils/number.js";

function SupplyBorrowChart(props) {
  const { slug, timePeriod, isTokenCurrencyTotal } = props;
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
  const tvl = [];
  data.forEach((row) => {
    let y_borrow = row.total_borrow_usd;
    let y_supply = row.total_supply_usd;
    let y_ltv = row.available_liquidity * row.underlying_price;
    if (isTokenCurrencyTotal) {
      y_borrow = row.total_borrow;
      y_supply = row.total_supply;
      y_ltv = row.available_liquidity;
    }
    borrow.push({
      x: row.dt,
      y: y_borrow,
    });
    supply.push({
      x: row.dt,
      y: y_supply,
    });
    tvl.push({
      x: row.dt,
      y: y_ltv,
    });
  });

  const series = [
    {
      label: "total supply",
      data: supply,
    },
    {
      label: "total borrow",
      data: borrow,
    },
    {
      label: "tvl",
      data: tvl,
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

export default withErrorBoundary(SupplyBorrowChart);
