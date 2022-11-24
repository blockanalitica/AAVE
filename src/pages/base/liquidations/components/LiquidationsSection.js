import React, { useState } from "react";
import { Col, Row } from "reactstrap";
import SideTabNav from "../../../../components/SideTab/SideTabNav.js";

import { withErrorBoundary } from "../../../../hoc.js";
import { useQueryParams } from "../../../../hooks.js";
import DebtRepaidChart from "./DebtRepaidChart.js";
import LiquidationsChart from "./LiquidationsChart.js";
import LiquidationsCollateralDebtChart from "./LiquidationsCollateralDebtChart.js";
import LiquidatorsTop10Chart from "./LiquidatorsTop10Chart.js";
function LiquidationsSection(props) {
  const { daysAgo, results } = props;

  const queryParams = useQueryParams();

  const qParams = {
    tab: queryParams.get("tab") || "liquidations",
  };

  const [activeTab, setActiveTab] = useState(qParams.tab);

  let content;

  if (activeTab === "liquidations") {
    content = <LiquidationsChart results={results} daysAgo={daysAgo} />;
  } else if (activeTab === "collateral_sized") {
    content = <DebtRepaidChart daysAgo={daysAgo} />;
  } else if (activeTab === "liquidators") {
    content = <LiquidatorsTop10Chart daysAgo={daysAgo} />;
  } else {
    content = <LiquidationsCollateralDebtChart type={activeTab} daysAgo={daysAgo} />;
  }

  return (
    <Row>
      <Col md={3}>
        <SideTabNav
          activeTab={activeTab}
          toggleTab={setActiveTab}
          tabs={[
            { id: "liquidations", text: "liquidations" },
            { id: "collateral_sized", text: "collateral seized per debt asset" },
            { id: "collateral", text: "collateral seized" },
            { id: "debt", text: "debt repaid" },
            { id: "liquidators", text: "top 10 liquidators" },
          ]}
        />
      </Col>
      <Col md={9}>
        <>{content}</>
      </Col>
    </Row>
  );
}

export default withErrorBoundary(LiquidationsSection);
