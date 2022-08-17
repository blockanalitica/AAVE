import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Col, Row } from "reactstrap";
import Loader from "../../components/Loader/Loader.js";
import TimeSwitch from "../../components/TimeSwitch/TimeSwitch.js";
import CryptoIcon from "../../components/CryptoIcon/CryptoIcon.js";
import { withErrorBoundary } from "../../hoc.js";
import { useFetch, usePageTitle } from "../../hooks";
import Value from "../../components/Value/Value.js";
import TokenBackedSection from "./components/TokenBackedSection.js";
import TokenInfo from "./components/TokenInfo.js";
import InfoCard from "./components/InfoCard.js";
import RiskSection from "./components/RiskSection.js";
import CurrencySwitch from "../../components/CurrencySwitch/CurrencySwitch.js";

function Token(props) {
  const { symbol } = useParams();
  usePageTitle(symbol);

  const [timePeriod, setTimePeriod] = useState(1);
  const [isTokenCurrencyTotal, setIsTokenCurrencyTotal] = useState(false);

  const currencyOptions = [
    { key: "USD", value: "$" },
    { key: symbol, value: symbol },
  ];

  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `aave/tokens/${symbol}/`,
    { days_ago: timePeriod }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const { slug, underlying_symbol: underlyingSymbol, address } = data;

  const hasBorrow = data.total_borrow > 0;
  const hasSupply = data.liquidation_threshold > 0;

  return (
    <>
      <div className="d-flex align-items-center mb-2">
        <div className="mb-2 flex-grow-1 d-flex align-items-center">
          <CryptoIcon
            name={underlyingSymbol}
            address={address}
            size="3rem"
            className="me-2"
          />
          <h1 className="h3 m-0">
            {slug} |{" "}
            <Value
              value={data.underlying_price}
              decimals={2}
              prefix="$"
              className="text-big"
              compact100k
            />
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
        data={data}
        symbol={symbol}
        isTokenCurrencyTotal={isTokenCurrencyTotal}
      />

      <Row className="mb-4">
        <Col>
          <RiskSection
            slug={symbol}
            className="mb-4"
            isTokenCurrencyTotal={isTokenCurrencyTotal}
          />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <InfoCard data={data} />
        </Col>
      </Row>

      <TokenBackedSection
        slug={symbol}
        hasBorrow={hasBorrow}
        hasSupply={hasSupply}
        isTokenCurrencyTotal={isTokenCurrencyTotal}
        className="mb-4"
      />
    </>
  );
}

export default withErrorBoundary(Token);
