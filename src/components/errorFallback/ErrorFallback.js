import React from "react";

function ErrorFallback(props) {
  return (
    <div className="text-center">
      <p>Oops, it seems that something went wrong.</p>
      <p className="small">
        Our engineers have been notified about the issue.
        <br />
        Please try again later.
      </p>
    </div>
  );
}

export default ErrorFallback;
