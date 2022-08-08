import _ from "lodash";
import { DateTime } from "luxon";
import { compact, round } from "./number.js";

export const tooltipLabelNumber = (tooltipItem, prefix, suffix) => {
  let label = tooltipItem.dataset.label || "";
  if (label) {
    label += ": ";
  }
  if (tooltipItem.parsed.y !== null) {
    label += (prefix || "") + compact(tooltipItem.parsed.y, 2, true);
  }
  return `${label}${suffix || ""}`;
};

export const tooltipLabelNumberWithPercent = (tooltipItem, prefix, suffix) => {
  let label = tooltipLabelNumber(tooltipItem, prefix, suffix);
  if (tooltipItem.parsed.y !== null) {
    const total = tooltipItem.dataset.data.reduce((total, row) => total + row.y, 0);
    const percentage = round((tooltipItem.parsed.y / total) * 100);
    label += ` (${percentage}%)`;
  }
  return label;
};

export const tooltipFooterTotal = (tooltipItems, prefix, suffix) => {
  const total = tooltipItems.reduce((total, tooltip) => total + tooltip.parsed.y, 0);
  return `${prefix || ""}` + compact(total, 2, true) + `${suffix || ""}`;
};

export const tooltipTitleDateTime = (
  tooltipItems,
  showDate = true,
  showTime = true,
  format = null
) => {
  if (!format) {
    format = "LLL dd, yyyy HH:mm:ss";
    if (!showTime) {
      format = "LLL dd, yyyy";
    }
    if (!showDate) {
      format = "HH:mm:ss";
    }
  }

  return DateTime.fromMillis(tooltipItems[0].parsed.x).toFormat(format, {
    locale: "en",
  });
};

export const pieTooltipLabelNumber = (tooltipItem, prefix, suffix) => {
  let label = tooltipItem.label || "";
  if (label) {
    label += ": ";
  }

  if (tooltipItem.parsed !== null) {
    const total = tooltipItem.dataset.data.reduce(
      (total, datapoint) => total + datapoint,
      0
    );
    const percentage = round((tooltipItem.parsed / total) * 100);
    label +=
      (prefix || "") +
      compact(tooltipItem.parsed, 2, true) +
      `${suffix || ""}` +
      ` (${percentage}%)`;
  }
  return label;
};

export const piePercentLabels = (
  percentLimit = 10,
  showLabel = true,
  showPercent = true
) => {
  return {
    align: "end",
    textAlign: "center",
    anchor: "center",
    offset: 5,
    formatter: (value, ctx) => {
      const total = ctx.dataset.data.reduce((total, datapoint) => total + datapoint, 0);

      const percentage = (value / total) * 100;
      if (percentage > percentLimit) {
        const labels = [];

        if (showLabel) {
          labels.push(ctx.chart.data.labels[ctx.dataIndex]);
        }
        if (showPercent) {
          labels.push(compact(percentage, 2) + "%");
        }
        return labels;
      }
      return null;
    },
  };
};

export const pieGraphDataLimiter = (data, labelKey, valueKey, percentLimit = 2) => {
  const sortedObjs = _.sortBy(data, valueKey).reverse();
  const total = data.reduce((total, row) => total + row[valueKey], 0);

  const labels = [];
  const values = [];
  let otherValue = 0;

  sortedObjs.forEach((row) => {
    const value = row[valueKey];
    const percent = (value / total) * 100;

    if (percent > percentLimit) {
      labels.push(row[labelKey]);
      values.push(value);
    } else {
      otherValue += value;
    }
  });

  if (otherValue > 0) {
    values.push(otherValue);
    labels.push("Other");
  }

  const series = [{ data: values }];
  return { series, labels };
};

export const barGraphDataLimiter = (
  data,
  labelKey,
  valueKey,
  percentLimit = 2,
  limit = true
) => {
  const sortedObjs = _.sortBy(data, valueKey).reverse();
  const total = data.reduce((total, row) => total + row[valueKey], 0);
  let otherValue = 0;

  const seriesData = [];

  if (limit) {
    sortedObjs.forEach((row) => {
      const value = row[valueKey];
      const percent = (value / total) * 100;

      if (percent > percentLimit) {
        seriesData.push({
          x: row[labelKey],
          y: value,
        });
      } else {
        otherValue += value;
      }
    });

    if (otherValue > 0) {
      seriesData.push({
        x: "Other",
        y: otherValue,
      });
    }
  } else {
    sortedObjs.forEach((row) => {
      seriesData.push({
        x: row[labelKey],
        y: row[valueKey],
      });
    });
  }

  const series = [
    {
      data: seriesData,
    },
  ];

  return { series };
};

export const barGraphSeriesCountLimiter = (
  data,
  labelKey,
  valueKey,
  number = 10,
  limit = true
) => {
  const sortedObjs = _.sortBy(data, valueKey).reverse();

  let otherValue = 0;
  const seriesData = [];

  if (limit) {
    sortedObjs.forEach((row, index) => {
      if (index < number) {
        seriesData.push({
          x: row[labelKey],
          y: row[valueKey],
        });
      } else {
        otherValue += row[valueKey];
      }
    });

    if (otherValue > 0) {
      seriesData.push({
        x: "Other",
        y: otherValue,
      });
    }
  } else {
    sortedObjs.forEach((row) => {
      seriesData.push({
        x: row[labelKey],
        y: row[valueKey],
      });
    });
  }

  const series = [
    {
      data: seriesData,
    },
  ];

  return { series };
};
