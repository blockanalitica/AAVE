import React from "react";
import PropTypes from "prop-types";
import { DateTime } from "luxon";
import { UncontrolledTooltip } from "reactstrap";
import _ from "lodash";

function DateTimeAgo(props) {
  let { dateTime, showTime, showDate, format, inDays, ...rest } = props;

  if (!dateTime) {
    return null;
  }

  if (!format) {
    format = "LLL dd, yyyy HH:mm:ss";
    if (!showTime) {
      format = "LLL dd, yyyy";
    }
    if (!showDate) {
      format = "HH:mm:ss";
    }
  }
  const options = {
    locale: "en",
  };
  if (inDays) {
    options["unit"] = ["days", "hours", "minutes", "seconds"];
  }

  const value = dateTime.toRelative(options);

  const id = _.uniqueId("datetimeago-");
  return (
    <>
      <span id={id} {...rest}>
        {value}
      </span>
      <UncontrolledTooltip placement="bottom" target={id}>
        {dateTime.toFormat(format)}
      </UncontrolledTooltip>
    </>
  );
}

DateTimeAgo.propTypes = {
  dateTime: PropTypes.instanceOf(DateTime),
  showTime: PropTypes.bool.isRequired,
  showDate: PropTypes.bool.isRequired,
  format: PropTypes.string,
  inDays: PropTypes.bool.isRequired,
};

DateTimeAgo.defaultProps = {
  showTime: true,
  showDate: true,
  inDays: false,
};

export default DateTimeAgo;
