import React from "react";
import PropTypes from "prop-types";

function Address(props) {
  const { value, short } = props;
  let address = value;
  if (short) {
    address = value.slice(0, 5) + "..." + value.slice(-5);
  }
  return <>{address}</>;
}

Address.propTypes = {
  value: PropTypes.string.isRequired,
  short: PropTypes.bool,
};

Address.defaultProps = {
  short: false,
};

export default Address;
