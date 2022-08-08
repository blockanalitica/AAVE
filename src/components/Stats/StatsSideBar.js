import classnames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import Card from "../../components/Card/Card.js";
import styles from "./StatsBar.module.scss";

function StatsBar(props) {
  const { stats, cardTag, onClick, className, ...rest } = props;

  const Component = cardTag;

  let compArgs = {};
  if (typeof Component === "function" && String(Component).includes("Card")) {
    compArgs["fullHeight"] = false;
  }

  return (
    <Component
      {...compArgs}
      onClick={onClick}
      className={classnames(styles.wrapper, className)}
      {...rest}
    >
      <div className={styles.list}>
        <ul className="text-center">
          {stats.map((stat) => (
            <li className="mb-2">
              <div className="section-title">{stat.title}</div>
              {stat.bigValue ? <div className="text-big">{stat.bigValue}</div> : null}
              {stat.normalValue ? <div>{stat.normalValue}</div> : null}
              {stat.smallValue ? <div className="small">{stat.smallValue}</div> : null}
            </li>
          ))}
        </ul>
      </div>
    </Component>
  );
}

StatsBar.propTypes = {
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      bigValue: PropTypes.any,
      normalValue: PropTypes.any,
      smallValue: PropTypes.any,
    })
  ).isRequired,
  cardTag: PropTypes.any,
};

StatsBar.defaultProps = {
  cardTag: Card,
};

export default StatsBar;
