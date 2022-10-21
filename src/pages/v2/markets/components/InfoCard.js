import React from "react";
import { Progress } from "reactstrap";
import Card from "../../../../components/Card/Card.js";
import Value from "../../../../components/Value/Value.js";
import { withErrorBoundary } from "../../../../hoc.js";
import StatsBar from "../../../../components/Stats/StatsBar.js";
import ValueChange from "../../../../components/Value/ValueChange.js";

function InfoCard(props) {
  const { data } = props;
  if (!data) {
    return null;
  }

  const { change = {} } = data;

  let progressLabel = "success";
  if (data.utilization_rate > 0.75) {
    progressLabel = "danger";
  } else if (data.utilization_rate > 0.5) {
    progressLabel = "warning";
  }

  let stable_borrow = "-";
  let stable_borrow_change = null;
  if (data.borrow_stable_apy) {
    stable_borrow = (
      <Value
        value={data.borrow_stable_apy * 100}
        decimals={2}
        suffix="%"
        className="text-big"
      />
    );
    stable_borrow_change = (
      <ValueChange
        value={(data.borrow_stable_apy - change.borrow_stable_apy) * 100}
        decimals={2}
        suffix="%"
        icon
        hideIfZero
        reverse
        tooltipValue={change.borrow_stable_apy * 100}
      />
    );
  }

  const totalStats = [
    {
      title: "LTV",
      bigValue: (
        <Value value={data.ltv * 100} decimals={2} suffix="%" className="text-big" />
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
      title: "supply APY",
      bigValue: (
        <Value
          value={data.supply_apy * 100}
          decimals={2}
          suffix="%"
          className="text-big"
          compact
        />
      ),
      smallValue: (
        <ValueChange
          value={(data.supply_apy - change.supply_apy) * 100}
          decimals={2}
          suffix="%"
          icon
          hideIfZero
          tooltipValue={change.supply_apy * 100}
        />
      ),
    },
    {
      title: "borrow APY",
      bigValue: (
        <Value
          value={data.borrow_variable_apy * 100}
          decimals={2}
          suffix="%"
          className="text-big"
          compact
        />
      ),
      smallValue: (
        <ValueChange
          value={(data.borrow_variable_apy - change.borrow_variable_apy) * 100}
          decimals={2}
          suffix="%"
          icon
          hideIfZero
          reverse
          tooltipValue={change.borrow_variable_apy * 100}
        />
      ),
    },
    {
      title: "borrow stable APY",
      bigValue: stable_borrow,
      smallValue: stable_borrow_change,
    },
    {
      title: "utilization",
      bigValue: (
        <>
          <Progress
            animated
            value={data.utilization_rate * 100}
            color={progressLabel}
          ></Progress>
          <Value value={data.utilization_rate * 100} decimals={2} suffix="%" />
        </>
      ),
      smallValue: (
        <ValueChange
          value={(data.utilization_rate - change.utilization_rate) * 100}
          decimals={2}
          suffix="%"
          icon
          hideIfZero
          reverse
          tooltipValue={change.utilization_rate * 100}
        />
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
