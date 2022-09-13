import React from "react";
import Card from "../../../components/Card/Card.js";
import Loader from "../../../components/Loader/Loader.js";
import Value from "../../../components/Value/Value.js";
import { useFetch } from "../../../hooks";
import StatsBar from "../../../components/Stats/StatsBar.js";

function InfoCard(props) {
  const { drop } = props;
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    "aave/risk/wallets-at-risk/info/",
    {
      drop: drop,
    }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const totalStats = [
    {
      title: "# of wallets",
      bigValue: <Value value={data.wallets_count} decimals={2} className="text-big" />,
    },
    {
      title: "total debt at risk",
      bigValue: (
        <Value
          value={data.total_debt}
          decimals={2}
          className="text-big"
          compact
          prefix="$"
        />
      ),
    },
    {
      title: "high risk debt",
      bigValue: (
        <Value
          value={data.risky_debt_high}
          decimals={2}
          className="text-big"
          compact
          prefix="$"
        />
      ),
    },
    {
      title: "medium risk debt",
      bigValue: (
        <Value
          value={data.risky_debt_medium}
          decimals={2}
          className="text-big"
          compact
        />
      ),
    },
    {
      title: "low risk debt",
      bigValue: (
        <Value
          value={data.risky_debt_low}
          decimals={2}
          className="text-big"
          compact
          prefix="$"
        />
      ),
    },
  ];

  return (
    <>
      <Card className="mb-4">
        <StatsBar stats={totalStats} cardTag="div" />
      </Card>
    </>
  );
}

export default InfoCard;
