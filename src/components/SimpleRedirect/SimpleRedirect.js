import React from "react";
import { Navigate, useParams, generatePath } from "react-router-dom";

function SimpleRedirect(props) {
  const { to, replace, state } = props;
  const params = useParams();
  const redirectWithParams = generatePath(to, params);

  return <Navigate to={redirectWithParams} replace={replace} state={state} />;
}

export default SimpleRedirect;
