import React from "react";
import classnames from "classnames";
import makeBlockie from "ethereum-blockies-base64";
import { useParams } from "react-router-dom";
import Loader from "../../../components/Loader/Loader.js";
import { withErrorBoundary } from "../../../hoc.js";
import logoDefiSaver from "../../../images/defisaver.svg";
import { useFetch, usePageTitle } from "../../../hooks";
import { shorten } from "../../../utils/address.js";
import Address from "../../../components/Address/Address.js";
import WalletPositionsCard from "./components/WalletPositionsCard.js";
import WalletInfo from "./components/WalletInfo.js";
import WalletActivityTable from "./components/WalletActivityTable.js";
import styles from "./Wallet.module.scss";

function Wallet(props) {
  const { address } = useParams();

  usePageTitle(shorten(address));

  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `wallets/${address}/`
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const blockie = makeBlockie(data.address);

  const link = `https://etherscan.io/address/${data.address}`;

  return (
    <>
      <div className="d-flex flex-direction-row align-items-center mb-4">
        <div className="flex-grow-1">
          <a
            href={link}
            className="d-flex align-items-center"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              className={classnames(styles.roundedCircle, styles.walletLogo, "me-3")}
              src={blockie}
              alt={data.address}
            />
            <h1 className="h3 m-0">
              <Address value={data.address} />
            </h1>
          </a>
        </div>
        {data.defisaver_protected && <img src={logoDefiSaver} alt="DefiSaver" />}
      </div>
      <WalletInfo data={data} />
      <WalletPositionsCard address={address} />
      <WalletActivityTable address={address} />
    </>
  );
}

export default withErrorBoundary(Wallet);
