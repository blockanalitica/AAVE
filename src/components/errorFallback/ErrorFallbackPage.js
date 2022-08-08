import React from "react";
import { Container } from "reactstrap";
import ErrorFallback from "./ErrorFallback.js";

function ErrorFallbackPage(props) {
  return (
    <Container>
      <ErrorFallback {...props} />
    </Container>
  );
}

export default ErrorFallbackPage;
