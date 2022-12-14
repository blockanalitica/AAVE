import React, { useState } from "react";
import { Col, Row } from "reactstrap";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader.js";
import Value from "../../components/Value/Value.js";
import ValueChange from "../../components/Value/ValueChange.js";
import { withErrorBoundary } from "../../hoc.js";
import { useFetch, usePageTitle } from "../../hooks";
import StatsBar from "../../components/Stats/StatsBar.js";
import TimeSwitch from "../../components/TimeSwitch/TimeSwitch.js";
import MarketsSection from "./components/MarketsSection.js";
import ProtocolsTable from "./components/ProtocolsTable.js";

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
          <Value value={stats[0].tvl + stats[1].tvl} decimals={2} prefix="$" compact />
        </>
      ),
      smallValue: (
        <ValueChange
          value={stats[0].tvl+stats[1].tvl - stats[0].tvl_change - stats[1].tvl_change}
          decimals={2}
          prefix="$"
          compact
          icon
          hideIfZero
          tooltipValue={stats[0].tvl_change+stats[1].tvl_change}
        />
      ),
    },
    {
      title: "total supply",
      bigValue: (
        <>
          <Value value={stats[0].supply+stats[1].supply} decimals={2} prefix="$" compact />
        </>
      ),
      smallValue: (
        <ValueChange
          value={stats[0].supply+stats[1].supply - stats[0].supply_change - stats[1].supply_change}
          decimals={2}
          prefix="$"
          compact
          icon
          hideIfZero
          tooltipValue={stats[0].supply_change+stats[1].supply_change}
        />
      ),
    },
    {
      title: "total borrow",
      bigValue: (
        <>
          <Value value={stats[0].borrow + stats[1].borrow } decimals={2} prefix="$" compact />
        </>
      ),
      smallValue: (
        <ValueChange
          value={stats[0].borrow + stats[1].borrow - stats[0].borrow_change - stats[1].borrow_change}
          decimals={2}
          prefix="$"
          compact
          icon
          hideIfZero
          tooltipValue={stats[0].borrow_change + stats[1].borrow_change}
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
          <StatsBar
            stats={statsCard}
           
          />
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <MarketsSection />
        </Col>
      </Row>
      <Row className="mb-4">
        <h3>protocols</h3>
        <Col>
          <ProtocolsTable daysAgo={timePeriod} />
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
