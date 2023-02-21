import {
  faChartBar,
  faChartArea,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Col, Row } from "reactstrap";
import IconTabs from "../../../../components/Tabs/IconTabs.js";
import { withErrorBoundary } from "../../../../hoc.js";
import TotalAtRiskAssetChart from "./TotalAtRiskAssetChart.js";

function TotalAtRiskAssetSection(props) {
  const [modalOpen, setModalOpen] = useState(false);
  const toggleModalOpen = () => setModalOpen(!modalOpen);

  return (
    <>
      <div>
        <Row>
          <Col xl={12}>
            <div className="d-flex flex-direction-row justify-content-left align-items-center">
              <h4 className="mr-4">collateral at risk </h4>
              <span role="button" className="link-primary" onClick={toggleModalOpen}>
                <FontAwesomeIcon icon={faInfoCircle} />
              </span>
            </div>
            <p className="gray">
              simulation of markets price drop (all assets fall for x% at the same
              time). When wallet reach health rate under 1, 50% or max 5M of debt
              position is liquidated.
            </p>
            <div className="d-flex flex-direction-row justify-content-end align-items-center"></div>

            <IconTabs
              tabs={[
                {
                  title: <FontAwesomeIcon icon={faChartArea} />,
                  content: <TotalAtRiskAssetChart chartType="line" />,
                },
                {
                  title: <FontAwesomeIcon icon={faChartBar} />,
                  content: <TotalAtRiskAssetChart chartType="bar" />,
                },
              ]}
              label="charts:"
            />
          </Col>
        </Row>
      </div>
    </>
  );
}

export default withErrorBoundary(TotalAtRiskAssetSection);
