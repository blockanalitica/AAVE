import { faChartBar, faChartLine } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Col, Row } from "reactstrap";
import IconTabs from "../../../components/Tabs/IconTabs.js";
import { withErrorBoundary } from "../../../hoc.js";
import TokenDepegChart from "./TokenDepegChart.js";
import TimeSwitch from "../../../components/TimeSwitch/TimeSwitch.js";

function DepegSection(props) {
  const { slug, isTokenCurrencyTotal, showPrice } = props;

  const [drop, setDrop] = useState(99);

  const dropOptions = [
    { key: 5, value: "5%" },
    { key: 10, value: "10%" },
    { key: 25, value: "25%" },
    { key: 50, value: "50%" },
    { key: 80, value: "80%" },
    { key: 99, value: "99%" },
  ];

  let description;

  if (slug === "stETH") {
    description = `Simulation of ${slug} depeg from ETH (all other assets stay at current prices). When wallet reach health rate under 1, 50% (or max 5M) of debt position is liquidated.`;
  } else {
    description = `Simulation of ${slug} price drop (all other assets stay at current prices). When wallet reach health rate under 1, 50% (or max 5M) of debt position is liquidated.`;
  }
  return (
    <div>
      <Row>
        <Col xl={12}>
          <h4>{slug} at risk</h4>
          <p className="gray">{description}</p>
          <div className="d-flex flex-direction-row justify-content-end align-items-center">
            <TimeSwitch
              className="mb-3 justify-content-end"
              label="drop:"
              activeOption={drop}
              onChange={setDrop}
              options={dropOptions}
            />
          </div>

          <IconTabs
            tabs={[
              {
                title: <FontAwesomeIcon icon={faChartLine} />,
                content: (
                  <TokenDepegChart
                    slug={slug}
                    drop={drop}
                    showPrice={showPrice}
                    chartType="line"
                    isTokenCurrencyTotal={isTokenCurrencyTotal}
                  />
                ),
              },
              {
                title: <FontAwesomeIcon icon={faChartBar} />,
                content: (
                  <TokenDepegChart
                    slug={slug}
                    drop={drop}
                    showPrice={showPrice}
                    chartType="bar"
                    isTokenCurrencyTotal={isTokenCurrencyTotal}
                  />
                ),
              },
            ]}
            label="charts:"
          />
        </Col>
      </Row>
    </div>
  );
}

export default withErrorBoundary(DepegSection);