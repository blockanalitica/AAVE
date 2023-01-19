import React, { useState } from "react";
import { Col, Row } from "reactstrap";
import { faChartBar, faChartLine } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SideTabNav from "../../../../components/SideTab/SideTabNav.js";
import { withErrorBoundary } from "../../../../hoc.js";
import IconTabs from "../../../../components/Tabs/IconTabs.js";
import TimeSwitch from "../../../../components/TimeSwitch/TimeSwitch.js";
import MarketsChartLine from "./MarketsChartLine.js";
import MarketsChartLineDebtAtRisk from "./MarketsChartLineDebtAtRisk.js";
import MarketsChartBar from "./MarketsChartBar.js";
import TotalAtRiskSection from "./TotalAtRiskSection.js";

function MarketsSection(props) {
  const [type, setType] = useState("at-risk");
  const [timePeriod, setTimePeriod] = useState(30);
  const [currentTab, setCurrentTab] = useState("line");

  const options = [
    { key: 7, value: "7 days" },
    { key: 30, value: "30 days" },
    { key: 90, value: "90 days" },
    { key: 180, value: "180 days" },
    { key: 365, value: "1 year" },
  ];

  const tabs = [
    { id: "at-risk", text: "collateral at risk" },
    { id: "supply", text: "total supply" },
    { id: "borrow", text: "total borrow" },
    { id: "tvl", text: "total TVL" },
    { id: "debt-risk", text: "Debt at risk" },
  ];

  const timeSwitch = (
    <TimeSwitch
      className="justify-content-end mb-3"
      activeOption={timePeriod}
      label={""}
      onChange={setTimePeriod}
      options={options}
    />
  );

  let content;
  let timeswitchContent;

  let title;
  let description;

  if (type === "supply") {
    title = `total supply for last ${timePeriod} days`;
    description =
      "total supply for all markets, real supply removes recursive positions.";
  } else if (type === "borrow") {
    title = `total borrow for last ${timePeriod} days`;
    description =
      "total borrow for all markets, real borrow removes recursive positions.";
  } else if (type === "tvl") {
    title = `total TVL for last ${timePeriod} days`;
    description = "total TVL for all markets";
  } else if (type === "debt-risk") {
    title = `Debt at risk per drop, for the last ${timePeriod} days`;
    description = "Historical overview across different price drops";
  }

  if (type === "at-risk") {
    content = <TotalAtRiskSection />;
  } else {
    if (currentTab === "line") {
      timeswitchContent = timeSwitch;
    } else {
      timeswitchContent = null;
    }
    content = (
      <>
        <h4>{title}</h4>
        <p className="gray">{description}</p>
        {timeswitchContent}
        {type !== "debt-risk" ? (
          <IconTabs
            activeTab={currentTab}
            onTabChange={setCurrentTab}
            label="charts:"
            tabs={[
              {
                id: "line",
                title: <FontAwesomeIcon icon={faChartLine} />,
                content: <MarketsChartLine dataType={type} timePeriod={timePeriod} />,
              },
              {
                id: "bar",
                title: <FontAwesomeIcon icon={faChartBar} />,
                content: <MarketsChartBar dataType={type} timePeriod={timePeriod} />,
              },
            ]}
          />
        ) : (
          <MarketsChartLineDebtAtRisk dataType={type} timePeriod={timePeriod} />
        )}
      </>
    );
  }

  return (
    <div>
      <Row>
        <Col md={3}>
          <SideTabNav activeTab={type} toggleTab={setType} tabs={tabs} />
        </Col>
        <Col md={9}>{content}</Col>
      </Row>
    </div>
  );
}

export default withErrorBoundary(MarketsSection);
