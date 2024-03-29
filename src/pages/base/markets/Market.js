import React, { useState } from "react";
import { Col, Row } from "reactstrap";
import { useParams } from "react-router-dom";
import CryptoIcon from "../../../components/CryptoIcon/CryptoIcon.js";
import CurrencySwitch from "../../../components/CurrencySwitch/CurrencySwitch.js";
import Loader from "../../../components/Loader/Loader.js";
import TimeSwitch from "../../../components/TimeSwitch/TimeSwitch.js";
import Value from "../../../components/Value/Value.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch, usePageTitle } from "../../../hooks";
import InfoCard from "./components/InfoCard.js";
import RiskSection from "./components/RiskSection.js";
import TokenBackedSection from "./components/TokenBackedSection.js";
import TokenInfo from "./components/TokenInfo.js";
import Top5 from "./Top5.js";
import MarketActivityTable from "./components/MarketActivityTable.js";
import MarketRawActivityTable from "./components/MarketRawActivityTable.js";
import { smartLocationPrefix } from "../../../utils/url.js";
import { useLocation } from "react-router-dom";

function Market(props) {
  const { symbol } = useParams();
  usePageTitle(symbol);

  const [timePeriod, setTimePeriod] = useState(1);
  const [isTokenCurrencyTotal, setIsTokenCurrencyTotal] = useState(false);
  const [isEventRaw, setEventView] = useState(false);
  const currencyOptions = [
    { key: "USD", value: "$" },
    { key: symbol, value: symbol },
  ];

  const { data, isLoading, isError, ErrorFallbackComponent, error } = useFetch(
    `markets/${symbol}/`,
    { days_ago: timePeriod }
  );
  const location = useLocation();
  const locationPrefix = smartLocationPrefix(location);

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    if (error.response.status !== 404) {
      return <ErrorFallbackComponent />;
    }
    window.location.href = `${locationPrefix}markets`;
  }

  const { symbol: underlyingSymbol, price, atoken_address, ...statsData } = data;

  return (
    <>
      <div className="d-flex align-items-center mb-2">
        <div className="mb-2 flex-grow-1 d-flex align-items-center">
          <CryptoIcon
            name={underlyingSymbol}
            address={atoken_address}
            size="3rem"
            className="me-2"
          />
          <h1 className="h3 m-0">
            {underlyingSymbol}{" "}
            <span className="gray">
              |{" "}
              <Value
                value={price}
                decimals={2}
                prefix="$"
                className="text-big"
                compact100k
              />
            </span>
          </h1>
        </div>
        <TimeSwitch activeOption={timePeriod} label={""} onChange={setTimePeriod} />
      </div>
      <div className="d-flex flex-direction-row justify-content-between align-items-center">
        <div className="mb-2 flex-grow-1 d-flex align-items-center justify-content-end">
          <small>
            <CurrencySwitch
              label="show in:"
              options={currencyOptions}
              onChange={(option) => setIsTokenCurrencyTotal(option === symbol)}
            />
          </small>
        </div>
      </div>
      <TokenInfo
        data={statsData}
        symbol={underlyingSymbol}
        isTokenCurrencyTotal={isTokenCurrencyTotal}
      />
      <RiskSection
        symbol={symbol}
        className="mb-4"
        isTokenCurrencyTotal={isTokenCurrencyTotal}
      />
      <InfoCard data={statsData} className="mb-4" />
      <TokenBackedSection
        symbol={symbol}
        hasBorrow={data.total_borrow > 0}
        hasSupply={data.liquidation_threshold > 0}
        isTokenCurrencyTotal={isTokenCurrencyTotal}
        className="mb-4"
      />
      <Top5 symbol={symbol} className="mb-4" />
      <Row className="mb-3">
        <Col className="d-flex align-items-center">
          <h3 className="mb-0">activity</h3>
        </Col>
        <Col className="d-flex justify-content-end">
          <CurrencySwitch
            label="view events"
            options={[
              { key: "pool", value: "Pool" },
              { key: "raw", value: "Token" },
            ]}
            onChange={(option) => setEventView(option === "raw")}
          />
        </Col>
      </Row>

      {isEventRaw ? (
        <MarketRawActivityTable symbol={symbol} />
      ) : (
        <MarketActivityTable symbol={symbol} />
      )}
    </>
  );
}

export default withErrorBoundary(Market);
