import React from "react";
import Value from "../../../components/Value/Value.js";
import { withErrorBoundary } from "../../../hoc.js";
import StatsBar from "../../../components/Stats/StatsBar.js";

function LiquidationsInfo(props) {
  const { stats } = props;

  const statsCard = [
    {
      title: "Liquidations",
      bigValue: <Value value={stats.count} decimals={0} />,
    },
    {
      title: "Collateral seized",
      bigValue: (
        <Value value={stats.collateral_seized} decimals={2} prefix="$" compact />
      ),
    },
    {
      title: "Debt repaid",
      bigValue: <Value value={stats.debt_repaid} decimals={2} prefix="$" compact />,
    },
    {
      title: "Incentives",
      bigValue: (
        <Value
          value={stats.collateral_seized - stats.debt_repaid}
          decimals={2}
          prefix="$"
          compact
        />
      ),
    },
  ];
  return <StatsBar stats={statsCard} />;
}

export default withErrorBoundary(LiquidationsInfo);
