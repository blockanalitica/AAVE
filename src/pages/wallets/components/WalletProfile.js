import React from "react";
import classnames from "classnames";
import makeBlockie from "ethereum-blockies-base64";
import { useLocation } from "react-router-dom";
import { withErrorBoundary } from "../../../hoc.js";
import logoDefiSaver from "../../../images/defisaver.svg";
import Address from "../../../components/Address/Address.js";
import { smartEtherscanUrl } from "../../../utils/url.js";
import styles from "./WalletProfile.module.scss";

function WalletProfile(props) {
  const location = useLocation();
  const { data } = props;
  if (!data) {
    return null;
  }

  const blockie = makeBlockie(data.info.address);
  const etherscanUrl = smartEtherscanUrl(location);
  const link = `${etherscanUrl}address/${data.info.address}`;

  return (
    <div className="d-flex flex-direction-row align-items-center mb-4">
      <div className="flex-grow-1">
        <a href={link} className="d-flex align-items-center">
          <img
            className={classnames(styles.roundedCircle, styles.walletLogo, "me-3")}
            src={blockie}
            alt={data.info.address}
          />
          <h1 className="h3 m-0">
            <Address value={data.info.address} />
          </h1>
        </a>
      </div>
      {data.info.defisaver_protected && <img src={logoDefiSaver} alt="DefiSaver" />}
    </div>
  );
}

export default withErrorBoundary(WalletProfile);
