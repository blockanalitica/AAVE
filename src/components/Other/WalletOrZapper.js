import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Address from "../Address/Address.js";
import { smartLocationPrefix } from "../../utils/url.js";
import { useLocation } from "react-router-dom";

function WalletOrZapper(props) {
  const location = useLocation();
  const prefix = smartLocationPrefix(location);
  const { address, isZapper } = props;

  if (isZapper) {
    return (
      <a
        href={`https://zapper.fi/account/${address}?tab=history`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Address value={address} short />
      </a>
    );
  } else {
    return (
      <Link
        to={prefix.length > 0 ? `${prefix}wallets/${address}/` : `/wallets/${address}/`}
      >
        <Address value={address} short />
      </Link>
    );
  }
}

WalletOrZapper.propTypes = {
  address: PropTypes.string.isRequired,
  isZapper: PropTypes.bool.isRequired,
};

export default WalletOrZapper;
