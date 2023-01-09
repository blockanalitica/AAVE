import classnames from "classnames";
import makeBlockie from "ethereum-blockies-base64";
import React, { useState } from "react";
import { Col, Row } from "reactstrap";
import { useLocation, useParams } from "react-router-dom";
import Address from "../../../components/Address/Address.js";
import Loader from "../../../components/Loader/Loader.js";
import SideTabNav from "../../../components/SideTab/SideTabNav.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch, usePageTitle } from "../../../hooks.js";
import logoDefiSaver from "../../../images/defisaver.svg";
import { shorten } from "../../../utils/address.js";
import { smartEtherscanUrl } from "../../../utils/url.js";
import WalletActivityTable from "./components/WalletActivityTable.js";
import WalletRawActivityTable from "./components/WalletRawActivityTable.js";
import WalletInfo from "./components/WalletInfo.js";
import WalletPositionsCard from "./components/WalletPositionsCard.js";
import styles from "./Wallet.module.scss";

function Wallet(props) {
  const { address } = useParams();
  const location = useLocation();
  usePageTitle(shorten(address));
  const [type, setType] = useState("pool");

  const { data, isLoading, isError, ErrorFallbackComponent, error } = useFetch(
    `wallets/${address}/`
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    // if endponit returns 404, still show the page but with no values
    if (error.response.status !== 404) {
      return <ErrorFallbackComponent />;
    }
  }

  const blockie = makeBlockie(address);
  const etherscanUrl = smartEtherscanUrl(location);
  const link = `${etherscanUrl}address/${address}`;
  const name = data.name || data.ens;

  return (
    <>
      <div className="d-flex flex-direction-row align-items-center mb-4">
        <img
          className={classnames(styles.roundedCircle, styles.walletLogo, "me-3")}
          src={blockie}
          alt={address}
        />
        <div className="flex-grow-1">
          <a
            href={link}
            className="d-flex align-items-center"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h1 className="h3 m-0">
              {name ? <span>{name} | </span> : null}
              <Address value={address} />
            </h1>
          </a>
        </div>
        {data && data.defisaver_protected ? (
          <img src={logoDefiSaver} alt="DefiSaver" />
        ) : null}
      </div>
      <WalletInfo data={data} />
      <WalletPositionsCard address={address} />

      <Row className="mb-3">
        <Col className="d-flex align-items-center">
          <h3 className="mb-0">activity</h3>
        </Col>
        <Col className="d-flex justify-content-end">
          <SideTabNav
            activeTab={type}
            toggleTab={setType}
            tabs={[
              { id: "pool", text: "pool-events" },
              { id: "raw", text: "raw-events" },
            ]}
          />
        </Col>
      </Row>

      {type === "pool" ? (
        <WalletActivityTable address={address} />
      ) : (
        <WalletRawActivityTable address={address} />
      )}
    </>
  );
}

export default withErrorBoundary(Wallet);
