import React from "react";
import Graph from "../../../../components/Graph/Graph.js";
import Loader from "../../../../components/Loader/Loader.js";
import { withErrorBoundary } from "../../../../hoc.js";
import { useFetch } from "../../../../hooks";
import { compact } from "../../../../utils/number.js";
import { SYMBOLS_PALETTE } from "../../../../utils/colors.js";

function TokenBackedSankey(props) {
  const { symbol, type } = props;
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `markets/${symbol}/backed/history/share/`,
    type === "collateral"
      ? { days_ago: 7, with_ltv: undefined, apply_ltv: undefined, type: type }
      : { days_ago: 7, with_ltv: 0, apply_ltv: 1, type: type }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  var sankeyData = [];
  var existingKeys = [];
  data.forEach((row) => {
    if (!existingKeys.includes(row["key"])) {
      sankeyData.push({
        to: row["key"],
        // hack for showing the flow from WETH -> WETH otherwise the flow doesn't exist
        from: symbol + " ",
        flow: row["amount"],
      });
    }
    existingKeys.push(row["key"]);
  });

  function getColor(symbol) {
    return SYMBOLS_PALETTE[symbol.trim()] || "#0e1726";
  }

  const series = [
    {
      data: sankeyData,
      colorFrom: (c) => getColor(c.dataset.data[c.dataIndex].from),
      colorTo: (c) => getColor(c.dataset.data[c.dataIndex].to),
    },
  ];

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const item = tooltipItem.dataset.data[tooltipItem.dataIndex];
            return item.from + " -> " + item.to + " : " + compact(item.flow);
          },
        },
      },
    },
  };

  return <Graph series={series} options={options} type="sankey" />;
}

export default withErrorBoundary(TokenBackedSankey);
