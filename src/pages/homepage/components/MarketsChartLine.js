import React from "react";
import Graph from "../../../components/Graph/Graph.js";
import Loader from "../../../components/Loader/Loader.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";
import { tooltipLabelNumber, tooltipTitleDateTime } from "../../../utils/graph.js";
import { compact } from "../../../utils/number.js";
import _ from "lodash";

function MarketsChartLine(props) {
  const { timePeriod, dataType } = props;
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `aave/protocols/stats/`,
    { days_ago: timePeriod }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const results_avax_v2 = [];
  const results_eth_v2 = [];
  const results_opt_v3 = [];
  const results_arb_v3 = [];
  const results_eth_v3 = [];
  const grouped = _.groupBy(data.historic, "key");

  Object.entries(grouped).forEach(([key, rows]) =>
    rows.forEach((row) => {
      switch (dataType) {
        case "supply":
          switch (key) {
            case "ethereum":
              results_eth_v2.push({
                x: row["dt"],
                y: row["supply"],
              });
              break;
            case "optimism":
              results_opt_v3.push({
                x: row["dt"],
                y: row["supply"],
              });
              break;
            case "arbitrum":
              results_arb_v3.push({
                x: row["dt"],
                y: row["supply"],
              });
              break;
            case "ethereum_v3":
              results_eth_v3.push({
                x: row["dt"],
                y: row["supply"],
              });
              break;
            case "avalanche_v2":
              results_avax_v2.push({
                x: row["dt"],
                y: row["supply"],
              });
              break;
            default:
              break;
          }
          break;
        case "borrow":
          switch (key) {
            case "ethereum":
              results_eth_v2.push({
                x: row["dt"],
                y: row["borrow"],
              });
              break;
            case "optimism":
              results_opt_v3.push({
                x: row["dt"],
                y: row["borrow"],
              });
              break;
            case "arbitrum":
              results_arb_v3.push({
                x: row["dt"],
                y: row["borrow"],
              });
              break;
            case "ethereum_v3":
              results_eth_v3.push({
                x: row["dt"],
                y: row["borrow"],
              });
              break;
            case "avalanche_v2":
              results_avax_v2.push({
                x: row["dt"],
                y: row["borrow"],
              });
              break;
            default:
              break;
          }

          break;
        case "tvl":
          switch (key) {
            case "ethereum":
              results_eth_v2.push({
                x: row["dt"],
                y: row["tvl"],
              });
              break;
            case "optimism":
              results_opt_v3.push({
                x: row["dt"],
                y: row["tvl"],
              });
              break;
            case "arbitrum":
              results_arb_v3.push({
                x: row["dt"],
                y: row["tvl"],
              });
              break;
            case "ethereum_v3":
              results_eth_v3.push({
                x: row["dt"],
                y: row["tvl"],
              });
              break;
            case "avalanche_v2":
              results_avax_v2.push({
                x: row["dt"],
                y: row["tvl"],
              });
              break;
            default:
              break;
          }

          break;
        default:
          break;
      }
    })
  );

  let series = [];
  series = [
    {
      label: "Ethereum V2 " + dataType,
      data: results_eth_v2,
    },
    {
      label: "Optimism V3 " + dataType,
      data: results_opt_v3,
    },
    {
      label: "Arbitrum V3 " + dataType,
      data: results_arb_v3,
    },
    // Uncomment once Ethereum V3 is live
    // {
    //   label: "Ethereum V3 " + dataType,
    //   data: results_eth_v3,
    // },
    //{
    //  label: "Avalanche V2 " + dataType,
    //  data: results_avax_v2,
    //},
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

  return <Graph series={series} options={options} />;
}

export default withErrorBoundary(MarketsChartLine);
