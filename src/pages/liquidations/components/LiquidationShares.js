import { Link } from "react-router-dom";
import { Button, Col } from "reactstrap";
import React from "react";
import Graph from "../../../components/Graph/Graph.js";
import Loader from "../../../components/Loader/Loader.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";
import { compact } from "../../../utils/number.js";
import { shorten } from "../../../utils/address.js";
import { SYMBOLS_PALETTE } from "../../../utils/colors.js";
import {
  tooltipLabelNumberWithPercent,
  barGraphSeriesCountLimiter,
} from "../../../utils/graph.js";

function LiquidationShares(props) {
  const { type, daysAgo, address } = props;
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    "aave/liquidations/share/",
    { type, days_ago: daysAgo, address }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  } else if (data.length === 0) {
    return <>No data</>;
  }

  let limit;
  if (type === "top_ten") {
    limit = false;
  } else {
    limit = true;
  }
  const { series } = barGraphSeriesCountLimiter(data, "key", "value", 7, limit);

  const backgroundColor = series[0]["data"].map((row) => {
    return SYMBOLS_PALETTE[row["x"]] || (limit ? "#0e1726" : "#03A9F4");
  });

  const newSeries = [
    {
      data: series[0]["data"],
      backgroundColor,
    },
  ];

  const options = {
    interaction: {
      axis: "x",
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => "$" + compact(value, 2, true),
        },
      },
    },

    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return tooltipLabelNumberWithPercent(tooltipItem, "$");
          },
        },
      },
    },
  };

  let description;
  let title;
  if (type === "collateral") {
    description =
      "shows distribution of bought collateral assets in the protocol for selected timeframe.";
    title = `collateral seized for last ${daysAgo} days`;
  } else if (type === "debt") {
    description =
      "shows distribution of repaid borrowed assets in the protocol for selected timeframe.";
    title = `debt repaid for last ${daysAgo} days`;
  } else {
    description =
      "shows distribution of volume in liquidation events per liquidator for selected timeframe.";
    title = `top ten liquidators for last ${daysAgo} days`;
    options["scales"]["x"] = {
      ticks: {
        callback: function (value, index, ticks) {
          return shorten(this.getLabelForValue(value));
        },
      },
    };
  }

  return (
    <>
      <h4>{title}</h4>
      <p className="gray">{description}</p>
      <Graph series={newSeries} options={options} type="bar" />
      {type === "top_ten" ? (
        <Col className="text-center mt-4">
          <Link to={`/liquidations/liquidators/?daysAgo=${daysAgo}`}>
            <Button color="primary">View More</Button>
          </Link>
        </Col>
      ) : (
        <></>
      )}
    </>
  );
}

export default withErrorBoundary(LiquidationShares);
