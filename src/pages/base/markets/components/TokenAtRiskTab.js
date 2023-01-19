import {
  faChartBar,
  faChartArea,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import IconTabs from "../../../../components/Tabs/IconTabs.js";
import { withErrorBoundary } from "../../../../hoc.js";
import TokenAtRiskChart from "./TokenAtRiskChart.js";
import DebtAtRiskChart from "./DebtAtRiskChart.js";
import TimeSwitch from "../../../../components/TimeSwitch/TimeSwitch.js";

function TokenAtRiskTab(props) {
  const { symbol, isTokenCurrencyTotal, type } = props;

  const [modalOpen, setModalOpen] = useState(false);
  const toggleModalOpen = () => setModalOpen(!modalOpen);
  const [timePeriod, setTimePeriod] = useState(30);

  const [drop, setDrop] = useState(80);

  const dropOptions = [
    { key: 5, value: "5%" },
    { key: 10, value: "10%" },
    { key: 25, value: "25%" },
    { key: 50, value: "50%" },
    { key: 80, value: "80%" },
  ];

  const options = [
    { key: 7, value: "7 days" },
    { key: 30, value: "30 days" },
    { key: 90, value: "90 days" },
    { key: 180, value: "180 days" },
    { key: 365, value: "365 days" },
  ];

  const timeSwitch = (
    <TimeSwitch
      className="justify-content-end mb-3"
      activeOption={timePeriod}
      label={"days ago:"}
      onChange={setTimePeriod}
      options={options}
    />
  );
  const dropSwitch = (
    <TimeSwitch
      className="justify-content-end mb-3"
      activeOption={drop}
      label={"drop:"}
      onChange={setDrop}
      options={dropOptions}
    />
  );

  let title;
  let description;
  if (type === "at-risk") {
    title = `${symbol} at risk`;
    description =
      "Simulation of markets price drop (all assets fall for x% at the same time) and {symbol} is always used as collateral to liquidate. When wallet reach health rate under 1, 50% (or max 5M) of debt position is liquidated.";
  } else if (type === "debt-risk") {
    title = `Debt at risk per drop, for the last ${timePeriod} days`;
    description = "Historical overview across different price drops";
  }

  return (
    <>
      <div className="d-flex flex-direction-row justify-content-left align-items-center">
        <h4 className="mr-4">{title}</h4>
        <span role="button" className="link-primary" onClick={toggleModalOpen}>
          <FontAwesomeIcon icon={faInfoCircle} />
        </span>
      </div>
      <p className="gray">{description}</p>
      <div className="d-flex flex-direction-row justify-content-end align-items-center">
        {type === "at-risk" ? dropSwitch : timeSwitch}
      </div>
      <IconTabs
        tabs={[
          {
            title: <FontAwesomeIcon icon={faChartArea} />,
            content:
              type === "at-risk" ? (
                <TokenAtRiskChart
                  symbol={symbol}
                  drop={drop}
                  chartType="line"
                  isTokenCurrencyTotal={isTokenCurrencyTotal}
                />
              ) : (
                <DebtAtRiskChart symbol={symbol} timePeriod={timePeriod} />
              ),
          },
          {
            title: type === "at-risk" ? <FontAwesomeIcon icon={faChartBar} /> : null,
            content:
              type === "at-risk" ? (
                <TokenAtRiskChart
                  symbol={symbol}
                  drop={drop}
                  chartType="bar"
                  isTokenCurrencyTotal={isTokenCurrencyTotal}
                />
              ) : null,
          },
        ]}
        label="charts:"
      />
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

export default withErrorBoundary(TokenAtRiskTab);
