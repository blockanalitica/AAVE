import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import styles from "./LinkTable.module.scss";

function LinkTable(props) {
  const { onRowClick, ...rest } = props;

  const rowEvents = {
    onClick: (e, row, rowIndex) => {
      onRowClick(row);
    },
  };

  const handleOnSelect = (row, isSelect) => {
    onRowClick(row);
  };

  return (
    <BootstrapTable
      hover
      bootstrap4
      bordered={false}
      rowEvents={rowEvents}
      rowClasses="cursor-pointer"
      selectRow={{
        selectColumnPosition: "right",
        mode: "radio",
        onSelect: handleOnSelect,
        hideSelectAll: true,
        selectionRenderer: ({ mode, ...rest }) => (
          <FontAwesomeIcon className={styles.icon} icon={faAngleRight} />
        ),
      }}
      {...rest}
    />
  );
}

LinkTable.propTypes = {
  onRowClick: PropTypes.func,
};

export default LinkTable;
