import React from "react";
import TabCard from "../../../components/TabCard/TabCard.js";
import { withErrorBoundary } from "../../../hoc.js";
import PositionDistributionChart from "./PositionDistributionChart.js";

function PositionDistributionCard(props) {
  const { token_address, symbol } = props;
  if (symbol && token_address) {
    return (
      <TabCard
        tabs={[
          {
            title: "Supply",
            content: (
              <PositionDistributionChart
                tokenAddress={token_address}
                symbol={symbol}
                position="supply"
              />
            ),
          },
          {
            title: "Borrow",
            content: (
              <PositionDistributionChart
                tokenAddress={token_address}
                symbol={symbol}
                position="borrow"
              />
            ),
          },
        ]}
      />
    );
  } else {
    return (
      <TabCard
        tabs={[
          {
            title: "Supply",
            content: <PositionDistributionChart position="supply" />,
          },
          {
            title: "Borrow",
            content: <PositionDistributionChart position="borrow" />,
          },
        ]}
      />
    );
  }
}

export default withErrorBoundary(PositionDistributionCard);
