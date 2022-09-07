import React from "react";
import { Col, Row } from "reactstrap";
import Card from "../../../components/Card/Card.js";
import Value from "../../../components/Value/Value.js";
import ValueChange from "../../../components/Value/ValueChange.js";
import StatsBar from "../../../components/Stats/StatsBar.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useNavigate } from "react-router-dom";

function TokenInfo(props) {
  const { data, isTokenCurrencyTotal } = props;
  const navigate = useNavigate();
  if (!data) {
    return null;
  }

  const { change = {} } = data;

  const onValueClick = (e, url) => {
    navigate(url);
    e.stopPropagation();
  };

  const totalStats = [
    {
      title: "tvl",
      bigValue: isTokenCurrencyTotal ? (
        <Value value={data.tvl} decimals={2} className="text-big" compact />
      ) : (
        <Value
          value={data.tvl_usd}
          decimals={2}
          prefix="$"
          className="text-big"
          compact
        />
      ),
      smallValue: isTokenCurrencyTotal ? (
        <ValueChange
          value={data.tvl - change.tvl}
          decimals={2}
          compact
          icon
          hideIfZero
          tooltipValue={change.tvl}
        />
      ) : (
        <ValueChange
          value={data.tvl_usd - change.tvl_usd}
          decimals={2}
          prefix="$"
          compact
          icon
          hideIfZero
          tooltipValue={change.tvl_usd}
        />
      ),
    },
    {
      title: "total supply",
      bigValue: isTokenCurrencyTotal ? (
        <Value value={data.total_supply} decimals={2} className="text-big" compact />
      ) : (
        <Value
          value={data.total_supply_usd}
          decimals={2}
          prefix="$"
          className="text-big"
          compact
        />
      ),
      smallValue: isTokenCurrencyTotal ? (
        <ValueChange
          value={data.total_supply - change.total_supply}
          decimals={2}
          compact
          icon
          hideIfZero
          tooltipValue={change.total_supply}
        />
      ) : (
        <ValueChange
          value={data.total_supply_usd - change.total_supply_usd}
          decimals={2}
          prefix="$"
          compact
          icon
          hideIfZero
          tooltipValue={change.total_supply_usd}
        />
      ),
    },
    {
      title: "total real supply",
      bigValue: isTokenCurrencyTotal ? (
        <Value value={data.net_supply} decimals={2} className="text-big" compact />
      ) : (
        <Value
          value={data.net_supply_usd}
          decimals={2}
          prefix="$"
          className="text-big"
          compact
        />
      ),
      smallValue: isTokenCurrencyTotal ? (
        <ValueChange
          value={data.net_supply - change.net_supply}
          decimals={2}
          compact
          icon
          hideIfZero
          tooltipValue={change.net_supply}
        />
      ) : (
        <ValueChange
          value={data.net_supply_usd - change.net_supply_usd}
          decimals={2}
          prefix="$"
          compact
          icon
          hideIfZero
          tooltipValue={change.net_supply_usd}
        />
      ),
    },

    {
      title: "total borrow",
      bigValue: isTokenCurrencyTotal ? (
        <Value value={data.total_borrow} decimals={2} className="text-big" compact />
      ) : (
        <Value
          value={data.total_borrow_usd}
          decimals={2}
          prefix="$"
          className="text-big"
          compact
        />
      ),
      smallValue: isTokenCurrencyTotal ? (
        <ValueChange
          value={data.total_borrow - change.total_borrow}
          decimals={2}
          compact
          icon
          hideIfZero
          tooltipValue={change.total_borrow}
        />
      ) : (
        <ValueChange
          value={data.total_borrow_usd - change.total_borrow_usd}
          decimals={2}
          prefix="$"
          compact
          icon
          hideIfZero
          tooltipValue={change.total_borrow_usd}
        />
      ),
    },
    {
      title: "total real borrow",
      bigValue: isTokenCurrencyTotal ? (
        <Value value={data.net_borrow} decimals={2} className="text-big" compact />
      ) : (
        <Value
          value={data.net_borrow_usd}
          decimals={2}
          prefix="$"
          className="text-big"
          compact
        />
      ),
      smallValue: isTokenCurrencyTotal ? (
        <ValueChange
          value={data.net_borrow - change.net_borrow}
          decimals={2}
          compact
          icon
          hideIfZero
          tooltipValue={change.net_borrow}
        />
      ) : (
        <ValueChange
          value={data.net_borrow_usd - change.net_borrow_usd}
          decimals={2}
          prefix="$"
          compact
          icon
          hideIfZero
          tooltipValue={change.net_borrow_usd}
        />
      ),
    },
  ];

  return (
    <>
      <Row>
        <Col xl={12}>
          <Card className="mb-4">
            <StatsBar
              stats={totalStats}
              cardTag="div"
              role="button"
              onClick={(e) => onValueClick(e, `wallets/`)}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default withErrorBoundary(TokenInfo);
