import React, { useState } from "react";
import { Button, Col, Row } from "reactstrap";
import { Link } from "react-router-dom";
import SideTabNav from "../../../components/SideTab/SideTabNav.js";
import { withErrorBoundary } from "../../../hoc.js";
import TokenAtRiskSection from "./TokenAtRiskSection.js";
import DepegSection from "./DepegSection.js";

function RiskSection(props) {
  const { slug, isTokenCurrencyTotal } = props;
  const [type, setType] = useState("at-risk");

  let tabs = [{ id: "at-risk", text: "markets price drop" }];

  let content = null;
  if (type === "at-risk") {
    content = (
      <TokenAtRiskSection slug={slug} isTokenCurrencyTotal={isTokenCurrencyTotal} />
    );
  }

  let showPrice = true;

  const price_drop_market = ["USDC", "DAI"];

  if (slug === "stETH") {
    tabs.push({ id: "depeg", text: `${slug} price drop (depeg)` });
    showPrice = false;
  } else if (price_drop_market.includes(slug)) {
    tabs.push({ id: "depeg", text: `${slug} price drop` });
  }
  if (type === "depeg") {
    content = (
      <DepegSection
        slug={slug}
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
          <Row className="mb-4">
            <Col>
              <div className="text-center mb-4">
                <Link to={`/markets/${slug}/wallets/`} key={slug}>
                  <Button color="primary">see all token positions</Button>
                </Link>
              </div>
            </Col>
          </Row>
        </Col>
        <Col md={9}>{content}</Col>
      </Row>
    </div>
  );
}

export default withErrorBoundary(RiskSection);
