import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Address from "../Address/Address.js";

function WalletOrZapper(props) {
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
      <Link to={`/wallets/${address}/`}>
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
