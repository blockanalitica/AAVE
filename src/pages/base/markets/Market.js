import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../../../components/Loader/Loader.js";
import TimeSwitch from "../../../components/TimeSwitch/TimeSwitch.js";
import CryptoIcon from "../../../components/CryptoIcon/CryptoIcon.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch, usePageTitle } from "../../../hooks";
import Value from "../../../components/Value/Value.js";
import TokenBackedSection from "./components/TokenBackedSection.js";
import TokenInfo from "./components/TokenInfo.js";
import InfoCard from "./components/InfoCard.js";
import RiskSection from "./components/RiskSection.js";
import CurrencySwitch from "../../../components/CurrencySwitch/CurrencySwitch.js";
import Top5 from "./Top5.js";

function Market(props) {
  const { symbol } = useParams();
  usePageTitle(symbol);

  const [timePeriod, setTimePeriod] = useState(1);
  const [isTokenCurrencyTotal, setIsTokenCurrencyTotal] = useState(false);

  const currencyOptions = [
    { key: "USD", value: "$" },
    { key: symbol, value: symbol },
  ];

  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `markets/${symbol}/`,
    { days_ago: timePeriod }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
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
      <Top5 symbol={symbol} />
    </>
  );
}

export default withErrorBoundary(Market);
