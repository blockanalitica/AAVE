import { faChartArea, faChartLine } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Col, Row } from "reactstrap";
import IconTabs from "../../../components/Tabs/IconTabs.js";
import SideTabNav from "../../../components/SideTab/SideTabNav.js";
import { withErrorBoundary } from "../../../hoc.js";
import AbsoluteLiquidationScenario from "./AbsoluteLiquidationScenario.js";

function AbsoluteLiquidationScenarioTabs(props) {
  const [type, setType] = useState("collateral");
  const { slug } = props;
  return (
    <div>
      <Row>
        <Col md={9}>
          <IconTabs
            tabs={[
              {
                title: <FontAwesomeIcon icon={faChartLine} />,
                content: (
                  <AbsoluteLiquidationScenario type={type} sum="absolute" slug={slug} />
                ),
              },
              {
                title: <FontAwesomeIcon icon={faChartArea} />,
                content: (
                  <AbsoluteLiquidationScenario type={type} sum="bar" slug={slug} />
                ),
              },
            ]}
          />
        </Col>
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
      </Row>
    </div>
  );
}

export default withErrorBoundary(AbsoluteLiquidationScenarioTabs);
