import React from "react";
import { useParams } from "react-router-dom";
import { Col, Row } from "reactstrap";
import Loader from "../../components/Loader/Loader.js";
import { withErrorBoundary } from "../../hoc.js";
import { useFetch, usePageTitle } from "../../hooks";
import { shorten } from "../../utils/address.js";
import WalletPositionsCard from "./components/WalletPositionsCard.js";
import WalletProfile from "./components/WalletProfile.js";
import WalletInfo from "./components/WalletInfo.js";
import WalletActivityTable from "./components/WalletActivityTable.js";

function Wallet(props) {
  const { address } = useParams();

  usePageTitle(shorten(address));

  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `aave/wallets/${address}/`
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  return (
    <>
      <Row className="mb-4">
        <Col>
          <WalletProfile data={data} />
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <WalletInfo data={data} />
        </Col>
      </Row>
      <Row className="mb-4">
        <Col className="mb-4">
          <WalletPositionsCard address={address} />
        </Col>
      </Row>
      <Row className="mb-4">
        <Col className="mb-4">
          <WalletActivityTable address={address} />
        </Col>
      </Row>
    </>
  );
}

export default withErrorBoundary(Wallet);
