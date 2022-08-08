import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classnames from "classnames";
import { uniqueId } from "lodash";
import PropTypes from "prop-types";
import React from "react";
import { UncontrolledTooltip } from "reactstrap";
import { compact as compactNumber, formatToDecimals } from "../../utils/number.js";
import Value from "../Value/Value.js";

function ValueChange(props) {
  let {
    value,
    prefix,
    suffix,
    decimals,
    className,
    hideIfZero,
    reverse,
    compact,
    compact100k,
    icon,
    tooltipValue,
    noPositive,
    ...rest
  } = props;

  if (
    value === undefined ||
    value === null ||
    isNaN(value) ||
    (hideIfZero && value === 0)
  ) {
    return "";
  }

  const rawValue = value;

  const id = uniqueId("valuechange_tooltip_");

  let spanClass = "";
  let iconPlace = "";
  let symbolPrefix = "";
  if (value > 0) {
    if (reverse) {
      spanClass = "text-danger";
    } else {
      spanClass = "text-success";
    }
    symbolPrefix = "+";
    if (icon) {
      iconPlace = <FontAwesomeIcon icon={faArrowUp} />;
      symbolPrefix = "";
    }
  } else if (value < 0) {
    if (reverse) {
      spanClass = "text-success";
    } else {
      spanClass = "text-danger";
    }
    symbolPrefix = "-";
    if (icon) {
      iconPlace = <FontAwesomeIcon icon={faArrowDown} />;
      symbolPrefix = "";
    }
  }

  if (noPositive && value > 0) {
    symbolPrefix = "";
  }

  const classNames = classnames(spanClass, className);

  value = Math.abs(value);
  const showCompactNum = compact100k === true && value >= 100000;
  let tooltipBox = null;

  const normalValue = formatToDecimals(value, decimals);
  if (hideIfZero && normalValue === "0") {
    return "";
  }

  if (compact === true || showCompactNum) {
    value = compactNumber(value, decimals, true);
    tooltipBox = (
      <UncontrolledTooltip placement="bottom" target={id}>
        {prefix}
        {rawValue}
        {suffix}
      </UncontrolledTooltip>
    );
  } else {
    value = normalValue;
  }

  // Override existing tooltipBox (if it's set) if tooltipValue is set
  if (tooltipValue) {
    tooltipBox = (
      <UncontrolledTooltip placement="bottom" target={id}>
        <Value value={tooltipValue} prefix={prefix} suffix={suffix} />
      </UncontrolledTooltip>
    );
  }

  return (
    <>
      <span className={classNames} id={id} {...rest}>
        {iconPlace} {symbolPrefix}
        {prefix}
        {value}
        {suffix}
      </span>
      {tooltipBox}
    </>
  );
}

ValueChange.propTypes = {
  value: PropTypes.number,
  prefix: PropTypes.string,
  suffix: PropTypes.string,
  decimals: PropTypes.number.isRequired,
  className: PropTypes.string,
  hideIfZero: PropTypes.bool.isRequired,
  reverse: PropTypes.bool,
  compact: PropTypes.bool.isRequired,
  compact100k: PropTypes.bool.isRequired,
  icon: PropTypes.bool.isRequired,
  tooltipValue: PropTypes.number,
  noPositive: PropTypes.bool,
};

ValueChange.defaultProps = {
  decimals: 2,
  hideIfZero: false,
  reverse: false,
  compact: false,
  compact100k: false,
  icon: false,
  noPositive: false,
};

export default ValueChange;
