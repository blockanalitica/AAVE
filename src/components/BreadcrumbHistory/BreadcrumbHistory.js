import React from "react";
import { Breadcrumb, BreadcrumbItem } from "reactstrap";
import { v4 as uuid } from "uuid";
import { Link, useLocation } from "react-router-dom";

function BreadcrumbHistory(props) {
  let location = useLocation();
  const strippedUrl = location.pathname.replace(new RegExp("[/]+$"), "");
  let route = strippedUrl
    .split("/")
    .slice(1)
    .map((route) => {
      return (
        route &&
        route
          .split("-")
          .map((word) => word[0].toUpperCase() + word.slice(1))
          .join(" ")
      );
    });

  const length = route.length;
  if (length <= 1) {
    return null;
  }

  const breadcrumbs = route.map((item, index) => {
    let middlewareUrl =
      "/" +
      strippedUrl
        .split("/")
        .slice(1, index + 2)
        .join("/") +
      "/";

    return (
      <BreadcrumbItem key={uuid()}>
        {length === index + 1 ? item : <Link to={middlewareUrl}>{item}</Link>}
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
