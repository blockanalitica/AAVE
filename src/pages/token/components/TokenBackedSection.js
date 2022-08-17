import React, { useState } from "react";
import { Col, Row } from "reactstrap";
import { faChartBar, faChartLine } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import IconTabs from "../../../components/Tabs/IconTabs.js";
import SideTabNav from "../../../components/SideTab/SideTabNav.js";
import { withErrorBoundary } from "../../../hoc.js";
import TokenBackedChart from "./TokenBackedChart.js";
import TokenBackedHistoric from "./TokenBackedHistoric.js";
import TimeSwitch from "../../../components/TimeSwitch/TimeSwitch.js";
import SupplyBorrowChart from "./SupplyBorrowChart.js";
import RateHistoryChart from "./RateHistoryChart.js";

function TokenBackedSection(props) {
  const { slug, hasBorrow, hasSupply, ...rest } = props;
  const [type, setType] = useState("supply_borrow");
  let [timePeriod, setTimePeriod] = useState(30);

  const options = [
    { key: 7, value: "7 days" },
    { key: 30, value: "30 days" },
    { key: 90, value: "90 days" },
  ];

  let description;
  if (type === "backed") {
    description = `assets in chart are backing borrowed ${slug}. In this case we are counting only actively backed asset amounts (Total ${slug} borrowed + LTV buffer)`;
  } else if (type === "backed-all") {
    description = `assets in chart are backing borrowed ${slug}. In this case we are counting all backed asset amounts.`;
  } else if (type === "collateral") {
    description = `${slug} used as collateral to borrow assets in chart.`;
  }

  let tabs = [
    { id: "supply_borrow", text: "supply/borrow history" },
    { id: "rates", text: "rates history" },
  ];
  // if (hasSupply) {
  //   tabs.push({ id: "collateral", text: `${slug} used as collateral` });
  // }
  // if (hasBorrow) {
  //   tabs.push({ id: "backed", text: `${slug} backed by assets.` });
  //   tabs.push({ id: "backed-all", text: `${slug} backed by assets (all)` });
  // }

  if (type === "supply_borrow" || type === "rates") {
    options.shift();
    if (timePeriod === 1) {
      setTimePeriod(7);
    }
  }

  let withLtv = 1;
  if (type === "backed-all") {
    withLtv = 0;
  }

  let content = null;
  if (type === "supply_borrow") {
    content = <SupplyBorrowChart slug={slug} timePeriod={timePeriod} />;
  } else if (type === "rates") {
    content = <RateHistoryChart slug={slug} timePeriod={timePeriod} />;
  } else {
    content = (
      <IconTabs
        tabs={[
          {
            title: <FontAwesomeIcon icon={faChartLine} />,
            content: (
              <TokenBackedHistoric
                slug={slug}
                type={type}
                timePeriod={timePeriod}
                withLtv={withLtv}
              />
            ),
          },
          {
            title: <FontAwesomeIcon icon={faChartBar} />,
            content: <TokenBackedChart slug={slug} type={type} />,
          },
        ]}
        label="charts:"
      />
    );
  }

  return (
    <div {...rest}>
      <Row>
        <Col md={3}>
          <SideTabNav activeTab={type} toggleTab={setType} tabs={tabs} />
        </Col>
        <Col md={9}>
          <div className="mb-3">{description}</div>
          <TimeSwitch
            className="justify-content-end mb-3"
            activeOption={timePeriod}
            label={""}
            onChange={setTimePeriod}
            options={options}
          />
          {content}
        </Col>
      </Row>
    </div>
  );
}

export default withErrorBoundary(TokenBackedSection);
