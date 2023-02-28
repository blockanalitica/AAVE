import React, { useState } from "react";
import { Col, Row } from "reactstrap";

import SideTabNav from "../../../components/SideTab/SideTabNav.js";
import { withErrorBoundary } from "../../../hoc.js";
import IconTabs from "../../../components/Tabs/IconTabs.js";
import TimeSwitch from "../../../components/TimeSwitch/TimeSwitch.js";
import MarketsChartLine from "./MarketsChartLine.js";

function MarketsSection(props) {
  const [type, setType] = useState("supply");
  const [timePeriod, setTimePeriod] = useState(7);
  const [currentTab, setCurrentTab] = useState("line");

  const options = [
    { key: 7, value: "7 days" },
    { key: 30, value: "30 days" },
    { key: 180, value: "180 days" },
    { key: 365, value: "1 year" },
  ];

  const tabs = [
    { id: "supply", text: "total supply" },
    { id: "borrow", text: "total borrow" },
    { id: "tvl", text: "total TVL" },
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
    description = "total supply for each market";
  } else if (type === "borrow") {
    title = `total borrow for last ${timePeriod} days`;
    description = "total borrow for each market";
  } else if (type === "tvl") {
    title = `total TVL for last ${timePeriod} days`;
    description = "total value locked for each market";
  }

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
      <IconTabs
        activeTab={currentTab}
        onTabChange={setCurrentTab}
        tabs={[
          {
            id: "line",
            content: <MarketsChartLine dataType={type} timePeriod={timePeriod} />,
          },
        ]}
      />
    </>
  );

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
