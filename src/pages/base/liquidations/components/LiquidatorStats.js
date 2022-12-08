import React from "react";
import Loader from "../../../../components/Loader/Loader.js";
import Value from "../../../../components/Value/Value.js";
import { withErrorBoundary } from "../../../../hoc.js";
import { useFetch } from "../../../../hooks";
import StatsBar from "../../../../components/Stats/StatsBar.js";
import WalletOrZapper from "../../../../components/Other/WalletOrZapper.js";

function LiquidatorStats(props) {
  const { address, daysAgo } = props;
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `liquidations/liquidators/${address}/stats/`,
    { days_ago: daysAgo }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const statsCard = [
    {
      title: "address",
      bigValue: <WalletOrZapper address={address} isZapper key={address} />,
    },
    {
      title: "liquidations",
      bigValue: <Value value={data.count} decimals={0} />,
    },
    {
      title: "debt repaid",
      bigValue: <Value value={data.total_debt} decimals={2} prefix="$" compact />,
    },
    {
      title: "collateral seized",
      bigValue: <Value value={data.total_collateral} decimals={2} prefix="$" compact />,
    },
    {
      title: "liquidation bonus",
      bigValue: <Value value={data.total_profits} decimals={2} prefix="$" compact />,
    },
  ];
  return <StatsBar stats={statsCard} />;
}

export default withErrorBoundary(LiquidatorStats);
