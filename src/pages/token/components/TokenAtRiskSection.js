import { faChartBar, faChartLine } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Col, Row } from "reactstrap";
import IconTabs from "../../../components/Tabs/IconTabs.js";
import { withErrorBoundary } from "../../../hoc.js";
import TokenAtRiskChart from "./TokenAtRiskChart.js";
import TimeSwitch from "../../../components/TimeSwitch/TimeSwitch.js";

function TokenAtRiskSection(props) {
  const { slug, isTokenCurrencyTotal } = props;

  const [drop, setDrop] = useState(80);

  const dropOptions = [
    { key: 5, value: "5%" },
    { key: 10, value: "10%" },
    { key: 25, value: "25%" },
    { key: 50, value: "50%" },
    { key: 80, value: "80%" },
  ];

  let description;

  description =
    "Simulation of collateral assets to be sold in liquidations after certain price drops.";

  return (
    <div>
      <Row>
        <Col xl={12}>
          <h4>{slug} at risk</h4>
          {description}
          <div className="d-flex flex-direction-row justify-content-end align-items-center">
            <TimeSwitch
              className="mb-3 justify-content-end"
              label="drop:"
              activeOption={drop}
              onChange={setDrop}
              options={dropOptions}
            />
          </div>

          <IconTabs
            tabs={[
              {
                title: <FontAwesomeIcon icon={faChartLine} />,
                content: (
                  <TokenAtRiskChart
                    slug={slug}
                    drop={drop}
                    chartType="line"
                    isTokenCurrencyTotal={isTokenCurrencyTotal}
                  />
                ),
              },
              {
                title: <FontAwesomeIcon icon={faChartBar} />,
                content: (
                  <TokenAtRiskChart
                    slug={slug}
                    drop={drop}
                    chartType="bar"
                    isTokenCurrencyTotal={isTokenCurrencyTotal}
                  />
                ),
              },
            ]}
            label="charts:"
          />
        </Col>
      </Row>
    </div>
  );
}

export default withErrorBoundary(TokenAtRiskSection);
