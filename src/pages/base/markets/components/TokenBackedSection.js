import {
  faChartArea,
  faChartLine,
  faPercent,
  faChartGantt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Col, Row } from "reactstrap";
import SideTabNav from "../../../../components/SideTab/SideTabNav.js";
import IconTabs from "../../../../components/Tabs/IconTabs.js";
import TimeSwitch from "../../../../components/TimeSwitch/TimeSwitch.js";
import { withErrorBoundary } from "../../../../hoc.js";
import RateHistoryChart from "./RateHistoryChart.js";
import SupplyBorrowChart from "./SupplyBorrowChart.js";
import TokenBackedHistoric from "./TokenBackedHistoric.js";
import TokenBackedHistoricShare from "./TokenBackedHistoricShare.js";
import TokenBackedHistoricStacked from "./TokenBackedHistoricStacked.js";
import TokenBackedSankey from "./TokenBackedSankey.js";
import UtilizationChart from "./UtilizationChart.js";

function TokenBackedSection(props) {
  const { symbol, hasBorrow, hasSupply, isTokenCurrencyTotal, ...rest } = props;
  const [type, setType] = useState("supply_borrow");
  let [timePeriod, setTimePeriod] = useState(30);

  const options = [
    { key: 7, value: "7 days" },
    { key: 30, value: "30 days" },
    { key: 90, value: "90 days" },
    { key: 180, value: "180 days" },
    { key: 365, value: "1 year" },
  ];
  let title;
  let description;
  if (type === "backed") {
    title = `${symbol} backed by assets for last ${timePeriod} days`;

    description = `assets in chart are backing borrowed ${symbol}. In this case we are counting only actively backed asset amounts (Total ${symbol} borrowed + LTV buffer)`;
  } else if (type === "backed-all") {
    title = `${symbol} backed by assets for last ${timePeriod} days`;
    description = `assets in chart are backing borrowed ${symbol}. In this case we are counting all backed asset amounts.`;
  } else if (type === "collateral") {
    title = `${symbol} used as collateral for last ${timePeriod} days`;
    description = `${symbol} used as collateral to borrow assets in chart.`;
  }

  let tabs = [
    { id: "supply_borrow", text: "supply/borrow history" },
    { id: "rates", text: "rates history" },
    { id: "utilization", text: "utilization history" },
  ];
  if (hasSupply) {
    tabs.push({ id: "collateral", text: `${symbol} used as collateral` });
  }
  if (hasBorrow) {
    tabs.push({ id: "backed", text: `${symbol} backed by assets` });
    tabs.push({ id: "backed-all", text: `${symbol} backed by assets (all)` });
  }

  let withLtv = 1;
  if (type === "backed-all") {
    withLtv = 0;
  }

  let content = null;
  let icontabs = [];
  if (type === "backed") {
    icontabs.push({
      title: <FontAwesomeIcon icon={faChartGantt} />,
      content: <TokenBackedSankey symbol={symbol} />,
    });
    icontabs.push({
      title: <FontAwesomeIcon icon={faChartLine} />,
      content: (
        <TokenBackedHistoric
          symbol={symbol}
          type={type}
          timePeriod={timePeriod}
          withLtv={withLtv}
        />
      ),
    });
    icontabs.push({
      title: <FontAwesomeIcon icon={faChartArea} />,
      content: (
        <TokenBackedHistoricStacked
          symbol={symbol}
          type={type}
          timePeriod={timePeriod}
          withLtv={withLtv}
        />
      ),
    });
    icontabs.push({
      title: <FontAwesomeIcon icon={faPercent} />,
      content: (
        <TokenBackedHistoricShare
          symbol={symbol}
          type={type}
          timePeriod={timePeriod}
          withLtv={withLtv}
        />
      ),
    });
  } else {
    icontabs.push({
      title: <FontAwesomeIcon icon={faChartLine} />,
      content: (
        <TokenBackedHistoric
          symbol={symbol}
          type={type}
          timePeriod={timePeriod}
          withLtv={withLtv}
        />
      ),
    });
    icontabs.push({
      title: <FontAwesomeIcon icon={faChartArea} />,
      content: (
        <TokenBackedHistoricStacked
          symbol={symbol}
          type={type}
          timePeriod={timePeriod}
          withLtv={withLtv}
        />
      ),
    });
  }

  if (type === "supply_borrow") {
    title = `total supply/borrow for last ${timePeriod} days`;
    description = `total supply/borrow for ${symbol}, real supply/borrow removes recursive positions.`;
    content = (
      <SupplyBorrowChart
        symbol={symbol}
        timePeriod={timePeriod}
        isTokenCurrencyTotal={isTokenCurrencyTotal}
      />
    );
  } else if (type === "utilization") {
    title = `utilization for last ${timePeriod} days`;
    description = "";
    content = <UtilizationChart symbol={symbol} timePeriod={timePeriod} />;
  } else if (type === "rates") {
    title = `rates for last ${timePeriod} days`;
    description = `supply/borrow APY changes`;
    content = <RateHistoryChart symbol={symbol} timePeriod={timePeriod} />;
  } else {
    content = <IconTabs key={type} tabs={icontabs} label="charts:" />;
  }

  if (type === "borrow") {
    content = icontabs[0].content;
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
