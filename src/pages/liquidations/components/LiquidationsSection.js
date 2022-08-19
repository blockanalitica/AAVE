import { Col, Row } from "reactstrap";
import React, { useState } from "react";
import SideTabNav from "../../../components/SideTab/SideTabNav.js";

import { withErrorBoundary } from "../../../hoc.js";
import { useQueryParams } from "../../../hooks.js";
import LiquidationShares from "./LiquidationShares.js";
import CollateralSeizedChart from "./CollateralSeizedChart.js";
import LiquidationsBarChart from "./LiquidationsBarChart.js";

function LiquidationsSection(props) {
  const { daysAgo, results } = props;

  const queryParams = useQueryParams();

  const qParams = {
    tab: queryParams.get("tab") || "liquidations",
  };

  const [activeTab, setActiveTab] = useState(qParams.tab);

  let content;

  if (activeTab === "liquidations") {
    content = <LiquidationsBarChart results={results} daysAgo={daysAgo} />;
  } else if (activeTab === "collateral_sized") {
    content = <CollateralSeizedChart daysAgo={daysAgo} />;
  } else {
    content = <LiquidationShares type={activeTab} daysAgo={daysAgo} />;
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
            { id: "top_ten", text: "top 10 liquidators" },
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
