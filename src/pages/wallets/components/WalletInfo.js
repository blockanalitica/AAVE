import React from "react";
import Value from "../../../components/Value/Value.js";
import ValueChange from "../../../components/Value/ValueChange.js";
import { withErrorBoundary } from "../../../hoc.js";
import StatsBar from "../../../components/Stats/StatsBar.js";

function WalletInfo(props) {
  const { data } = props;
  if (!data) {
    return null;
  }
  let health_rate;
  if (data.stats.health_rate) {
    health_rate = <Value value={data.stats.health_rate} decimals={2} />;
  } else {
    health_rate = "-";
  }

  const stats = [
    {
      title: "supply",
      bigValue: (
        <Value value={data.stats.supply || 0} decimals={2} prefix="$" compact />
      ),
    },
    {
      title: "borrow",
      bigValue: (
        <Value value={data.stats.borrow || 0} decimals={2} prefix="$" compact />
      ),
    },
    {
      title: "account liquidity",
      bigValue: (
        <ValueChange
          value={data.stats.net_with_cf || 0}
          decimals={2}
          prefix="$"
          compact
          noPositive
        />
      ),
    },
    {
      title: "liquidation buffer",
      bigValue: (
        <ValueChange
          value={data.stats.net_with_lt || 0}
          decimals={2}
          prefix="$"
          compact
          noPositive
        />
      ),
    },
    {
      title: "health rate",
      bigValue: health_rate,
    },
  ];

  return <StatsBar className="mb-4" stats={stats} />;
}

export default withErrorBoundary(WalletInfo);
