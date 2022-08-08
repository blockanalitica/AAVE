import React, { useState } from "react";
import { Col, Row } from "reactstrap";
import { useParams } from "react-router-dom";
import LiquidatorTable from "./components/LiquidatorTable.js";
import LiquidatorStats from "./components/LiquidatorStats";
import TimeSwitch from "../../components/TimeSwitch/TimeSwitch.js";
import { useQueryParams } from "../../hooks";

function Liquidator(props) {
  const queryParams = useQueryParams();
  let params = useParams();
  const queryDaysAgo = queryParams.get("daysAgo") || 30;
  const [daysAgo, setDaysAgo] = useState(queryDaysAgo);
  const timeOptions = [
    { key: 7, value: "7 days" },
    { key: 30, value: "30 days" },
    { key: 90, value: "90 days" },
    { key: 365, value: "1 year" },
    { key: 9999, value: "All" },
  ];

  return (
    <div>
      <Row>
        <Col xl={12} className="mb-4">
          <TimeSwitch
            className="mb-3 justify-content-end"
            activeOption={daysAgo}
            onChange={setDaysAgo}
            options={timeOptions}
          />
          <LiquidatorStats address={params.address} daysAgo={daysAgo} />
        </Col>
        <Col xl={12} className="mb-4">
          <LiquidatorTable address={params.address} daysAgo={daysAgo} />
        </Col>
      </Row>
    </div>
  );
}

export default Liquidator;
