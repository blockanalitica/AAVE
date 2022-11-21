// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import _ from "lodash";
import { withErrorBoundary } from "../../../hoc.js";
import { tooltipLabelNumber, tooltipTitleDateTime } from "../../../utils/graph.js";
import { compact } from "../../../utils/number.js";
import { parseUTCDateTimestamp } from "../../../utils/datetime.js";
import Graph from "../../../components/Graph/Graph.js";

function OracleHistoricStatsGraph(props) {
  const { data } = props;
  if (!data) {
    return null;
  }

  const grouped = _.groupBy(data, "key");
  const series = [];

  Object.entries(grouped).forEach(([key, rows]) => {
    series.push({
      label: key,

      data: rows.map((row) => ({
        x: parseUTCDateTimestamp(row["timestamp"]),
        y: row["amount"],
      })),
    });
  });

  const options = {
    interaction: {
      axis: "x",
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
        },
      },
      y: {
        stacked: false,
        ticks: {
          callback: (value) => compact(value, 2, true),
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            return tooltipTitleDateTime(tooltipItems);
          },
          label: (tooltipItem) => {
            return tooltipLabelNumber(tooltipItem, "$");
          },
        },
      },
    },
  };

  return <Graph series={series} options={options} />;
}

export default withErrorBoundary(OracleHistoricStatsGraph);
