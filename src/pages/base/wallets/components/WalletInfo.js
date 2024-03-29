import React from "react";
import { Badge, UncontrolledTooltip } from "reactstrap";
import Value from "../../../../components/Value/Value.js";
import ValueChange from "../../../../components/Value/ValueChange.js";
import { withErrorBoundary } from "../../../../hoc.js";
import StatsBar from "../../../../components/Stats/StatsBar.js";

function WalletInfo(props) {
  let { data } = props;
  if (!data) {
    data = {};
  }
  let health_rate;
  if (data.health_rate) {
    health_rate = <Value value={data.health_rate} decimals={2} />;
  } else {
    health_rate = "-";
  }

  const badgeColorMap = {
    low: "success",
    medium: "warning",
    high: "danger",
  };

  const stats = [
    {
      title: "supply",
      bigValue: <Value value={data.supply || 0} decimals={2} prefix="$" compact />,
    },
    {
      title: "borrow",
      bigValue: <Value value={data.borrow || 0} decimals={2} prefix="$" compact />,
    },
    {
      title: "account liquidity",
      bigValue: (
        <ValueChange
          value={data.account_liquidity || 0}
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
          value={data.liquidation_buffer || 0}
          decimals={2}
          prefix="$"
          compact
          noPositive
        />
      ),
    },
    {
      title: "health rate",
      bigValue: (
        <div className="d-flex align-items-center">
          <div className="flex-grow-1">{health_rate}</div>
          {data.user_mode === 1 ? (
            <Badge style={{ fontSize: "0.8rem" }} color="primary">
              e-mode
            </Badge>
          ) : null}
        </div>
      ),
    },
    {
      title: "risk",
      bigValue: (
        <div className="lh-sm">
          {data.protection_score ? (
            <Badge
              style={{ fontSize: "0.8rem" }}
              id="riskBadge"
              color={badgeColorMap[data.protection_score.protection_score]}
              className="align-middle"
            >
              {data.protection_score.protection_score} risk
            </Badge>
          ) : (
            "-"
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <StatsBar className="mb-4" stats={stats} />
      {data.protection_score ? (
        <UncontrolledTooltip placement="bottom" target="riskBadge">
          {Object.entries(data.protection_score).map(([key, value]) => (
            <div key={key} className="text-start">
              <span className="gray">{key}</span>: {value}
            </div>
          ))}
        </UncontrolledTooltip>
      ) : null}
    </>
  );
}

export default withErrorBoundary(WalletInfo);
