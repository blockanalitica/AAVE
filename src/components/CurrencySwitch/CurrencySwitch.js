import PropTypes from "prop-types";
import React, { useState } from "react";
import classnames from "classnames";
import styles from "./CurrencySwitch.module.scss";

function CurrencySwitch(props) {
  let { label, className, onChange, activeOption, options, ...rest } = props;

  if (!options) {
    options = [
      { key: "USD", value: "USD" },
      { key: "token", value: "token" },
    ];
  }

  const [active, setActive] = useState(activeOption || options[0].key);

  const onOptionClick = (option) => {
    setActive(option);
    if (onChange) {
      onChange(option);
    }
  };

  return (
    <div className={classnames(styles.currencySwitchContainer, className)}>
      {label ? <label className={styles.currencySwitchLabel}>{label}</label> : null}
      <ul className={styles.currencySwitch} {...rest}>
        {options.map((option) => (
          <li
            key={option.key}
            className={classnames(styles.currencySwitchItem, {
              [styles.currencySwitchItemActive]: option.key === active,
            })}
            onClick={() => onOptionClick(option.key)}
          >
            {option.value}
          </li>
        ))}
      </ul>
    </div>
  );
}

CurrencySwitch.propTypes = {
  label: PropTypes.any,
  onChange: PropTypes.func,
  activeOption: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  options: PropTypes.array,
};

export default CurrencySwitch;
