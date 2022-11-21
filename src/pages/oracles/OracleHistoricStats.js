// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import { React, useState } from "react";
import { useParams } from "react-router-dom";
import { Col, Row } from "reactstrap";
import Loader from "../../components/Loader/Loader.js";
import TimeSwitch from "../../components/TimeSwitch/TimeSwitch.js";
import { withErrorBoundary } from "../../hoc.js";
import { useFetch, usePageTitle } from "../../hooks";
import OracleHistoricStatsGraph from "./components/OracleHistoricStatsGraph.js";

function OracleHistoricStats(props) {
  const { symbol } = useParams();
  usePageTitle(symbol);

  const [daysAgo, setDaysAgo] = useState(30);
  const timeOptions = [
    { key: 1, value: "1 day" },
    { key: 7, value: "7 days" },
    { key: 30, value: "30 days" },
    { key: 180, value: "180 days" },
    { key: 365, value: "1 year" },
  ];

  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `aave/oracles/${symbol}/`,
    { days_ago: daysAgo }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  return (
    <>
      <h1 className="h3">oracle price history</h1>
      <div className="d-flex mb-3">
        <div className="mb-4 flex-grow-1"></div>
        <TimeSwitch
          className="mb-3 justify-content-end"
          activeOption={daysAgo}
          onChange={setDaysAgo}
          options={timeOptions}
        />
      </div>
      <Row className="mb-4">
        <Col xl={12} className="mb-4">
          <Row>
            <Col xl={12} className="mb-4">
              <Col xl={12}>
                <OracleHistoricStatsGraph symbol={symbol} data={data} />
              </Col>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}

export default withErrorBoundary(OracleHistoricStats);
