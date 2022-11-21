import PropTypes from "prop-types";
import React from "react";
import { UncontrolledTooltip } from "reactstrap";
import { uniqueId } from "lodash";
import { compact as compactNumber, formatToDecimals } from "../../utils/number.js";

function Value(props) {
  let {
    value,
    prefix,
    suffix,
    decimals,
    compact,
    compact100k,
    hideIfZero,
    id,
    ...rest
  } = props;

  if (value === undefined || value === null || (hideIfZero && value === 0)) {
    return "0";
  }
  let tooltip = null;

  const showCompactNum = compact100k === true && value >= 100000;
  if (compact === true || showCompactNum) {
    const normalValue = formatToDecimals(value, decimals);
    value = compactNumber(value, decimals, true);

    if (!id) {
      id = uniqueId("value_tooltip_");
      tooltip = (
        <UncontrolledTooltip placement="bottom" target={id}>
          {prefix}
          {normalValue}
          {suffix}
        </UncontrolledTooltip>
      );
    }
  } else {
    value = formatToDecimals(value, decimals);
  }

  return (
    <>
      <span id={id} {...rest}>
        {prefix}
        {value}
        {suffix}
      </span>
      {tooltip}
    </>
  );
}

Value.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  prefix: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  suffix: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  decimals: PropTypes.number.isRequired,
  compact: PropTypes.bool.isRequired,
  compact100k: PropTypes.bool.isRequired,
};

Value.defaultProps = {
  decimals: 2,
  compact: false,
  compact100k: false,
};
export default Value;
