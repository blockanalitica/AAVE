import React, { useState } from "react";
import { Col, Row } from "reactstrap";

import Loader from "../../../components/Loader/Loader.js";
import Value from "../../../components/Value/Value.js";
import ValueChange from "../../../components/Value/ValueChange.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch, usePageTitle, useSmartNavigate } from "../../../hooks";
import StatsBar from "../../../components/Stats/StatsBar.js";
import TimeSwitch from "../../../components/TimeSwitch/TimeSwitch.js";
import MarketsSection from "./components/MarketsSection.js";
import MarketsTable from "./components/MarketsTable.js";

function Homepage(props) {
  usePageTitle("Aave");

  const navigate = useSmartNavigate();
  const [timePeriod, setTimePeriod] = useState(1);
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    "markets/stats/",
    { days_ago: timePeriod }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  let options = [
    { key: 1, value: "1 day" },
    { key: 7, value: "7 days" },
    { key: 30, value: "30 days" },
    { key: 90, value: "90 days" },
  ];
  const onValueClick = (e, url) => {
    navigate(url);
    e.stopPropagation();
  };

  const { stats } = data;

  const statsCard = [
    {
      title: "TVL",
      bigValue: (
        <>
          <Value value={stats.tvl} decimals={2} prefix="$" compact />
        </>
      ),
      smallValue: (
        <ValueChange
          value={stats.tvl - stats.tvl_change}
          decimals={2}
          prefix="$"
          compact
          icon
          hideIfZero
          tooltipValue={stats.tvl_change}
        />
      ),
    },
    {
      title: "total supply",
      bigValue: (
        <>
          <Value value={stats.supply} decimals={2} prefix="$" compact />
        </>
      ),
      smallValue: (
        <ValueChange
          value={stats.supply - stats.supply_change}
          decimals={2}
          prefix="$"
          compact
          icon
          hideIfZero
          tooltipValue={stats.supply_change}
        />
      ),
    },
    {
      title: "total real supply",
      bigValue: (
        <>
          <Value value={stats.real_supply} decimals={2} prefix="$" compact />
        </>
      ),
      smallValue: (
        <ValueChange
          value={stats.real_supply - stats.real_supply_change}
          decimals={2}
          prefix="$"
          compact
          icon
          hideIfZero
          tooltipValue={stats.real_supply_change}
        />
      ),
    },
    {
      title: "total borrow",
      bigValue: (
        <>
          <Value value={stats.borrow} decimals={2} prefix="$" compact />
        </>
      ),
      smallValue: (
        <ValueChange
          value={stats.borrow - stats.borrow_change}
          decimals={2}
          prefix="$"
          compact
          icon
          hideIfZero
          tooltipValue={stats.borrow_change}
        />
      ),
    },
    {
      title: "total real borrow",
      bigValue: (
        <>
          <Value value={stats.real_borrow} decimals={2} prefix="$" compact />
        </>
      ),
      smallValue: (
        <ValueChange
          value={stats.real_borrow - stats.real_borrow_change}
          decimals={2}
          prefix="$"
          compact
          icon
          hideIfZero
          tooltipValue={stats.real_borrow_change}
        />
      ),
    },
  ];

  return (
    <>
      <div className="d-flex align-items-center">
        <div className="mb-2 flex-grow-1 d-flex align-items-center justify-content-end">
          <TimeSwitch
            activeOption={timePeriod}
            label={""}
            onChange={setTimePeriod}
            options={options}
          />
        </div>
      </div>
      <Row className="mb-4">
        <Col>
          <StatsBar
            stats={statsCard}
            role="button"
            onClick={(e) => onValueClick(e, `markets/`)}
          />
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <MarketsSection />
        </Col>
      </Row>
      <Row className="mb-4">
        <h3>top markets</h3>
        <Col>
          <MarketsTable daysAgo={timePeriod} />
        </Col>
      </Row>
      {/* <Row className="mb-4">
        <h3>risk</h3>
        <Col>
          <TotalAtRiskSection />
        </Col>
      </Row> */}
    </>
  );
}

export default withErrorBoundary(Homepage);
