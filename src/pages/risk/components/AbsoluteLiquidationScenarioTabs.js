import { faChartArea, faChartLine } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Col, Row } from "reactstrap";
import IconTabs from "../../../components/Tabs/IconTabs.js";
import SideTabNav from "../../../components/SideTab/SideTabNav.js";
import { withErrorBoundary } from "../../../hoc.js";
import AbsoluteLiquidationScenarios from "./AbsoluteLiquidationScenarios.js";

function AbsoluteLiquidationScenarioTabs(props) {
  const [type, setType] = useState("collateral");

  return (
    <div>
      <Row>
        <Col md={3}>
          <SideTabNav
            activeTab={type}
            toggleTab={setType}
            tabs={[
              { id: "collateral", text: "Collateral" },
              { id: "debt", text: "Debt" },
            ]}
          />
        </Col>
        <Col md={9}>
          <IconTabs
            tabs={[
              {
                title: <FontAwesomeIcon icon={faChartLine} />,
                content: <AbsoluteLiquidationScenarios type={type} sum="absolute" />,
              },
              {
                title: <FontAwesomeIcon icon={faChartArea} />,
                content: <AbsoluteLiquidationScenarios type={type} sum="bar" />,
              },
            ]}
          />
        </Col>
      </Row>
    </div>
  );
}

export default withErrorBoundary(AbsoluteLiquidationScenarioTabs);
