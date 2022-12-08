import React from "react";
import { Link } from "react-router-dom";
import { Button, Col } from "reactstrap";
import Graph from "../../../../components/Graph/Graph.js";
import Loader from "../../../../components/Loader/Loader.js";
import { withErrorBoundary } from "../../../../hoc.js";
import { useFetch } from "../../../../hooks";
import { shorten } from "../../../../utils/address.js";
import {
  barGraphSeriesCountLimiter,
  tooltipLabelNumberWithPercent,
} from "../../../../utils/graph.js";
import { compact } from "../../../../utils/number.js";

function LiquidatorsTop10Chart(props) {
  const { daysAgo } = props;
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    "liquidations/liquidators/top10/",
    { days_ago: daysAgo }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  } else if (data.length === 0) {
    return <>No data</>;
  }

  const { series } = barGraphSeriesCountLimiter(data, "key", "value", 7, false);

  const newSeries = [
    {
      data: series[0]["data"],
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

  return (
    <>
      <h4>{title}</h4>
      <p className="gray">{description}</p>
      <Graph series={newSeries} options={options} type="bar" />
      <Col className="text-center mt-4">
        <Link to={`liquidators/?daysAgo=${daysAgo}`}>
          <Button color="primary">View More</Button>
        </Link>
      </Col>
    </>
  );
}

export default withErrorBoundary(LiquidatorsTop10Chart);
