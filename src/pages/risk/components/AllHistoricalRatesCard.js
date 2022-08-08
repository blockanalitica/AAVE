import PropTypes from "prop-types";
import { faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import IconTabs from "../../../components/Tabs/IconTabs.js";
import React, { useState } from "react";
import Graph from "../../../components/Graph/Graph.js";
import Loader from "../../../components/Loader/Loader.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";
import Card from "../../../components/Card/Card.js";

function AllHistoricalRatesCard(props) {
  const [denomination, setDenomination] = useState("native");
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `aave/risk/historical-rewards/`,
    { denomination }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  let description;
  let hovertemplate;
  if (denomination === "native") {
    description = "Total daily reward emissions denominated in AAVE.";
    hovertemplate = "Datetime: %{x}<br>Reward: %{y:,.0f} AAVE<br><extra></extra>";
  } else {
    description = "Total daily reward emissions denominated in USD.";
    hovertemplate = "Datetime: %{x}<br>Reward: %{y:,.0f} USD<br><extra></extra>";
  }
  const { rows, column_names } = data;

  if (!rows || rows.length === 0) {
    return <div>No data</div>;
  }

  // Transpose 2d table
  const rowData = rows[0].map((_, colIndex) => rows.map((row) => row[colIndex]));

  const columnNames = column_names.slice(1);

  const graphData = columnNames.map((columnName, colIndex) => {
    return {
      x: rowData[0],
      y: rowData[colIndex + 1],
      name: columnName,
      type: "scatter",
      mode: "lines",
      hovertemplate: hovertemplate,
    };
  });

  return (
    <Card title="Reward emission per day">
      <div>
        <IconTabs
          description={description}
          activeTab={denomination}
          onTabChange={setDenomination}
          tabs={[
            {
              title: "AAVE",
              id: "native",
              content: (
                <Graph
                  data={graphData}
                  layout={{
                    yaxis: {
                      ticksuffix: " AAVE",
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
              title: <FontAwesomeIcon icon={faDollarSign} />,
              id: "USD",
              content: (
                <Graph
                  data={graphData}
                  layout={{
                    showlegend: false,
                    yaxis: {
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
          ]}
        />
      </div>
    </Card>
  );
}

AllHistoricalRatesCard.propTypes = {
  slug: PropTypes.string,
};

export default withErrorBoundary(AllHistoricalRatesCard);
