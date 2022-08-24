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
import UtilizationChart from "./UtilizationChart.js";

function TokenBackedSection(props) {
  const { slug, hasBorrow, hasSupply, isTokenCurrencyTotal, ...rest } = props;
  const [type, setType] = useState("supply_borrow");
  let [timePeriod, setTimePeriod] = useState(30);

  const options = [
    { key: 7, value: "7 days" },
    { key: 30, value: "30 days" },
    { key: 90, value: "90 days" },
  ];
  let title;
  let description;
  if (type === "backed") {
    title = `${slug} backed by assets for last ${timePeriod} days`;

    description = `assets in chart are backing borrowed ${slug}. In this case we are counting only actively backed asset amounts (Total ${slug} borrowed + LTV buffer)`;
  } else if (type === "backed-all") {
    title = `${slug} backed by assets for last ${timePeriod} days`;
    description = `assets in chart are backing borrowed ${slug}. In this case we are counting all backed asset amounts.`;
  } else if (type === "collateral") {
    title = `${slug} used as collateral for last ${timePeriod} days`;
    description = `${slug} used as collateral to borrow assets in chart.`;
  }

  let tabs = [
    { id: "supply_borrow", text: "supply/borrow history" },
    { id: "rates", text: "rates history" },
    { id: "utilization", text: "utilization history" },
  ];
  if (hasSupply) {
    tabs.push({ id: "collateral", text: `${slug} used as collateral` });
  }
  if (hasBorrow) {
    tabs.push({ id: "backed", text: `${slug} backed by assets` });
    tabs.push({ id: "backed-all", text: `${slug} backed by assets (all)` });
  }

  let withLtv = 1;
  if (type === "backed-all") {
    withLtv = 0;
  }

  let content = null;

  if (type === "supply_borrow") {
    title = `total supply/borrow for last ${timePeriod} days`;
    description = `total supply/borrow for ${slug}, real supply/borrow removes recursive positions.`;
    content = (
      <SupplyBorrowChart
        slug={slug}
        timePeriod={timePeriod}
        isTokenCurrencyTotal={isTokenCurrencyTotal}
      />
    );
  } else if (type === "utilization") {
    title = `utilization for last ${timePeriod} days`;
    description = "";
    content = <UtilizationChart slug={slug} timePeriod={timePeriod} />;
  } else if (type === "rates") {
    title = `rates for last ${timePeriod} days`;
    description = `supply/borrow APY changes`;
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
          <h4>{title}</h4>
          <p className="gray">{description}</p>
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
