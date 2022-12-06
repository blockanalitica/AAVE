import React from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import { smartEtherscanUrl } from "../../utils/url.js";

function EtherscanShort(props) {
  const location = useLocation();
  const { address, type } = props;
  const etherscanUrl = smartEtherscanUrl(location);
  let href;
  if (type === "txhash") {
    href = `${etherscanUrl}tx/${address}`;
  } else {
    href = `${etherscanUrl}address/${address}`;
  }
  const formated = address.slice(0, 5) + "..." + address.slice(-5);
  return (
    <>
      <a href={href} target="_blank" rel="noopener noreferrer">
        {formated}
      </a>
    </>
  );
}

EtherscanShort.propTypes = {
  type: PropTypes.string,
  address: PropTypes.string.isRequired,
};

export default EtherscanShort;
