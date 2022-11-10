import React from "react";
import { Breadcrumb, BreadcrumbItem } from "reactstrap";
import { v4 as uuid } from "uuid";
import { Link, useLocation } from "react-router-dom";
import { SLASH_REGEX, smartLocationPrefix } from "../../utils/url.js";

function BreadcrumbHistory(props) {
  const location = useLocation();

  const url = location.pathname.replace(SLASH_REGEX, "");
  let paths = url.split("/");

  if (paths.length >= 2) {
    const version = paths[0];
    if (["v2", "v3"].includes(version)) {
      paths = paths.slice(2);
    }
  }

  const prefix = smartLocationPrefix(location);
  const length = paths.length;
  if (length <= 1) {
    return null;
  }

  const breadcrumbs = paths.map((item, index) => {
    let middlewareUrl = paths.slice(0, index + 1).join("/");

    return (
      <BreadcrumbItem key={uuid()}>
        {length === index + 1 ? (
          item
        ) : (
          <Link to={`${prefix}${middlewareUrl}/`}>{item}</Link>
        )}
      </BreadcrumbItem>
    );
  });

  return (
    <Breadcrumb tag="nav" listTag="div">
      {breadcrumbs}
    </Breadcrumb>
  );
}

export default BreadcrumbHistory;
