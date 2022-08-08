import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import styles from "./Loader.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

function Loader(props) {
  const { className, size } = props;
  return (
    <div className={classnames(styles.root, className)}>
      <FontAwesomeIcon icon={faSpinner} pulse style={{ fontSize: size }} />
    </div>
  );
}

Loader.propTypes = {
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

Loader.defaultProps = {
  size: "2rem",
};

export default Loader;
