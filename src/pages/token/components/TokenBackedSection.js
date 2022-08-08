import React, { useState } from "react";
import { Col, Row } from "reactstrap";
import SideTabNav from "../../../components/SideTab/SideTabNav.js";
import { withErrorBoundary } from "../../../hoc.js";
import TokenBackedChart from "./TokenBackedChart.js";
import TokenBackedHistoric from "./TokenBackedHistoric.js";
import TimeSwitch from "../../../components/TimeSwitch/TimeSwitch.js";
import SupplyBorrowChart from "./SupplyBorrowChart.js";
import RateHistoryChart from "./RateHistoryChart.js";

function TokenBackedSection(props) {
  const { slug, hasBorrow, ...rest } = props;
  const [type, setType] = useState("supply_borrow");
  let [timePeriod, setTimePeriod] = useState(30);

  const options = [
    { key: 1, value: "1 day" },
    { key: 7, value: "7 days" },
    { key: 30, value: "30 days" },
    { key: 90, value: "90 days" },
  ];

  let description;
  if (type === "backed") {
    description = `${slug} borrowed against assets (collateral) in chart.`;
  } else if (type === "collateral") {
    description = `${slug} used as collateral to borrow assets in chart.`;
  }

  let tabs = [
    { id: "supply_borrow", text: "supply/borrow history" },
    { id: "rates", text: "rates history" },
    { id: "collateral", text: "used as collateral" },
  ];
  if (hasBorrow) {
    tabs.push({ id: "backed", text: "borrowed by collateral" });
  }

  if (type === "supply_borrow" || type === "rates") {
    options.shift();
    if (timePeriod === 1) {
      setTimePeriod(7);
    }
  }

  let content = null;
  if (type === "supply_borrow") {
    content = <SupplyBorrowChart slug={slug} timePeriod={timePeriod} />;
  } else if (type === "rates") {
    content = <RateHistoryChart slug={slug} timePeriod={timePeriod} />;
  } else {
    if (timePeriod === 1) {
      content = <TokenBackedChart slug={slug} type={type} />;
    } else {
      content = <TokenBackedHistoric slug={slug} type={type} timePeriod={timePeriod} />;
    }
  }

  return (
    <div {...rest}>
      <Row>
        <Col md={3}>
          <SideTabNav activeTab={type} toggleTab={setType} tabs={tabs} />
        </Col>
        <Col md={9}>
          <TimeSwitch
            className="justify-content-end"
            activeOption={timePeriod}
            label={""}
            onChange={setTimePeriod}
            options={options}
          />
          <div className="mb-3">{description}</div>
          {content}
        </Col>
      </Row>
    </div>
  );
}

export default withErrorBoundary(TokenBackedSection);
