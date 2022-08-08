import React from "react";
import { Progress } from "reactstrap";
import Card from "../../../components/Card/Card.js";
import Value from "../../../components/Value/Value.js";
import { withErrorBoundary } from "../../../hoc.js";
import styles from "./InfoCard.module.scss";

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
  return (
    <Card>
      <div className={styles.list}>
        <ul className="text-center">
          <li className="mb-2">
            <div className="section-title">price</div>
            <Value
              value={data.underlying_price}
              decimals={2}
              prefix="$"
              className="text-big"
              compact100k
            />
          </li>
          <li className="mb-2">
            <div className="section-title">LTV</div>
            <Value
              value={data.collateral_factor * 100}
              decimals={2}
              suffix="%"
              className="text-big"
            />
          </li>
          <li className="mb-2">
            <div className="section-title">liquidation threshold</div>
            <Value
              value={data.liquidation_threshold * 100}
              decimals={2}
              suffix="%"
              className="text-big"
            />
          </li>
          <li className="mb-2">
            <div className="section-title">reserve factor</div>
            <Value
              value={data.reserve_factor * 100}
              decimals={2}
              suffix="%"
              className="text-big"
            />
          </li>
          <li className="mb-2">
            <div className="section-title">borrow stable APY</div>
            {stable_borrow}
          </li>
          <li className="mb-2">
            <div className="section-title">liquidation bonus</div>
            <Value
              value={(data.liquidation_incentive - 1) * 100}
              decimals={2}
              suffix="%"
              className="text-big"
            />
          </li>

          <li>
            <div className="section-title">utilization</div>
            <Progress
              animated
              value={data.utilization_rate * 100}
              color={progressLabel}
              className={styles.progress}
            ></Progress>
            <Value value={data.utilization_rate * 100} decimals={2} suffix="%" />
          </li>
        </ul>
      </div>
    </Card>
  );
}

export default withErrorBoundary(InfoCard);
