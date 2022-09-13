import PropTypes from "prop-types";
import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import LoadingOverlay from "react-loading-overlay";
import { useNavigate } from "react-router-dom";
import queryString from "query-string";
import { useQueryParams } from "../../hooks.js";
import { getAllQueryParams } from "../../utils/url.js";
import LinkTable from "./LinkTable.js";

function RemoteTable(props) {
  const navigate = useNavigate();
  const queryParams = useQueryParams();
  const qParams = getAllQueryParams(queryParams);

  const {
    onPageChange,
    onSortChange,
    onSearch,
    page,
    pageSize,
    totalPageSize,
    onRowClick,
    loading,
    navigateOnChange,
    ...rest
  } = props;

  const handleTableChange = (type, { page, sortOrder, sortField, searchText }) => {
    let params = {};
    switch (type) {
      case "pagination":
        if (onPageChange) {
          onPageChange(page);
        } else {
          params["page"] = page;
        }
        break;
      case "sort":
        let sort = sortField;
        if (sortOrder === "desc") {
          sort = `-${sortField}`;
        }

        if (onSortChange) {
          if (onPageChange) {
            onPageChange(page);
          }
          onSortChange(sort);
        } else {
          // reset pagination
          params["page"] = 1;
          params["order"] = sort;
        }
        break;
      case "search":
        let sText = searchText;
        if (!searchText) {
          // If searchText is empty or whatever, we set it to null, to solve the
          // issue where in most cases we want to treat null, undefined and empty
          // string the same way in search
          sText = null;
        }
        if (onSearch) {
          if (onPageChange) {
            onPageChange(1);
          }
          onSearch(sText);
        } else {
          params["page"] = 1;
          params["search"] = sText;
        }
        break;
      default:
      // pass
    }

    if (params) {
      const newParams = { ...qParams, ...params };
      let qs = queryString.stringify(newParams, { skipNull: true });
      if (qs) {
        qs = `?${qs}`;
        navigate(qs);
      }
    }
  };

  const Component = onRowClick === undefined ? BootstrapTable : LinkTable;

  return (
    <LoadingOverlay active={loading} spinner>
      <Component
        bootstrap4
        remote
        hover
        onRowClick={onRowClick}
        bordered={false}
        keyField="address"
        onTableChange={handleTableChange}
        pagination={paginationFactory({
          page,
          sizePerPageList: [],
          sizePerPage: pageSize,
          showTotal: true,
          totalSize: totalPageSize,
        })}
        {...rest}
      />
    </LoadingOverlay>
  );
}

RemoteTable.propTypes = {
  onPageChange: PropTypes.func,
  onSortChange: PropTypes.func,
  onSearch: PropTypes.func,
  page: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  totalPageSize: PropTypes.number.isRequired,
  onRowClick: PropTypes.func,
  loading: PropTypes.bool,
  navigateOnChange: PropTypes.bool,
};

export default RemoteTable;
