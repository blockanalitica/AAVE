import {
  faChartBar,
  faChartArea,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Col, Row, Modal, ModalHeader, ModalBody } from "reactstrap";
import IconTabs from "../../../components/Tabs/IconTabs.js";
import { withErrorBoundary } from "../../../hoc.js";
import TotalAtRiskChart from "./TotalAtRiskChart.js";
import TimeSwitch from "../../../components/TimeSwitch/TimeSwitch.js";

function TotalAtRiskSection(props) {
  const [drop, setDrop] = useState(80);
  const [modalOpen, setModalOpen] = useState(false);
  const toggleModalOpen = () => setModalOpen(!modalOpen);

  const dropOptions = [
    { key: 5, value: "5%" },
    { key: 10, value: "10%" },
    { key: 25, value: "25%" },
    { key: 50, value: "50%" },
    { key: 80, value: "80%" },
  ];

  let description;

  description =
    "simulation of markets price drop (all assets fall for x% at the same time). When wallet reach health rate under 1, 50% or max 5M of debt position is liquidated.";

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
            <p className="gray">{description}</p>
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
                  title: <FontAwesomeIcon icon={faChartArea} />,
                  content: <TotalAtRiskChart drop={drop} chartType="line" />,
                },
                {
                  title: <FontAwesomeIcon icon={faChartBar} />,
                  content: <TotalAtRiskChart drop={drop} chartType="bar" />,
                },
              ]}
              label="charts:"
            />
          </Col>
        </Row>
      </div>
      <Modal isOpen={modalOpen} toggle={toggleModalOpen}>
        <ModalHeader toggle={toggleModalOpen}>Wallet Protection Score</ModalHeader>
        <ModalBody>
          <p>
            For Aave wallets, we look at multiple facets of a wallet position, both
            current state and historical behavior:
            <ul>
              <li>
                price drop percentage in volatile assets a wallet could experience
                without any proactive health factor increase -{" "}
                <strong>liquidatable price drop percentage</strong>
              </li>
              <li>
                wallet's historical protections. An individual protection is defined as
                a wallet's occurrence where the wallet owner prevented a liquidation by
                increasing their wallet’s health factor (deposit, repay, etc.) -{" "}
                <strong>number of historical liquidation protections</strong>
              </li>
              <li>
                number of transactions in the last 7 days -{" "}
                <strong>number of 7 day transactions</strong>
              </li>
              <li>
                for pure stETH recursive positions (only stETH in supply and ETH in
                borrow) we compute the additional stETH:ETH depeg percentage that a
                wallet could experience without any proactive increase in its health
                factor - <strong>additional stETH discount percentage buffer</strong>
              </li>
              <li>
                <strong>number of historical liquidations</strong>
              </li>
            </ul>
          </p>

          <p>
            <strong>Low risk</strong> wallets are defined as:
            <ul>
              <li>(liquidatable price drop percentage >= 50%</li>
              <li>OR number of historical liquidation protections >= 5</li>
              <li>OR number of 7 day transactions >= 10)</li>
              <li>AND no historical liquidations</li>
            </ul>
          </p>
          <p>
            If the conditions for a low risk wallet are not met, the wallet can then
            either be scored as Medium risk or High risk.
          </p>
          <p>
            <strong>Medium risk</strong> wallets are defined as:
            <ul>
              <li>(liquidatable price drop percentage >= 30%</li>
              <li>OR number of historical liquidation protections >= 3</li>
              <li>OR number of 7 day transactions >= 5)</li>
              <li>AND no historical liquidations</li>
            </ul>
          </p>
          <p>
            If the conditions for neither a Low risk wallet nor a Medium risk wallet are
            met, the wallet is scored as <strong>High risk</strong> wallet.
          </p>
        </ModalBody>
      </Modal>
    </>
  );
}

export default withErrorBoundary(TotalAtRiskSection);
