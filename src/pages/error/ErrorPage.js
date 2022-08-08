import React from "react";
import { Container } from "reactstrap";

function ErrorPage(props) {
  return (
    <Container>
      <div className="text-center">
        <h1 className="pb-4">404</h1>
        <p>Oops, it seems that this page does not exist.</p>
      </div>
    </Container>
  );
}

export default ErrorPage;
