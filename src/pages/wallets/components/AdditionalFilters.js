import React, { useState } from "react";
import classnames from "classnames";
import { useNavigate } from "react-router-dom";
import queryString from "query-string";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { withErrorBoundary } from "../../../hoc.js";
import { getAllQueryParams } from "../../../utils/url.js";
import { useQueryParams } from "../../../hooks.js";
import Switch from "../../../components/Switch/Switch.js";
import Select from "../../../components/Select/Select.js";
import styles from "./AdditionalFilters.module.scss";

function AdditionalFilters(props) {
  const { className, assets: allAssets } = props;
  const navigate = useNavigate();
  const queryParams = useQueryParams();
  const qParams = getAllQueryParams(queryParams);

  const filters = ["non_insolvent", "supply_borrow", "no_dust", "asset", "risk"];
  const usingFilters = Object.keys(qParams).some((item) => filters.includes(item));
  const [showFilters, setShowFilters] = useState(usingFilters);

  const riskOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

  const selectedRiskOption = riskOptions.find(
    (option) => option.value === queryParams.get("risk")
  );

  const assets = queryParams.getAll("asset");
  let assetOptions = null;
  let selectedAssetOptions = null;
  if (allAssets) {
    assetOptions = allAssets.reduce((a, b) => {
      a.push({ value: b, label: b });
      return a;
    }, []);

    assetOptions = _.sortBy(assetOptions, ["value"]);

    selectedAssetOptions = assetOptions.reduce((x, option) => {
      if (assets.some((el) => el === option.value)) {
        x.push(option);
      }
      return x;
    }, []);
    selectedAssetOptions = _.sortBy(selectedAssetOptions, ["value"]);
  }

  const onAssetChange = (assets) => {
    const symbols = assets.reduce((a, b) => {
      a.push(b.value);
      return a;
    }, []);
    changeParam("asset", symbols);
  };

  const changeParam = (param, value) => {
    const newParams = { ...qParams, page: null, [param]: value };
    let qs = queryString.stringify(newParams, { skipNull: true });
    if (qs) {
      qs = `?${qs}`;
      navigate(qs);
    } else {
      navigate("./");
    }
  };

  return (
    <div className={classnames(className)}>
      <div
        className={classnames("link", styles.filterButton)}
        onClick={() => setShowFilters(!showFilters)}
      >
        filters
        <FontAwesomeIcon
          icon={showFilters ? faAngleDown : faAngleRight}
          className="ms-2"
        />
      </div>
      {showFilters ? (
        <div className="mt-2 react-bootstrap-table-search">
          <Switch
            label="show only non-insolvent"
            className="mb-2"
            checked={queryParams.get("non_insolvent") === "1"}
            onCheckedChange={(checked) => changeParam("non_insolvent", checked)}
          />
          <Switch
            label="show only wallets with supply and borrow"
            className="mb-2"
            checked={queryParams.get("supply_borrow") === "1"}
            onCheckedChange={(checked) => changeParam("supply_borrow", checked)}
          />
          <Switch
            label="hide wallets with supply below 100$"
            className="mb-2"
            checked={queryParams.get("no_dust") === "1"}
            onCheckedChange={(checked) => changeParam("no_dust", checked)}
          />
          {assetOptions ? (
            <div className="d-flex flex-grow-1 align-items-baseline mb-3">
              <span>Filter by tokens in wallets:</span>
              <div className="ps-2">
                <Select
                  options={assetOptions}
                  defaultValue={selectedAssetOptions}
                  onChange={(options) => onAssetChange(options)}
                  isMulti
                />
              </div>
            </div>
          ) : null}

          <div className="d-flex flex-grow-1 align-items-baseline mb-3">
            <span>filter by risk:</span>
            <div className="ps-2">
              <Select
                options={riskOptions}
                defaultValue={selectedRiskOption}
                onChange={(option) => changeParam("risk", option ? option.value : null)}
                isClearable
              />
            </div>
          </div>
        </div>
      ) : (
        false
      )}
    </div>
  );
}

export default withErrorBoundary(AdditionalFilters);
