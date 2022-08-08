import classnames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import styles from "./Stat.module.scss";

function Stat(props) {
  const { className, name, children, border, ...rest } = props;

  return (
    <div
      className={classnames(
        { [styles.border]: !!border },
        "d-flex",
        styles.stat,
        className
      )}
      {...rest}
    >
      <span className={classnames("flex-grow-1", styles.name)}>{name}</span>
      <span>{children}</span>
    </div>
  );
}

Stat.propTypes = {
  title: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  id: PropTypes.string,
  children: PropTypes.any,
  className: PropTypes.string,
  fullHeight: PropTypes.bool,
};

export default Stat;
