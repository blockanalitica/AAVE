import React from "react";
import { withErrorBoundary } from "../../hoc.js";
import { usePageTitle } from "../../hooks";
import MarketsShare from "./components/MarketsShare.js";

function Risk(props) {
  usePageTitle("Risk");

  return (
    <>
      <h1 className="h3 mb-4">risk</h1>
      <MarketsShare className="mb-4" />
    </>
  );
}

export default withErrorBoundary(Risk);
