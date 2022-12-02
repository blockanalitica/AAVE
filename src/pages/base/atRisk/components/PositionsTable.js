import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classnames from "classnames";
import makeBlockie from "ethereum-blockies-base64";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UncontrolledTooltip } from "reactstrap";
import Address from "../../../../components/Address/Address.js";
import CryptoIcon from "../../../../components/CryptoIcon/CryptoIcon.js";
import Loader from "../../../../components/Loader/Loader.js";
import RemoteTable from "../../../../components/Table/RemoteTable.js";
import Value from "../../../../components/Value/Value.js";
import { useFetch } from "../../../../hooks";
import styles from "./PositionsTable.module.scss";
function PositionsTable(props) {
  const { address, drop } = props;
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [drop]);

  let pageSize;
  if (address) {
    pageSize = 10;
  } else {
    pageSize = 25;
  }

  const { data, isLoading, isPreviousData, isError, ErrorFallbackComponent } = useFetch(
    "at-risk/positions/",
    {
      drop,
      address,
      p: page,
      p_size: pageSize,
    },
    { keepPreviousData: true }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const uniqueId = () => {
    return _.uniqueId("prediction-");
  };

  return (
    <>
      {data.results.length > 0 ? (
        <RemoteTable
          loading={isPreviousData}
          keyField="id"
          hover={false}
          data={data.results}
          columns={[
            {
              dataField: "",
              text: "",
              formatter: (_, row) => {
                const blockie = makeBlockie(row.address);
                return (
                  <>
                    <img
                      className={classnames(
                        styles.roundedCircle,
                        styles.walletLogo,
                        "me-3"
                      )}
                      src={blockie}
                      alt={row.address}
                    />
                  </>
                );
              },
            },
            {
              dataField: "address",
              text: "Address",
              sort: false,
              formatter: (cell) => (
                <Link to={`/wallets/${cell}/`} key={cell}>
                  <Address value={cell} />
                </Link>
              ),
            },
            {
              dataField: "drop",
              text: "Price drop",
              sort: false,
              formatter: (cell) => (
                <Value value={cell * -100} decimals={0} suffix="%" />
              ),
            },
            {
              dataField: "collateral_price",
              text: "At collateral price",
              sort: false,
              formatter: (cell, row) => (
                <Value value={cell} decimals={2} prefix="$" compact100k />
              ),
            },
            {
              dataField: "collateral_amount_usd",
              text: "Collateral at Risk",
              sort: false,
              formatter: (cell, row) => (
                <Value value={cell} decimals={2} prefix="$" compact100k />
              ),
            },
            {
              dataField: null,
              text: "Prediction",
              formatter: (cell, row) => {
                let collId = uniqueId();
                let debtId = uniqueId();
                return (
                  <span className={styles.liquidationIcons}>
                    <CryptoIcon name={row.debt_symbol} size="2em" id={debtId} />
                    <UncontrolledTooltip placement="bottom" target={debtId}>
                      {"Debt: " + row.debt_symbol}
                    </UncontrolledTooltip>
                    <FontAwesomeIcon icon={faArrowRight} />
                    <CryptoIcon name={row.collateral_symbol} size="2em" id={collId} />
                    <UncontrolledTooltip placement="bottom" target={collId}>
                      {"Collateral: " + row.collateral_symbol}
                    </UncontrolledTooltip>
                  </span>
                );
              },
            },
          ]}
          page={page}
          pageSize={pageSize}
          totalPageSize={data.count}
          onPageChange={setPage}
        />
      ) : (
        <div className="text-center mt-4 gray">
          No wallets at risk of being liquidated at {drop}% general market price drop
        </div>
      )}
    </>
  );
}

export default PositionsTable;
