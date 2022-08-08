import React from "react";

import PropTypes from "prop-types";

function EtherscanShort(props) {
  const { address, type } = props;
  let href;
  if (type === "txhash") {
    href = `https://etherscan.io/tx/${address}`;
  } else {
    href = `https://etherscan.io/address/${address}`;
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
