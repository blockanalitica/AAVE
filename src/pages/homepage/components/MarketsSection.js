import React, { useState } from "react";
import { Col, Row } from "reactstrap";
import { faChartBar, faChartLine } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SideTabNav from "../../../components/SideTab/SideTabNav.js";
import { withErrorBoundary } from "../../../hoc.js";
import IconTabs from "../../../components/Tabs/IconTabs.js";
import TimeSwitch from "../../../components/TimeSwitch/TimeSwitch.js";
import MarketsChartLine from "./MarketsChartLine.js";
import MarketsChartBar from "./MarketsChartBar.js";

function MarketsSection(props) {
  const [type, setType] = useState("supply");
  const [timePeriod, setTimePeriod] = useState(30);
  const [currentTab, setCurrentTab] = useState("line");

  const options = [
    { key: 1, value: "1 day" },
    { key: 7, value: "7 days" },
    { key: 30, value: "30 days" },
    { key: 180, value: "180 days" },
    { key: 365, value: "1 year" },
  ];

  const tabs = [
    { id: "supply", text: "supply" },
    { id: "borrow", text: "borrow" },
    { id: "tvl", text: "tvl" },
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

  return (
    <div>
      <Row>
        <Col md={3}>
          <SideTabNav activeTab={type} toggleTab={setType} tabs={tabs} />
        </Col>
        <Col md={9}>
          {currentTab === "line" ? timeSwitch : null}
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
                content: <MarketsChartBar dataType={`${type}-share`} />,
              },
            ]}
          />
        </Col>
      </Row>
    </div>
  );
}

export default withErrorBoundary(MarketsSection);
