import PropTypes from "prop-types";
import React, { useState } from "react";
import { UncontrolledTooltip } from "reactstrap";
import _ from "lodash";

function CryptoIcon(props) {
  const { name, size, text, ...rest } = props;

  const uniqueIdentifier = `icon-${_.uniqueId()}`;

  const [isLoaded, setIsLoaded] = useState(false);

  let updatedName = name;

  if (name === "ethereum") {
    updatedName = "eth";
  } else if (name === "avalanche") {
    updatedName = "avax";
  } else if (name === "polygon") {
    updatedName = "matic";
  } else if (name === "arbitrum") {
    updatedName = "arb";
  } else if (name === "optimism") {
    updatedName = "op";
  } else if (name === "xSUSHI") {
    updatedName = "sushi";
  } else if (name === "WETH.e") {
    updatedName = "weth";
  } else if (name === "WBTC.e") {
    updatedName = "wbtc";
  } else if (name === "USDC.e") {
    updatedName = "usdc";
  } else if (name === "USDT.e") {
    updatedName = "usdt";
  } else if (name === "DAI.e") {
    updatedName = "dai";
  } else if (name === "WAVAX") {
    updatedName = "avax";
  } else if (name === "AAVE.e") {
    updatedName = "aave";
  } else if (name === "LINK.e") {
    updatedName = "link";
  } else if (name === "BTC.b") {
    updatedName = "btc";
  } else if (name === "sAVAX") {
    updatedName = "avax";
  } else if (name === undefined) {
    return null;
  } else if (name === "stMATIC") {
    updatedName = "matic";
  }

  const id = `icon-${updatedName.toLowerCase()}-${uniqueIdentifier}`;

  const baseUrl = "https://icons.blockanalitica.com/currency/";
  const src = `${baseUrl}${updatedName.toLowerCase()}.svg`;

  return name ? (
    <>
      <img
        {...rest}
        id={id}
        src={src}
        alt={updatedName}
        style={{ width: size, height: size }}
        onLoad={() => setIsLoaded(true)}
      />
      {isLoaded && (
        <UncontrolledTooltip placement="bottom" target={id}>
          {text ? `${text} ${updatedName}` : updatedName}
        </UncontrolledTooltip>
      )}
    </>
  ) : null;
}

CryptoIcon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.string,
  text: PropTypes.string,
};

CryptoIcon.defaultProps = {
  size: "1rem",
};

export default CryptoIcon;
