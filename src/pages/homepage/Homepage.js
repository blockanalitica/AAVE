import React, { useState } from "react";
import { Col, Row } from "reactstrap";
import Loader from "../../components/Loader/Loader.js";
import Value from "../../components/Value/Value.js";
import ValueChange from "../../components/Value/ValueChange.js";
import { withErrorBoundary } from "../../hoc.js";
import { useFetch, usePageTitle } from "../../hooks";
import StatsBar from "../../components/Stats/StatsBar.js";
import TimeSwitch from "../../components/TimeSwitch/TimeSwitch.js";
import MarketsSection from "./components/MarketsSection.js";
import MarketsTable from "./components/MarketsTable.js";

function Homepage(props) {
  usePageTitle("Aave");

  const [timePeriod, setTimePeriod] = useState(7);
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    "aave/protocols/stats/",
    { days_ago: timePeriod }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const { stats } = data;

  const statsCard = [
    {
      title: "TVL",
      bigValue: (
        <>
          <Value
            value={stats.reduce((sum, item) => sum + item.tvl, 0)}
            decimals={2}
            prefix="$"
            compact
          />
        </>
      ),
      smallValue: (
        <ValueChange
          value={stats.reduce((sum, item) => sum + item.tvl - item.tvl_change, 0)}
          decimals={2}
          prefix="$"
          compact
          icon
          hideIfZero
          tooltipValue={stats.reduce((sum, item) => sum + item.tvl_change, 0)}
        />
      ),
    },
    {
      title: "total supply",
      bigValue: (
        <>
          <Value
            value={stats.reduce((sum, item) => sum + item.supply, 0)}
            decimals={2}
            prefix="$"
            compact
          />
        </>
      ),
      smallValue: (
        <ValueChange
          value={stats.reduce((sum, item) => sum + item.supply - item.supply_change, 0)}
          decimals={2}
          prefix="$"
          compact
          icon
          hideIfZero
          tooltipValue={stats.reduce((sum, item) => sum + item.supply_change, 0)}
        />
      ),
    },
    {
      title: "total borrow",
      bigValue: (
        <>
          <Value
            value={stats.reduce((sum, item) => sum + item.borrow, 0)}
            decimals={2}
            prefix="$"
            compact
          />
        </>
      ),
      smallValue: (
        <ValueChange
          value={stats.reduce((sum, item) => sum + item.borrow - item.borrow_change, 0)}
          decimals={2}
          prefix="$"
          compact
          icon
          hideIfZero
          tooltipValue={stats.reduce((sum, item) => sum + item.borrow_change, 0)}
        />
      ),
    },
  ];

  return (
    <>
      <div className="d-flex align-items-center">
        <div className="mb-2 flex-grow-1 d-flex align-items-center justify-content-end">
          <TimeSwitch activeOption={timePeriod} label={""} onChange={setTimePeriod} />
        </div>
      </div>
      <Row className="mb-4">
        <Col>
          <StatsBar stats={statsCard} />
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <MarketsTable data={data} />
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <MarketsSection />
        </Col>
      </Row>
    </>
  );
}

export default withErrorBoundary(Homepage);
