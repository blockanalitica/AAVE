import React, { useState } from "react";
import LoadingOverlay from "react-loading-overlay";
import { useNavigate } from "react-router-dom";
import { Input } from "reactstrap";
import Loader from "../../../components/Loader/Loader.js";
import StatsBar from "../../../components/Stats/StatsBar.js";
import Value from "../../../components/Value/Value.js";
import { withErrorBoundary } from "../../../hoc.js";
import {
  useDidMountEffect,
  useFetch,
  usePageTitle,
  useQueryParams,
} from "../../../hooks";
import PositionsTable from "./components/PositionsTable.js";

function AtRisk(props) {
  const navigate = useNavigate();
  const queryParams = useQueryParams();

  usePageTitle("Positions at Risk Simulation");

  const queryParamDrop = queryParams.get("drop") || 5;
  const [drop, setDrop] = useState(queryParamDrop);

  useDidMountEffect(() => {
    const timer = setTimeout(() => {
      navigate(`?drop=${drop}`);
    }, 400);
    return () => clearTimeout(timer);
  }, [drop]);

  const { data, isLoading, isPreviousData, isError, ErrorFallbackComponent } = useFetch(
    "at-risk/info/",
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
    risky_debt_low: riskyDebtLow,
    risky_debt_high: riskyDebtHigh,
    risky_debt_medium: riskyDebtMedium,
    total_debt: riskyDebtTotal,
  } = data;
  const stats = [
    {
      title: "wallets at risk",
      bigValue: <Value value={walletsCount} decimals={0} />,
    },
    {
      title: "high risk debt",
      bigValue: <Value value={riskyDebtHigh || 0} decimals={2} prefix="$" compact />,
    },
    {
      title: "medium risk debt",
      bigValue: <Value value={riskyDebtMedium || 0} decimals={2} prefix="$" compact />,
    },
    {
      title: "low risk debt",
      bigValue: <Value value={riskyDebtLow || 0} decimals={2} prefix="$" compact />,
    },
    {
      title: "total debt at risk",
      bigValue: <Value value={riskyDebtTotal || 0} decimals={2} prefix="$" compact />,
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
      <h3 className="mb-4">positions at risk simulation</h3>
      <p>
        The table bellow shows positions that are at risk of being liquidated. The
        default price drop is set at 5%, meaning that we simulate the consequences of a
        general market price drop of 5% in steps of 1%. If a position is liquidated at
        x%, but his health rate is still bellow 1, we simulate another price drop of
        x+1% and liquidate his positions again.
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

      <PositionsTable drop={drop} />
    </>
  );
}

export default withErrorBoundary(AtRisk);
