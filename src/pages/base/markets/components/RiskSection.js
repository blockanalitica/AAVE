import React, { useState } from "react";
import { Button, Col, Row } from "reactstrap";
import { Link } from "react-router-dom";
import SideTabNav from "../../../../components/SideTab/SideTabNav.js";
import { withErrorBoundary } from "../../../../hoc.js";
import TokenAtRiskTab from "./TokenAtRiskTab.js";
import DepegTab from "./DepegTab.js";

function RiskSection(props) {
  const { symbol, isTokenCurrencyTotal } = props;
  const [type, setType] = useState("at-risk");

  let tabs = [{ id: "at-risk", text: "markets price drop" }];

  let content = null;
  if (type === "at-risk") {
    content = (
      <TokenAtRiskTab symbol={symbol} isTokenCurrencyTotal={isTokenCurrencyTotal} />
    );
  }
  let showPrice = true;
  const price_drop_market = ["USDC", "DAI"];
  if (symbol === "stETH") {
    tabs.push({ id: "depeg", text: `${symbol} price drop (depeg)` });
    showPrice = false;
  } else if (price_drop_market.includes(symbol)) {
    tabs.push({ id: "depeg", text: `${symbol} price drop` });
  }
  if (type === "depeg") {
    content = (
      <DepegTab
        symbol={symbol}
        showPrice={showPrice}
        isTokenCurrencyTotal={isTokenCurrencyTotal}
      />
    );
  }

  return (
    <div>
      <Row>
        <Col md={3}>
          <SideTabNav activeTab={type} toggleTab={setType} tabs={tabs} />
          <div className="text-center mb-4">
            <Link to={`wallets/`}>
              <Button color="primary">see all token positions</Button>
            </Link>
          </div>
        </Col>
        <Col md={9}>{content}</Col>
      </Row>
    </div>
  );
}

export default withErrorBoundary(RiskSection);
