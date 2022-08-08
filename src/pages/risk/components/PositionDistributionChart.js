import { faDollarSign, faHashtag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import React, { useState } from "react";
import Graph from "../../../components/Graph/Graph.js";
import Loader from "../../../components/Loader/Loader.js";
import IconTabs from "../../../components/Tabs/IconTabs.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";

function PositionDistributionChart(props) {
  const { position, tokenAddress, symbol } = props;

  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    "aave/tokens/position/distribution/",
    { position, token_address: tokenAddress }
  );
  const [currentTab, setCurrentTab] = useState("amount");
  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }
  let hovertemplate;
  const brackets = [];
  const counts = [];
  let text;
  if (currentTab === "amount") {
    data.forEach((row) => {
      brackets.push(row.bracket);
      counts.push(row.sum);
    });
    hovertemplate = "<br>Bracket: %{x}<br>Total value: $%{y:,.0f}<extra></extra>";
    text = "(total $ amount)";
  } else {
    data.forEach((row) => {
      brackets.push(row.bracket);
      counts.push(row.count);
    });
    hovertemplate = "<br>Bracket: %{x}<br>Count: %{y:,.0f}<extra></extra>";
    text = "(number of accounts)";
  }

  let titlePart = position[0].toUpperCase() + position.slice(1);
  let title;

  if (symbol) {
    title = `${symbol} ${titlePart} Position Distribution`;
  } else {
    title = `${titlePart} Position Distribution`;
  }

  let description;

  if (position === "supply") {
    if (symbol) {
      description = `Distribution of accounts by $ size of positions in supply side of market ${text}.`;
    } else {
      description = `Distribution of accounts by $ size of positions in supply side of markets ${text}.`;
    }
  } else if (position === "borrow") {
    if (symbol) {
      description = `Distribution of accounts by $ size of positions in borrow side of market ${text}.`;
    } else {
      description = `Distribution of accounts by $ size of positions in borrow side of markets ${text}.`;
    }
  }
  return (
    <IconTabs
      name={title}
      description={description}
      activeTab={currentTab}
      onTabChange={setCurrentTab}
      tabs={[
        {
          title: <FontAwesomeIcon icon={faDollarSign} />,
          id: "amount",
          content: (
            <Graph
              data={[
                {
                  x: brackets,
                  y: counts,
                  type: "bar",
                  hovertemplate: hovertemplate,
                },
              ]}
              layout={{
                yaxis: {
                  type: "log",
                  autorange: true,
                  tickprefix: "$",
                },
                legend: {
                  orientation: "h",
                  y: -0.15,
                },
              }}
            />
          ),
        },
        {
          title: <FontAwesomeIcon icon={faHashtag} />,
          id: "count",
          content: (
            <Graph
              data={[
                {
                  x: brackets,
                  y: counts,
                  type: "bar",
                  hovertemplate: hovertemplate,
                },
              ]}
              layout={{
                yaxis: {
                  type: "log",
                  autorange: true,
                },
                legend: {
                  orientation: "h",
                  y: -0.15,
                },
              }}
            />
          ),
        },
      ]}
    />
  );
}

PositionDistributionChart.propTypes = {
  position: PropTypes.string,
  tokenAddress: PropTypes.string,
  symbol: PropTypes.string,
};

export default withErrorBoundary(PositionDistributionChart);
