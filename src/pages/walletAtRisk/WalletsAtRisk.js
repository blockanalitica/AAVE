import React, { useState } from "react";
import { Input } from "reactstrap";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";
import { useFetch, usePageTitle, useQueryParams, useDidMountEffect } from "../../hooks";
import { withErrorBoundary } from "../../hoc.js";
import WalletsAtRiskTable from "./components/WalletsAtRiskTable.js";
import Loader from "../../components/Loader/Loader.js";
import StatsBar from "../../components/Stats/StatsBar.js";
import Value from "../../components/Value/Value.js";

function WalletsAtRisk(props) {
  const navigate = useNavigate();
  const queryParams = useQueryParams();

  usePageTitle("Wallets at Risk Simulation");

  const queryParamDrop = queryParams.get("drop") || 5;
  const [drop, setDrop] = useState(queryParamDrop);

  useDidMountEffect(() => {
    const timer = setTimeout(() => {
      navigate(`?drop=${drop}`);
    }, 400);
    return () => clearTimeout(timer);
  }, [drop]);

  const { data, isLoading, isPreviousData, isError, ErrorFallbackComponent } = useFetch(
    "aave/risk/wallets-at-risk/info/",
    {
      drop: queryParamDrop,
    },
    { keepPreviousData: true }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }
  const {
    wallets_count: walletsCount,
    risky_collateral: riskyCollateral,
    risky_debt: riskyDebt,
  } = data;
  const stats = [
    {
      title: "wallets at risk",
      bigValue: <Value value={walletsCount} decimals={0} />,
    },
    {
      title: "collateral at risk",
      bigValue: <Value value={riskyCollateral || 0} decimals={2} prefix="$" compact />,
    },
    {
      title: "debt at risk",
      bigValue: <Value value={riskyDebt || 0} decimals={2} prefix="$" compact />,
    },
  ];

  const onDropChange = (drop) => {
    if (drop < 0) {
      drop = 0;
    } else if (drop > 50) {
      drop = 50;
    }
    setDrop(drop);
  };

  return (
    <>
      <h3 className="mb-4">wallets at risk simulation</h3>
      <p>
        The table bellow shows wallets that are at risk of being liquidated. The default
        price drop is set at 5%, meaning that we simulate the consequences of a general
        market price drop of 5% in steps of 1%. If a wallet is liquidated at x%, but his
        health rate is still bellow 1, we simulate another price drop of x+1% and
        liquidate his positions again.
      </p>
      <p>
        Click on an address to see a more detailed breakdown of the wallets positions
        and simulated liquidations.
      </p>

      <LoadingOverlay active={isPreviousData} spinner>
        <StatsBar className="mb-4" stats={stats} />

        <div className="mb-4 d-flex align-items-center">
          <span>Adjust price drop:</span>
          <Input
            id="drop"
            min={0}
            max={50}
            type="number"
            value={drop}
            className="mx-2"
            style={{ width: "5rem" }}
            onChange={(e) => onDropChange(e.target.value)}
          />
          %
        </div>
      </LoadingOverlay>

      <WalletsAtRiskTable drop={drop} />
    </>
  );
}

export default withErrorBoundary(WalletsAtRisk);
