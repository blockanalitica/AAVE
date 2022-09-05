import PropTypes from "prop-types";
import React from "react";
import { Input, FormGroup, Label } from "reactstrap";
import styles from "./Switch.module.scss";

function Switch(props) {
  const { label, onCheckedChange, checked, ...rest } = props;

  const inputParams = {};
  if (checked !== undefined) {
    inputParams["checked"] = checked;
  }

  return (
    <FormGroup switch {...rest}>
      <Input
        className={styles.switch}
        type="switch"
        role="switch"
        onChange={(e) => onCheckedChange(e.target.checked ? 1 : 0)}
        {...inputParams}
      />
      {label ? (
        <Label className={styles.label} for="exampleText">
          {label}
        </Label>
      ) : null}
    </FormGroup>
  );
}

Switch.propTypes = {
  label: PropTypes.any,
  checked: PropTypes.bool,
  onCheckedChange: PropTypes.func.isRequired,
};

export default Switch;
