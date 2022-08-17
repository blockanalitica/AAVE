import React from "react";
import { Progress } from "reactstrap";
import Card from "../../../components/Card/Card.js";
import Value from "../../../components/Value/Value.js";
import { withErrorBoundary } from "../../../hoc.js";
import styles from "./InfoCard.module.scss";
import StatsBar from "../../../components/Stats/StatsBar.js";

function InfoCard(props) {
  const { data } = props;
  if (!data) {
    return null;
  }

  let progressLabel = "success";
  if (data.utilization > 0.8) {
    progressLabel = "danger";
  } else if (data.utilization > 0.7) {
    progressLabel = "warning";
  }

  let stable_borrow = "-";
  if (data.borrow_stable_apy) {
    stable_borrow = (
      <Value
        value={data.borrow_stable_apy}
        decimals={2}
        suffix="%"
        className="text-big"
      />
    );
  }

  const totalStats = [
    {
      title: "price",
      bigValue: (
        <Value
          value={data.underlying_price}
          decimals={2}
          prefix="$"
          className="text-big"
          compact100k
        />
      ),
    },
    {
      title: "LTV",
      bigValue: (
        <Value
          value={data.collateral_factor * 100}
          decimals={2}
          suffix="%"
          className="text-big"
        />
      ),
    },
    {
      title: "liquidation threshold",
      bigValue: (
        <Value
          value={data.liquidation_threshold * 100}
          decimals={2}
          suffix="%"
          className="text-big"
        />
      ),
    },
    {
      title: "reserve factor",
      bigValue: (
        <Value
          value={data.reserve_factor * 100}
          decimals={2}
          suffix="%"
          className="text-big"
        />
      ),
    },
    {
      title: "borrow stable APY",
      bigValue: stable_borrow,
    },
    {
      title: "utilization",
      bigValue: (
        <>
          <Progress
            animated
            value={data.utilization_rate * 100}
            color={progressLabel}
            className={styles.progress}
          ></Progress>
          <Value value={data.utilization_rate * 100} decimals={2} suffix="%" />
        </>
      ),
    },
  ];
  return (
    <Card>
      <StatsBar stats={totalStats} cardTag="div" />
    </Card>
  );
}

export default withErrorBoundary(InfoCard);
